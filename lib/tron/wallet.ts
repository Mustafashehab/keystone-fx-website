// @ts-nocheck
import { encryptPrivateKey, decryptPrivateKey } from './encrypt'
import { createClient } from '@supabase/supabase-js'

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

    const account    = await tron.createAccount()
    const address    = account.address.base58
    const privateKey = account.privateKey
    const encryptedKey = encryptPrivateKey(privateKey)

    const supabase = getServiceClient()
    const { error } = await supabase
      .from('client_wallets')
      .insert({
        client_id:             clientId,
        tron_address:          address,
        encrypted_private_key: encryptedKey,
      })

    if (error) throw new Error(error.message)

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