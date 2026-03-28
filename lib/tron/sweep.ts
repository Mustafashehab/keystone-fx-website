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

export async function sweepToMaster(clientId: string): Promise<{
  txHash: string | null
  amount: number
  error: string | null
  confirmed: boolean
}> {
  const supabase = getServiceClient()

  try {
    const { data: wallet, error: walletFetchError } = await supabase
      .from('client_wallets')
      .select('*')
      .eq('client_id', clientId)
      .single()

    if (walletFetchError || !wallet) {
      return { txHash: null, amount: 0, error: 'Wallet not found', confirmed: false }
    }

    if (wallet.sweep_locked) {
      return { txHash: null, amount: 0, error: 'Sweep already in progress for this wallet', confirmed: false }
    }

    // Acquire sweep lock
    const { error: lockError } = await supabase
      .from('client_wallets')
      .update({ sweep_locked: true, updated_at: new Date().toISOString() })
      .eq('client_id', clientId)
      .eq('sweep_locked', false)

    if (lockError) {
      return { txHash: null, amount: 0, error: 'Could not acquire sweep lock', confirmed: false }
    }

    try {
      const { decryptPrivateKey } = require('./encrypt')
      const privateKey = decryptPrivateKey(wallet.encrypted_private_key)

      const TronWebLib = require('tronweb')
      const TronWebConstructor = TronWebLib.TronWeb
      const tron = new TronWebConstructor({
        fullHost:   'https://api.trongrid.io',
        headers:    { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey },
        privateKey,
      })

      const contract   = await tron.contract().at(TRON_CONFIG.usdtContract)
      const rawBalance = await contract.balanceOf(wallet.tron_address).call()
      const balance    = Number(rawBalance) / 1_000_000

      if (balance < 1) {
        return { txHash: null, amount: 0, error: 'Balance too low to sweep', confirmed: false }
      }

      const amountSun = Math.floor(balance * 1_000_000)
      const tx = await contract
        .transfer(TRON_CONFIG.masterWallet, amountSun)
        .send({ feeLimit: 100_000_000 })

      const txHash = typeof tx === 'string' ? tx : tx?.txid ?? null

      if (!txHash) {
        return { txHash: null, amount: balance, error: 'Transaction broadcast failed — no hash returned', confirmed: false }
      }

      // Wait for on-chain confirmation before touching the database
      const confirmed = await waitForConfirmation(txHash)

      if (!confirmed) {
        console.error(`[sweep] Transaction ${txHash} broadcast but not confirmed after ${CONFIRMATION_POLL_ATTEMPTS} attempts. Manual reconciliation required.`)
        return {
          txHash,
          amount: balance,
          error: `Transaction broadcast (${txHash}) but on-chain confirmation timed out. Do not sweep again until manually verified.`,
          confirmed: false,
        }
      }

      // Confirmed on-chain — now update DB atomically via rpc
      // record_deposit_swept updates deposit_transactions, client_wallets,
      // and inserts financial_events all in one transaction.
      // We sweep all detected deposits for this client.
      const { data: detectedDeposits } = await supabase
        .from('deposit_transactions')
        .select('tx_hash')
        .eq('client_id', clientId)
        .eq('status', 'detected')

      for (const deposit of detectedDeposits ?? []) {
        const { error: rpcError } = await supabase.rpc('record_deposit_swept', {
          p_client_id:     clientId,
          p_tx_hash:       deposit.tx_hash,
          p_sweep_tx_hash: txHash,
        })

        if (rpcError) {
          // Log but continue — partial success is better than leaving all as detected
          console.error(`[sweep] CRITICAL: Failed to record sweep for deposit ${deposit.tx_hash}:`, rpcError.message,
            `Sweep tx: ${txHash}, client: ${clientId}. Manual reconciliation required.`)
        }
      }

      return { txHash, amount: balance, error: null, confirmed: true }

    } finally {
      // Always release sweep lock
      await supabase
        .from('client_wallets')
        .update({ sweep_locked: false, updated_at: new Date().toISOString() })
        .eq('client_id', clientId)
    }

  } catch (err: unknown) {
    // Best-effort lock release on unexpected error
    try {
      await supabase
        .from('client_wallets')
        .update({ sweep_locked: false, updated_at: new Date().toISOString() })
        .eq('client_id', clientId)
    } catch {
      // Best effort
    }

    return {
      txHash: null,
      amount: 0,
      error: err instanceof Error ? err.message : 'Sweep failed',
      confirmed: false,
    }
  }
}