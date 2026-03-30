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

export async function checkWalletDeposits(
  clientId: string,
  walletAddress: string
): Promise<{ newDeposits: number; totalNewAmount: number; error: string | null }> {
  try {
    const supabase = getServiceClient()

    const { data: wallet } = await supabase
      .from('client_wallets')
      .select('id, usdt_balance, total_deposited')
      .eq('client_id', clientId)
      .single()

    if (!wallet) return { newDeposits: 0, totalNewAmount: 0, error: 'Wallet not found' }

    const response = await fetch(
      `https://api.trongrid.io/v1/accounts/${walletAddress}/transactions/trc20?contract_address=${TRON_CONFIG.usdtContract}&limit=20&only_confirmed=true`,
      { headers: { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey } }
    )

    if (!response.ok) throw new Error('TronGrid API error')

    const data = await response.json()
    const transactions = data.data ?? []

    let newDeposits = 0
    let totalNewAmount = 0

    // First pass: collect all new transactions
    const newTxs: { txHash: string; amount: number }[] = []
    for (const tx of transactions) {
      if (tx.to !== walletAddress) continue

      const txHash = tx.transaction_id
      const amount = Number(tx.value) / 1_000_000

      const { data: existing } = await supabase
        .from('deposit_transactions')
        .select('id')
        .eq('tx_hash', txHash)
        .maybeSingle()

      if (!existing) {
        newTxs.push({ txHash, amount })
        totalNewAmount += amount
      }
    }

    if (newTxs.length === 0) {
      await supabase
        .from('client_wallets')
        .update({ last_checked_at: new Date().toISOString() })
        .eq('client_id', clientId)
      return { newDeposits: 0, totalNewAmount: 0, error: null }
    }

    // Second pass: record each new deposit atomically via rpc
    let runningBalance = Number(wallet.usdt_balance ?? 0)
    let runningTotal   = Number(wallet.total_deposited ?? 0)

    for (const { txHash, amount } of newTxs) {
      runningBalance += amount
      runningTotal   += amount

      const { error: rpcError } = await supabase.rpc('record_deposit_detected', {
        p_client_id:   clientId,
        p_wallet_id:   wallet.id,
        p_tx_hash:     txHash,
        p_amount:      amount,
        p_new_balance: runningBalance,
        p_new_total:   runningTotal,
      })

      if (rpcError) {
        if (rpcError.message?.includes('unique') || rpcError.message?.includes('duplicate')) {
          console.warn(`[monitor] Duplicate deposit skipped: ${txHash}`)
          runningBalance -= amount
          runningTotal   -= amount
          continue
        }
        console.error(`[monitor] Failed to record deposit ${txHash}:`, rpcError.message)
        continue
      }

      newDeposits++
    }

    // ── TRX SEED on first deposit ─────────────────────────────────────────
    if (newDeposits > 0) {
      const { count: totalDepositCount } = await supabase
        .from('deposit_transactions')
        .select('id', { count: 'exact', head: true })
        .eq('wallet_id', wallet.id)

      const isFirstDeposit = (totalDepositCount ?? 0) <= newDeposits

      if (isFirstDeposit) {
        const { seedClientWalletTrx } = await import('./seed')
        const { txHash: seedTxHash, error: seedError } = await seedClientWalletTrx(walletAddress)

        if (seedError) {
          console.error('[monitor] TRX seed failed:', seedError)
          await supabase.from('notifications').insert({
            recipient: 'admin',
            client_id: clientId,
            type:      'wallet.trx_seed_failed',
            title:     'TRX Seed Failed',
            message:   `Failed to auto-seed 14 TRX to ${walletAddress}. Manual action required. Error: ${seedError}`,
            link:      '/admin/wallet-recovery',
          })
        } else {
          console.log('[monitor] TRX seed sent:', seedTxHash)
          await supabase.from('financial_events').insert({
            event_type:      'wallet.trx_seeded',
            client_id:       clientId,
            actor_id:        null,
            actor_role:      'system',
            entity_type:     'client_wallet',
            entity_id:       wallet.id,
            amount:          14,
            currency:        'TRX',
            metadata: {
              seed_tx_hash:   seedTxHash,
              client_address: walletAddress,
              master_wallet:  TRON_CONFIG.masterWallet,
              reason:         'Auto-seed on first deposit for sweep bandwidth',
            },
            idempotency_key: `trx_seed:${wallet.id}:first_deposit`,
          })
        }
      }
    }
    // ── END TRX SEED ──────────────────────────────────────────────────────

    return { newDeposits, totalNewAmount, error: null }

  } catch (err: unknown) {
    return {
      newDeposits: 0,
      totalNewAmount: 0,
      error: err instanceof Error ? err.message : 'Monitor failed',
    }
  }
}

export async function getUSDTBalance(address: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.trongrid.io/v1/accounts/${address}/tokens?token_id=${TRON_CONFIG.usdtContract}`,
      { headers: { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey } }
    )
    const data = await response.json()
    const token = data.data?.[0]
    if (!token) return 0
    return Number(token.balance) / 1_000_000
  } catch {
    return 0
  }
}