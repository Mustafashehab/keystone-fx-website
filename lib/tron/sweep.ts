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

export async function sweepToMaster(clientId: string): Promise<{
  txHash: string | null
  amount: number
  error: string | null
}> {
  try {
    const supabase = getServiceClient()

    const { data: wallet } = await supabase
      .from('client_wallets')
      .select('*')
      .eq('client_id', clientId)
      .single()

    if (!wallet) return { txHash: null, amount: 0, error: 'Wallet not found' }

    const { decryptPrivateKey } = require('./encrypt')
    const privateKey = decryptPrivateKey(wallet.encrypted_private_key)

    const TronWebLib = require('tronweb')
    const TronWebConstructor = TronWebLib.TronWeb
    const tron = new TronWebConstructor({
      fullHost:   'https://api.trongrid.io',
      headers:    { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey },
      privateKey,
    })

    const contract    = await tron.contract().at(TRON_CONFIG.usdtContract)
    const rawBalance  = await contract.balanceOf(wallet.tron_address).call()
    const balance     = Number(rawBalance) / 1_000_000

    if (balance < 1) {
      return { txHash: null, amount: 0, error: 'Balance too low to sweep' }
    }

    const amountSun = Math.floor(balance * 1_000_000)
    const tx = await contract
      .transfer(TRON_CONFIG.masterWallet, amountSun)
      .send({ feeLimit: 100_000_000 })

    const txHash = typeof tx === 'string' ? tx : tx?.txid ?? null

    await supabase
      .from('deposit_transactions')
      .update({
        status:        'swept',
        swept_at:      new Date().toISOString(),
        sweep_tx_hash: txHash,
      })
      .eq('client_id', clientId)
      .eq('status', 'detected')

    await supabase
      .from('client_wallets')
      .update({ usdt_balance: 0, updated_at: new Date().toISOString() })
      .eq('client_id', clientId)

    return { txHash, amount: balance, error: null }
  } catch (err: unknown) {
    return {
      txHash: null,
      amount: 0,
      error: err instanceof Error ? err.message : 'Sweep failed',
    }
  }
}