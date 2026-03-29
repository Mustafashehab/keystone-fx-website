// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import { TRON_CONFIG } from './config'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

const CONFIRMATION_POLL_ATTEMPTS = 10
const CONFIRMATION_POLL_INTERVAL_MS = 3000

async function waitForConfirmation(txHash: string): Promise<boolean> {
  for (let i = 0; i < CONFIRMATION_POLL_ATTEMPTS; i++) {
    try {
      const res = await fetch(
        `https://api.trongrid.io/v1/transactions/${txHash}`,
        { headers: { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey } }
      )
      if (res.ok) {
        const data = await res.json()
        const tx = data.data?.[0]
        if (tx?.ret?.[0]?.contractRet === 'SUCCESS') return true
      }
    } catch {
      // Network error during polling — continue
    }
    if (i < CONFIRMATION_POLL_ATTEMPTS - 1) {
      await new Promise(resolve => setTimeout(resolve, CONFIRMATION_POLL_INTERVAL_MS))
    }
  }
  return false
}

async function waitForTrxConfirmation(txHash: string): Promise<boolean> {
  for (let i = 0; i < CONFIRMATION_POLL_ATTEMPTS; i++) {
    try {
      const res = await fetch(
        `https://api.trongrid.io/v1/transactions/${txHash}`,
        { headers: { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey } }
      )
      if (res.ok) {
        const data = await res.json()
        const tx = data.data?.[0]
        if (tx?.ret?.[0]?.contractRet === 'SUCCESS' || tx?.ret?.[0]?.ret === 'SUCESS') return true
        // For TRX transfers, check differently
        if (tx && tx.ret && tx.ret[0] && !tx.ret[0].contractRet) return true
      }
    } catch {
      // continue
    }
    if (i < CONFIRMATION_POLL_ATTEMPTS - 1) {
      await new Promise(resolve => setTimeout(resolve, CONFIRMATION_POLL_INTERVAL_MS))
    }
  }
  return false
}

export interface SweepResult {
  usdtTxHash: string | null
  trxTxHash:  string | null
  usdtAmount: number
  trxAmount:  number
  error:      string | null
  confirmed:  boolean
}

