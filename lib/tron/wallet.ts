// @ts-nocheck
import { encryptPrivateKey, decryptPrivateKey } from './encrypt'
import { createClient } from '@supabase/supabase-js'
import { seedClientWalletTrx } from './seed'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function createClientWallet(clientId: string): Promise<{
  address: string
  error: string | null
}> {
  try {
    const TronWebLib = require('tronweb')
    const TronWebConstructor = TronWebLib.TronWeb

    const tron = new TronWebConstructor({
      fullHost: 'https://api.trongrid.io',
      headers:  { 'TRON-PRO-API-KEY': process.env.TRON_GRID_API_KEY },
    })

    const account      = await tron.createAccount()
    const address      = account.address.base58
    const privateKey   = account.privateKey
    const encryptedKey = encryptPrivateKey(privateKey)

    const supabase = getServiceClient()

    const { data: inserted, error } = await supabase
      .from('client_wallets')
      .insert({
        client_id:             clientId,
        tron_address:          address,
        encrypted_private_key: encryptedKey,
      })
      .select('id')
      .single()

    if (error) throw new Error(error.message)

    // ── Seed 14 TRX immediately to activate wallet on-chain ──────────────
    const { txHash: seedTxHash, error: seedError } = await seedClientWalletTrx(address)

    if (seedError) {
      console.error('[wallet] TRX seed failed on wallet creation:', seedError)
      await supabase.from('notifications').insert({
        recipient: 'admin',
        client_id: clientId,
        type:      'wallet.trx_seed_failed',
        title:     'TRX Seed Failed on Wallet Creation',
        message:   `Failed to auto-seed 14 TRX to new wallet ${address}. Send TRX manually before client deposits. Error: ${seedError}`,
        link:      '/admin/wallet-recovery',
      })
    } else {
      console.log('[wallet] TRX seed sent on wallet creation:', seedTxHash)
      await supabase.from('financial_events').insert({
        event_type:      'wallet.trx_seeded',
        client_id:       clientId,
        actor_id:        null,
        actor_role:      'system',
        entity_type:     'client_wallet',
        entity_id:       inserted.id,
        amount:          14,
        currency:        'TRX',
        metadata: {
          seed_tx_hash:   seedTxHash,
          client_address: address,
          reason:         'Auto-seed on wallet creation for on-chain activation',
        },
        idempotency_key: `trx_seed:${inserted.id}:creation`,
      })
    }
    // ── END TRX SEED ─────────────────────────────────────────────────────

    return { address, error: null }

  } catch (err: unknown) {
    return {
      address: '',
      error: err instanceof Error ? err.message : 'Wallet creation failed',
    }
  }
}

export async function getClientWallet(clientId: string) {
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('client_wallets')
    .select('*')
    .eq('client_id', clientId)
    .maybeSingle()

  if (error || !data) return null
  return data
}

export async function getDecryptedPrivateKey(clientId: string): Promise<string | null> {
  const wallet = await getClientWallet(clientId)
  if (!wallet) return null
  return decryptPrivateKey(wallet.encrypted_private_key)
}