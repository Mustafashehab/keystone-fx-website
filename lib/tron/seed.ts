// @ts-nocheck
import { TRON_CONFIG } from './config'

const TRX_SEED_AMOUNT = 14 // TRX to send to new client wallets
const SUN_PER_TRX = 1_000_000 // 1 TRX = 1,000,000 SUN

export async function seedClientWalletTrx(
  clientWalletAddress: string
): Promise<{ txHash: string | null; error: string | null }> {
  try {
    const masterPrivateKey = process.env.TRON_MASTER_PRIVATE_KEY
    if (!masterPrivateKey) {
      throw new Error('TRON_MASTER_PRIVATE_KEY not configured')
    }

    const TronWebLib = require('tronweb')
    const tron = new TronWebLib.TronWeb({
      fullHost: TRON_CONFIG.fullHost,
      headers:  { 'TRON-PRO-API-KEY': TRON_CONFIG.apiKey },
      privateKey: masterPrivateKey,
    })

    const amountInSun = TRX_SEED_AMOUNT * SUN_PER_TRX

    const tx = await tron.trx.sendTransaction(
      clientWalletAddress,
      amountInSun
    )

    if (!tx.result && !tx.txid) {
      throw new Error('TRX seed transaction failed — no txid returned')
    }

    return { txHash: tx.txid ?? tx.transaction?.txID ?? null, error: null }

  } catch (err: unknown) {
    return {
      txHash: null,
      error: err instanceof Error ? err.message : 'TRX seed failed',
    }
  }
}