export async function sweepToMaster(clientId: string): Promise<SweepResult> {
  const supabase = getServiceClient()

  try {
    const { data: wallet, error: walletFetchError } = await supabase
      .from('client_wallets')
      .select('*')
      .eq('client_id', clientId)
      .single()

    if (walletFetchError || !wallet) {
      return { usdtTxHash: null, trxTxHash: null, usdtAmount: 0, trxAmount: 0, error: 'Wallet not found', confirmed: false }
    }

    if (wallet.sweep_locked) {
      return { usdtTxHash: null, trxTxHash: null, usdtAmount: 0, trxAmount: 0, error: 'Sweep already in progress for this wallet', confirmed: false }
    }

    // Acquire sweep lock
    const { error: lockError } = await supabase
      .from('client_wallets')
      .update({ sweep_locked: true, updated_at: new Date().toISOString() })
      .eq('client_id', clientId)
      .eq('sweep_locked', false)

    if (lockError) {
      return { usdtTxHash: null, trxTxHash: null, usdtAmount: 0, trxAmount: 0, error: 'Could not acquire sweep lock', confirmed: false }
    }

    try {
      const { decryptPrivateKey } = require('./encrypt')
      const privateKey = decryptPrivateKey(wallet.encrypted_private_key)

      const TronWebLib = require('tronweb')
      const TronWebConstructor = TronWebLib.TronWeb
      const tron = new TronWebConstructor({
        fullHost: 'https://api.trongrid.io',
        headers:  { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey },
        privateKey,
      })

      // ─── Check USDT balance ───────────────────────────────────────────
      const contract   = await tron.contract().at(TRON_CONFIG.usdtContract)
      const rawUsdt    = await contract.balanceOf(wallet.tron_address).call()
      const usdtBalance = Number(rawUsdt) / 1_000_000

      // ─── Check TRX balance ────────────────────────────────────────────
      const accountInfo  = await tron.trx.getAccount(wallet.tron_address)
      const trxBalanceSun = accountInfo?.balance ?? 0
      const trxBalance    = trxBalanceSun / 1_000_000

      // Reserve a small amount of TRX for transaction fees if needed
      // Keep 2 TRX as reserve, sweep the rest
      const TRX_RESERVE   = 2
      const trxToSend     = Math.max(0, trxBalance - TRX_RESERVE)

      if (usdtBalance < 1 && trxToSend < 1) {
        return {
          usdtTxHash: null,
          trxTxHash:  null,
          usdtAmount: usdtBalance,
          trxAmount:  trxBalance,
          error: `Balance too low to sweep. USDT: ${usdtBalance.toFixed(2)}, TRX: ${trxBalance.toFixed(2)}`,
          confirmed: false,
        }
      }

      let usdtTxHash: string | null = null
      let trxTxHash:  string | null = null
      let usdtConfirmed = false
      let trxConfirmed  = false

      // ─── Sweep USDT ───────────────────────────────────────────────────
      if (usdtBalance >= 1) {
        const amountSun = Math.floor(usdtBalance * 1_000_000)
        const usdtTx = await contract
          .transfer(TRON_CONFIG.masterWallet, amountSun)
          .send({ feeLimit: 100_000_000 })

        usdtTxHash = typeof usdtTx === 'string' ? usdtTx : usdtTx?.txid ?? null

        if (usdtTxHash) {
          usdtConfirmed = await waitForConfirmation(usdtTxHash)
          if (!usdtConfirmed) {
            console.error(`[sweep] USDT tx ${usdtTxHash} not confirmed. Manual check required.`)
          }
        }
      }

      // ─── Sweep TRX (only after USDT sweep, so we still have TRX for fees) ──
      if (trxToSend >= 1) {
        // Re-check TRX balance after USDT sweep (fees may have been deducted)
        const updatedAccount    = await tron.trx.getAccount(wallet.tron_address)
        const updatedTrxSun     = updatedAccount?.balance ?? 0
        const updatedTrx        = updatedTrxSun / 1_000_000
        const finalTrxToSend    = Math.max(0, updatedTrx - 1) // keep 1 TRX for the transfer fee itself
        const finalTrxSun       = Math.floor(finalTrxToSend * 1_000_000)

        if (finalTrxSun > 0) {
          // Build, sign and broadcast TRX transfer manually
          const unsignedTx = await tron.transactionBuilder.sendTrx(
            TRON_CONFIG.masterWallet,
            finalTrxSun,
            wallet.tron_address
          )
          const signedTx = await tron.trx.sign(unsignedTx, privateKey)
          const trxTx    = await tron.trx.sendRawTransaction(signedTx)
          // sendRawTransaction returns { result: true, txid: '...' }
          trxTxHash = trxTx?.txid ?? trxTx?.transaction?.txID ?? null

          if (trxTxHash) {
            trxConfirmed = await waitForTrxConfirmation(trxTxHash)
            if (!trxConfirmed) {
              console.error(`[sweep] TRX tx ${trxTxHash} not confirmed. Manual check required.`)
            }
          }
        }
      }

      // ─── Update DB if USDT was swept ──────────────────────────────────
      if (usdtTxHash && usdtConfirmed) {
        const { data: detectedDeposits } = await supabase
          .from('deposit_transactions')
          .select('tx_hash')
          .eq('client_id', clientId)
          .eq('status', 'detected')

        for (const deposit of detectedDeposits ?? []) {
          const { error: rpcError } = await supabase.rpc('record_deposit_swept', {
            p_client_id:     clientId,
            p_tx_hash:       deposit.tx_hash,
            p_sweep_tx_hash: usdtTxHash,
          })

          if (rpcError) {
            console.error(`[sweep] CRITICAL: Failed to record sweep for deposit ${deposit.tx_hash}:`,
              rpcError.message, `Sweep tx: ${usdtTxHash}, client: ${clientId}`)
          }
        }
      }

      return {
        usdtTxHash,
        trxTxHash,
        usdtAmount: usdtBalance,
        trxAmount:  trxBalance,
        error:      null,
        confirmed:  usdtConfirmed || trxConfirmed,
      }

    } finally {
      // Always release sweep lock
      await supabase
        .from('client_wallets')
        .update({ sweep_locked: false, updated_at: new Date().toISOString() })
        .eq('client_id', clientId)
    }

  } catch (err: unknown) {
    try {
      await supabase
        .from('client_wallets')
        .update({ sweep_locked: false, updated_at: new Date().toISOString() })
        .eq('client_id', clientId)
    } catch {
      // Best effort
    }

    return {
      usdtTxHash: null,
      trxTxHash:  null,
      usdtAmount: 0,
      trxAmount:  0,
      error: err instanceof Error ? err.message : 'Sweep failed',
      confirmed: false,
    }
  }
}