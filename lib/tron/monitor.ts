import { createClient } from '@supabase/supabase-js'
import { atomicToDecimalString, parseAtomicUnits } from './amounts.ts'
import { TRON_CONFIG } from './config.ts'

const TRONGRID_PAGE_LIMIT = 200
const MAX_PAGES_PER_SCAN = 10
const CHECKPOINT_OVERLAP_MS = 10 * 60 * 1000
const TX_HASH_PATTERN = /^[0-9a-fA-F]{64}$/

interface TronGridTrc20Transaction {
  transaction_id?: unknown
  from?: unknown
  to?: unknown
  type?: unknown
  value?: unknown
  token_info?: { address?: unknown }
}

interface TronGridTrc20Response {
  data?: unknown
  success?: unknown
  meta?: { fingerprint?: unknown }
}

interface DepositScanResult {
  newDeposits: number
  totalNewAmount: string
  error: string | null
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export function getCheckpointTimestamp(lastCheckedAt: unknown): number | null {
  if (typeof lastCheckedAt !== 'string') return null
  const timestamp = Date.parse(lastCheckedAt)
  if (!Number.isFinite(timestamp)) return null
  return Math.max(0, timestamp - CHECKPOINT_OVERLAP_MS)
}

export async function fetchConfirmedTransfers(
  walletAddress: string,
  minTimestamp: number | null
): Promise<TronGridTrc20Transaction[]> {
  const transactions: TronGridTrc20Transaction[] = []
  const seenFingerprints = new Set<string>()
  let fingerprint: string | null = null

  for (let page = 0; page < MAX_PAGES_PER_SCAN; page += 1) {
    const params = new URLSearchParams({
      contract_address: TRON_CONFIG.usdtContract,
      limit: String(TRONGRID_PAGE_LIMIT),
      only_confirmed: 'true',
      only_to: 'true',
      order_by: 'block_timestamp,asc',
    })
    if (minTimestamp !== null) params.set('min_timestamp', String(minTimestamp))
    if (fingerprint) params.set('fingerprint', fingerprint)

    const response = await fetch(
      `${TRON_CONFIG.fullHost}/v1/accounts/${encodeURIComponent(walletAddress)}/transactions/trc20?${params}`,
      { headers: { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey } }
    )

    if (!response.ok) {
      throw new Error(`TronGrid deposit query failed with HTTP ${response.status}`)
    }

    const body = await response.json() as TronGridTrc20Response
    if (body.success === false || !Array.isArray(body.data)) {
      throw new Error('TronGrid returned an invalid deposit response')
    }

    transactions.push(...body.data as TronGridTrc20Transaction[])

    const nextFingerprint = typeof body.meta?.fingerprint === 'string'
      ? body.meta.fingerprint
      : null

    if (!nextFingerprint) return transactions
    if (seenFingerprints.has(nextFingerprint)) {
      throw new Error('TronGrid returned a repeated pagination cursor')
    }
    seenFingerprints.add(nextFingerprint)
    fingerprint = nextFingerprint
  }

  throw new Error(
    `Deposit scan exceeded ${TRONGRID_PAGE_LIMIT * MAX_PAGES_PER_SCAN} confirmed transfers; checkpoint was not advanced`
  )
}

export async function checkWalletDeposits(
  clientId: string,
  walletAddress: string
): Promise<DepositScanResult> {
  try {
    const supabase = getServiceClient()

    const { data: wallet, error: walletError } = await supabase
      .from('client_wallets')
      .select('id, tron_address, last_checked_at, sweep_locked')
      .eq('client_id', clientId)
      .single()

    if (walletError || !wallet) {
      return { newDeposits: 0, totalNewAmount: '0.000000', error: 'Wallet not found' }
    }
    if (wallet.tron_address !== walletAddress) {
      return { newDeposits: 0, totalNewAmount: '0.000000', error: 'Wallet address mismatch' }
    }
    if (wallet.sweep_locked) {
      return { newDeposits: 0, totalNewAmount: '0.000000', error: 'Wallet sweep is in progress' }
    }

    const transactions = await fetchConfirmedTransfers(
      walletAddress,
      getCheckpointTimestamp(wallet.last_checked_at)
    )

    let newDeposits = 0
    let totalNewAtomic = 0n
    const seenTransactionIds = new Set<string>()

    for (const tx of transactions) {
      if (tx.to !== walletAddress || tx.type !== 'Transfer') continue
      if (tx.token_info?.address !== TRON_CONFIG.usdtContract) continue

      const txHash = typeof tx.transaction_id === 'string' ? tx.transaction_id : ''
      if (!TX_HASH_PATTERN.test(txHash) || seenTransactionIds.has(txHash)) continue
      seenTransactionIds.add(txHash)

      const amountAtomic = parseAtomicUnits(tx.value)
      if (amountAtomic <= 0n) continue
      const amount = atomicToDecimalString(amountAtomic)

      const { data: recorded, error: rpcError } = await supabase.rpc(
        'record_deposit_detected',
        {
          p_client_id: clientId,
          p_wallet_id: wallet.id,
          p_tx_hash: txHash.toLowerCase(),
          p_amount: amount,
        }
      )

      if (rpcError) {
        console.error(`[monitor] Failed to record deposit ${txHash}:`, rpcError.message)
        throw new Error('A confirmed deposit could not be recorded; checkpoint was not advanced')
      }

      if (recorded === true) {
        newDeposits += 1
        totalNewAtomic += amountAtomic
      }
    }

    const { data: checkpoint, error: checkpointError } = await supabase
      .from('client_wallets')
      .update({ last_checked_at: new Date().toISOString() })
      .eq('id', wallet.id)
      .eq('sweep_locked', false)
      .select('id')
      .maybeSingle()

    if (checkpointError || !checkpoint) {
      throw new Error('Deposit checkpoint could not be updated')
    }

    return {
      newDeposits,
      totalNewAmount: atomicToDecimalString(totalNewAtomic),
      error: null,
    }
  } catch (err: unknown) {
    return {
      newDeposits: 0,
      totalNewAmount: '0.000000',
      error: err instanceof Error ? err.message : 'Monitor failed',
    }
  }
}

export async function getUSDTBalance(address: string): Promise<string> {
  const response = await fetch(
    `${TRON_CONFIG.fullHost}/v1/accounts/${encodeURIComponent(address)}/tokens?token_id=${encodeURIComponent(TRON_CONFIG.usdtContract)}`,
    { headers: { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey } }
  )
  if (!response.ok) throw new Error(`TronGrid balance query failed with HTTP ${response.status}`)

  const body = await response.json() as { data?: Array<{ balance?: unknown }> }
  const token = Array.isArray(body.data) ? body.data[0] : undefined
  return atomicToDecimalString(parseAtomicUnits(token?.balance ?? '0'))
}
