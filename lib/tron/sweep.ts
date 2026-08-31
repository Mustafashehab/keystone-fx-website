// TronWeb's dynamic contract API does not currently expose complete TypeScript
// types. All amounts crossing this boundary remain validated bigint/strings.
// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import {
  atomicToDecimalString,
  decimalToAtomicUnits,
  parseAtomicUnits,
  USDT_ATOMIC_FACTOR,
} from './amounts'
import { TRON_CONFIG } from './config'

const CONFIRMATION_POLL_ATTEMPTS = 16
const CONFIRMATION_POLL_INTERVAL_MS = 3000
const TX_HASH_PATTERN = /^[0-9a-f]{64}$/

type ConfirmationState = 'confirmed' | 'failed' | 'pending'

interface ConfirmationResult {
  state: ConfirmationState
  reason: string
}

interface SweepClaim {
  operationId: string
  walletId: string
  tronAddress: string
  encryptedPrivateKey: string
  ledgerBalance: string
  status: 'prepared' | 'broadcast' | 'manual_review'
  usdtAmount: string
  usdtTxHash: string | null
}

interface TronAddressCodec {
  address: {
    toHex: (address: string) => string
  }
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

function isSweepClaim(value: unknown): value is SweepClaim {
  if (!value || typeof value !== 'object') return false
  const claim = value as Record<string, unknown>
  return typeof claim.operationId === 'string'
    && typeof claim.walletId === 'string'
    && typeof claim.tronAddress === 'string'
    && typeof claim.encryptedPrivateKey === 'string'
    && typeof claim.ledgerBalance === 'string'
    && typeof claim.usdtAmount === 'string'
    && (claim.usdtTxHash === null || typeof claim.usdtTxHash === 'string')
    && ['prepared', 'broadcast', 'manual_review'].includes(String(claim.status))
}

function extractTransactionHash(result: unknown): string | null {
  if (typeof result === 'string') return result.toLowerCase()
  if (!result || typeof result !== 'object') return null

  const candidate = result as {
    txid?: unknown
    transaction?: { txID?: unknown }
    result?: { txid?: unknown }
  }
  const txHash = candidate.txid
    ?? candidate.transaction?.txID
    ?? candidate.result?.txid

  return typeof txHash === 'string' ? txHash.toLowerCase() : null
}

function sameTronAddress(tron: TronAddressCodec, left: unknown, right: string): boolean {
  if (typeof left !== 'string') return false
  try {
    return tron.address.toHex(left).toLowerCase() === tron.address.toHex(right).toLowerCase()
  } catch {
    return left === right
  }
}

async function queryConfirmedTransfer(
  tron: TronAddressCodec,
  txHash: string,
  fromAddress: string,
  toAddress: string,
  amountAtomic: bigint
): Promise<ConfirmationResult> {
  for (let attempt = 0; attempt < CONFIRMATION_POLL_ATTEMPTS; attempt += 1) {
    try {
      const receiptResponse = await fetch(
        `${TRON_CONFIG.fullHost}/walletsolidity/gettransactioninfobyid`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'TRON-PRO-API-KEY': TRON_CONFIG.apiKey,
          },
          body: JSON.stringify({ value: txHash }),
        }
      )

      if (receiptResponse.ok) {
        const receipt = await receiptResponse.json() as {
          id?: unknown
          result?: unknown
          blockNumber?: unknown
          receipt?: { result?: unknown }
        }

        if (typeof receipt.id === 'string' && receipt.id.toLowerCase() === txHash) {
          const executionResult = receipt.receipt?.result
          if (
            receipt.result === 'FAILED'
            || (typeof executionResult === 'string' && executionResult !== 'SUCCESS')
          ) {
            return {
              state: 'failed',
              reason: `Solidified receipt reported ${String(executionResult ?? receipt.result)}`,
            }
          }

          const eventsResponse = await fetch(
            `${TRON_CONFIG.fullHost}/v1/transactions/${txHash}/events?only_confirmed=true`,
            { headers: { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey } }
          )

          if (eventsResponse.ok) {
            const eventsBody = await eventsResponse.json() as {
              data?: Array<{
                event_name?: unknown
                contract_address?: unknown
                result?: { from?: unknown; to?: unknown; value?: unknown }
              }>
            }

            const matchingTransfer = (eventsBody.data ?? []).some(event => {
              if (event.event_name !== 'Transfer') return false
              if (!sameTronAddress(tron, event.contract_address, TRON_CONFIG.usdtContract)) return false
              if (!sameTronAddress(tron, event.result?.from, fromAddress)) return false
              if (!sameTronAddress(tron, event.result?.to, toAddress)) return false
              try {
                return parseAtomicUnits(event.result?.value) === amountAtomic
              } catch {
                return false
              }
            })

            if (matchingTransfer) {
              return { state: 'confirmed', reason: `Solidified in block ${String(receipt.blockNumber)}` }
            }
          }
        }
      }
    } catch {
      // A transient query failure must not be interpreted as transaction failure.
    }

