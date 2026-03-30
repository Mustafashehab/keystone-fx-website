'use client'

import { useState } from 'react'

interface WalletData {
  tron_address: string
  usdt_balance: number
  trx_balance?: number
  total_deposited: number
  sweep_locked: boolean
  last_checked_at: string | null
}

interface AdminWalletPanelProps {
  clientId: string
  wallet: WalletData
}

export function AdminWalletPanel({ clientId, wallet }: AdminWalletPanelProps) {
  const [sweeping,   setSweeping]   = useState(false)
  const [result,     setResult]     = useState<{
    usdtAmount?: number
    trxAmount?: number
    usdtTxHash?: string | null
    trxTxHash?: string | null
    error?: string
  } | null>(null)

  async function handleSweep() {
    setSweeping(true)
    setResult(null)
    try {
      const res = await fetch('/api/tron/sweep', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ clientId }),
      })
      const body = await res.json()

      if (!res.ok) {
        setResult({ error: body.error ?? 'Sweep failed' })
        return
      }

      setResult({
        usdtAmount: body.usdtAmount,
        trxAmount:  body.trxAmount,
        usdtTxHash: body.usdtTxHash,
        trxTxHash:  body.trxTxHash,
      })
    } catch {
      setResult({ error: 'Network error — could not reach server' })
    } finally {
      setSweeping(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
        <h2 className="text-sm font-semibold text-[#0f172a]">TRON Wallet</h2>
        {wallet.sweep_locked && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
            Sweep in progress
          </span>
        )}
      </div>

      <div className="px-5 py-4 space-y-4">

        {/* Address */}
        <div>
          <p className="text-[11px] text-[#94a3b8] uppercase tracking-wider mb-1">Deposit Address</p>
          <p className="text-xs font-mono text-[#0f172a] break-all">{wallet.tron_address}</p>
          <a
            href={`https://tronscan.org/#/address/${wallet.tron_address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline mt-0.5 block"
          >
            View on TronScan →
          </a>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e5e7eb]">
            <p className="text-[11px] text-[#94a3b8] uppercase tracking-wider mb-1">USDT Balance</p>
            <p className="text-lg font-bold text-[#0f172a]">${Number(wallet.usdt_balance).toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e5e7eb]">
            <p className="text-[11px] text-[#94a3b8] uppercase tracking-wider mb-1">Total Deposited</p>
            <p className="text-lg font-bold text-[#0f172a]">${Number(wallet.total_deposited).toFixed(2)}</p>
          </div>
        </div>

        {/* Sweep result */}
        {result && (
          <div className={`p-3 rounded-lg border text-xs ${
            result.error
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {result.error ? (
              <p>❌ {result.error}</p>
            ) : (
              <div className="space-y-1">
                <p className="font-semibold">✓ Sweep complete</p>
                {result.usdtTxHash && (
                  <p>USDT: ${result.usdtAmount?.toFixed(2)} swept
                    <a href={`https://tronscan.org/#/transaction/${result.usdtTxHash}`}
                      target="_blank" rel="noopener noreferrer"
                      className="ml-1 underline">view tx</a>
                  </p>
                )}
                {result.trxTxHash && (
                  <p>TRX: {result.trxAmount?.toFixed(2)} swept
                    <a href={`https://tronscan.org/#/transaction/${result.trxTxHash}`}
                      target="_blank" rel="noopener noreferrer"
                      className="ml-1 underline">view tx</a>
                  </p>
                )}
                {!result.usdtTxHash && !result.trxTxHash && (
                  <p>Nothing swept — balances may be too low.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Sweep button */}
        <button
          onClick={handleSweep}
          disabled={sweeping || wallet.sweep_locked}
          className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[#0f172a] text-white hover:bg-[#1e293b] transition-all disabled:opacity-40"
        >
          {sweeping ? 'Sweeping…' : 'Sweep All Funds to Master Wallet'}
        </button>

        <p className="text-xs text-[#94a3b8] text-center">
          Moves all USDT and TRX from this wallet to your master wallet
        </p>
      </div>
    </div>
  )
}