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
): Promise<{ newDeposits: number; error: string | null }> {
  try {
    const supabase = getServiceClient()

    const { data: wallet } = await supabase
      .from('client_wallets')
      .select('id')
      .eq('client_id', clientId)
      .single()

    if (!wallet) return { newDeposits: 0, error: 'Wallet not found' }

    const response = await fetch(
      `https://api.trongrid.io/v1/accounts/${walletAddress}/transactions/trc20?contract_address=${TRON_CONFIG.usdtContract}&limit=20&only_confirmed=true`,
      { headers: { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey } }
    )

    if (!response.ok) throw new Error('TronGrid API error')

    const data = await response.json()
    const transactions = data.data ?? []

    let newDeposits = 0

    for (const tx of transactions) {
      if (tx.to !== walletAddress) continue

      const txHash = tx.transaction_id
      const amount = Number(tx.value) / 1_000_000

      const { data: existing } = await supabase
        .from('deposit_transactions')
        .select('id')
        .eq('tx_hash', txHash)
        .maybeSingle()

      if (existing) continue

      await supabase.from('deposit_transactions').insert({
        client_id: clientId,
        wallet_id: wallet.id,
        tx_hash:   txHash,
        amount,
        status:    'detected',
      })

      await supabase
        .from('client_wallets')
        .update({
          usdt_balance:    amount,
          total_deposited: amount,
          last_checked_at: new Date().toISOString(),
          updated_at:      new Date().toISOString(),
        })
        .eq('client_id', clientId)

      newDeposits++
    }

    await supabase
      .from('client_wallets')
      .update({ last_checked_at: new Date().toISOString() })
      .eq('client_id', clientId)

    return { newDeposits, error: null }
  } catch (err: unknown) {
    return {
      newDeposits: 0,
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