    if (attempt < CONFIRMATION_POLL_ATTEMPTS - 1) {
      await new Promise(resolve => setTimeout(resolve, CONFIRMATION_POLL_INTERVAL_MS))
    }
  }

  return {
    state: 'pending',
    reason: 'No matching solidified USDT Transfer event was found before the polling deadline',
  }
}

export interface SweepResult {
  usdtTxHash: string | null
  trxTxHash: string | null
  usdtAmount: string
  trxAmount: string
  error: string | null
  confirmed: boolean
  pendingReview: boolean
}

const EMPTY_RESULT: SweepResult = {
  usdtTxHash: null,
  trxTxHash: null,
  usdtAmount: '0.000000',
  trxAmount: '0.000000',
  error: null,
  confirmed: false,
  pendingReview: false,
}

export async function sweepToMaster(clientId: string): Promise<SweepResult> {
  const supabase = getServiceClient()
  let claim: SweepClaim | null = null
  let stage: 'unclaimed' | 'claimed' | 'sending' | 'broadcast' = 'unclaimed'

  try {
    const { data: claimData, error: claimError } = await supabase.rpc(
      'claim_wallet_sweep',
      { p_client_id: clientId }
    )

    if (claimError) {
      return { ...EMPTY_RESULT, error: claimError.message }
    }
    if (!isSweepClaim(claimData)) {
      return { ...EMPTY_RESULT, error: 'Sweep lock returned an invalid response' }
    }

    claim = claimData
    stage = 'claimed'

    const TronWebLib = require('tronweb')
    const TronWebConstructor = TronWebLib.TronWeb
    const { decryptPrivateKey } = require('./encrypt')
    const privateKey = decryptPrivateKey(claim.encryptedPrivateKey)
    const tron = new TronWebConstructor({
      fullHost: TRON_CONFIG.fullHost,
      headers: { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey },
      privateKey,
    })

    let txHash = claim.usdtTxHash?.toLowerCase() ?? null
    let amountAtomic = decimalToAtomicUnits(claim.usdtAmount)

    if (claim.status === 'manual_review' && !txHash) {
      return {
        ...EMPTY_RESULT,
        error: `Sweep ${claim.operationId} requires manual review before any retry`,
        pendingReview: true,
      }
    }

    if (claim.status === 'prepared') {
      const contract = await tron.contract().at(TRON_CONFIG.usdtContract)
      const rawOnChainBalance = await contract.balanceOf(claim.tronAddress).call()
      const onChainAtomic = parseAtomicUnits(rawOnChainBalance)
      const ledgerAtomic = decimalToAtomicUnits(claim.ledgerBalance)
      const maximumAtomic = onChainAtomic < ledgerAtomic ? onChainAtomic : ledgerAtomic

      if (maximumAtomic < USDT_ATOMIC_FACTOR) {
        await supabase.rpc('mark_wallet_sweep_failed', {
          p_operation_id: claim.operationId,
          p_error_message: 'Recorded and on-chain USDT balances do not contain at least 1 USDT',
        })
        return {
          ...EMPTY_RESULT,
          usdtAmount: atomicToDecimalString(maximumAtomic),
          error: 'No eligible recorded USDT balance of at least 1 USDT is available to sweep',
        }
      }

      const { data: preparedAmount, error: prepareError } = await supabase.rpc(
        'prepare_wallet_sweep',
        {
          p_operation_id: claim.operationId,
          p_max_amount: atomicToDecimalString(maximumAtomic),
        }
      )
      if (prepareError || typeof preparedAmount !== 'string') {
        await supabase.rpc('mark_wallet_sweep_failed', {
          p_operation_id: claim.operationId,
          p_error_message: prepareError?.message ?? 'Invalid prepared sweep amount',
        })
        return { ...EMPTY_RESULT, error: prepareError?.message ?? 'Sweep preparation failed' }
      }

      amountAtomic = decimalToAtomicUnits(preparedAmount)
      stage = 'sending'
      const transferResult = await contract
        .transfer(TRON_CONFIG.masterWallet, amountAtomic.toString())
        .send({ feeLimit: 100_000_000 })

      txHash = extractTransactionHash(transferResult)
      if (!txHash || !TX_HASH_PATTERN.test(txHash)) {
        await supabase.rpc('mark_wallet_sweep_manual_review', {
          p_operation_id: claim.operationId,
          p_error_message: 'Transfer returned no valid transaction ID after the send attempt',
        })
        return {
          ...EMPTY_RESULT,
          usdtAmount: atomicToDecimalString(amountAtomic),
          error: `Sweep ${claim.operationId} requires manual review because broadcast status is uncertain`,
          pendingReview: true,
        }
      }

      const { error: broadcastRecordError } = await supabase.rpc(
        'record_wallet_sweep_broadcast',
        { p_operation_id: claim.operationId, p_tx_hash: txHash }
      )
      if (broadcastRecordError) {
        await supabase.rpc('mark_wallet_sweep_manual_review', {
          p_operation_id: claim.operationId,
          p_error_message: `Broadcast ${txHash} could not be recorded: ${broadcastRecordError.message}`,
        })
        return {
          ...EMPTY_RESULT,
          usdtTxHash: txHash,
          usdtAmount: atomicToDecimalString(amountAtomic),
          error: `Transaction ${txHash} was sent but its database state needs manual review`,
          pendingReview: true,
        }
      }
      stage = 'broadcast'
    } else {
      stage = 'broadcast'
    }

    if (!txHash || !TX_HASH_PATTERN.test(txHash) || amountAtomic <= 0n) {
      return {
        ...EMPTY_RESULT,
        error: `Sweep ${claim.operationId} has incomplete broadcast metadata and requires manual review`,
        pendingReview: true,
      }
    }

    const confirmation = await queryConfirmedTransfer(
      tron,
      txHash,
      claim.tronAddress,
      TRON_CONFIG.masterWallet,
      amountAtomic
    )

    if (confirmation.state === 'failed') {
      await supabase.rpc('mark_wallet_sweep_failed', {
        p_operation_id: claim.operationId,
        p_error_message: confirmation.reason,
      })
      return {
        ...EMPTY_RESULT,
        usdtTxHash: txHash,
        usdtAmount: atomicToDecimalString(amountAtomic),
        error: `USDT transaction failed on-chain: ${confirmation.reason}`,
      }
    }

    if (confirmation.state === 'pending') {
      await supabase.rpc('mark_wallet_sweep_manual_review', {
        p_operation_id: claim.operationId,
        p_error_message: `${confirmation.reason}; continue checking transaction ${txHash}`,
      })
      return {
        ...EMPTY_RESULT,
        usdtTxHash: txHash,
        usdtAmount: atomicToDecimalString(amountAtomic),
        error: `Transaction ${txHash} is not yet verified. Do not create a replacement sweep.`,
        pendingReview: true,
      }
    }

    const { error: confirmError } = await supabase.rpc('confirm_wallet_sweep', {
      p_operation_id: claim.operationId,
      p_tx_hash: txHash,
    })
    if (confirmError) {
      await supabase.rpc('mark_wallet_sweep_manual_review', {
        p_operation_id: claim.operationId,
        p_error_message: `On-chain confirmation succeeded but ledger settlement failed: ${confirmError.message}`,
      })
      return {
        ...EMPTY_RESULT,
        usdtTxHash: txHash,
        usdtAmount: atomicToDecimalString(amountAtomic),
        error: `Transaction ${txHash} is confirmed, but ledger settlement requires manual review`,
        pendingReview: true,
      }
    }

    return {
      ...EMPTY_RESULT,
      usdtTxHash: txHash,
      usdtAmount: atomicToDecimalString(amountAtomic),
      confirmed: true,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sweep failed'

    if (claim) {
      const rpcName = stage === 'sending' || stage === 'broadcast'
        ? 'mark_wallet_sweep_manual_review'
        : 'mark_wallet_sweep_failed'
      await supabase.rpc(rpcName, {
        p_operation_id: claim.operationId,
        p_error_message: message,
      })
    }

    return {
      ...EMPTY_RESULT,
      error: stage === 'sending' || stage === 'broadcast'
        ? `${message}. The sweep state is uncertain; do not retry automatically.`
        : message,
      pendingReview: stage === 'sending' || stage === 'broadcast',
    }
  } finally {
    if (claim) {
      await supabase.rpc('release_wallet_sweep_lock', {
        p_operation_id: claim.operationId,
      })
    }
  }
}
