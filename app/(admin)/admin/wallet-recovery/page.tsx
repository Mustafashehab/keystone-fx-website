'use client'

import { useState } from 'react'

interface RecoveryResult {
  walletAddress: string
  privateKey: string
  usdtBalance: number
  warning: string
}

export default function WalletRecoveryPage() {
  const [walletAddress, setWalletAddress] = useState('')
  const [reason,        setReason]        = useState('')
  const [loading,       setLoading]       = useState(false)
  const [result,        setResult]        = useState<RecoveryResult | null>(null)
  const [error,         setError]         = useState<string | null>(null)
  const [confirmed,     setConfirmed]     = useState(false)
  const [keyVisible,    setKeyVisible]    = useState(false)
  const [copied,        setCopied]        = useState(false)

  async function handleRecover() {
    if (!confirmed) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/admin/wallet-recovery', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ walletAddress: walletAddress.trim(), reason }),
      })
      const body = await res.json()

      if (!res.ok) {
        setError(body.error ?? 'Recovery failed')
        return
      }

      setResult(body)
    } catch {
      setError('Network error — could not reach server')
    } finally {
      setLoading(false)
    }
  }

  async function copyKey() {
    if (!result) return
    await navigator.clipboard.writeText(result.privateKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  function clearResult() {
    setResult(null)
    setKeyVisible(false)
    setCopied(false)
    setConfirmed(false)
    setWalletAddress('')
    setReason('')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#0f172a]">Wallet Recovery</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Decrypt a client wallet private key for manual fund recovery. Every access is permanently logged.
        </p>
      </div>

      {/* Warning banner */}
      <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-700">Sensitive Operation</p>
            <p className="text-xs text-amber-600 mt-0.5">
              This tool decrypts a client's wallet private key. Use only when funds are stuck and cannot be recovered through normal means. All access is logged permanently in the audit trail.
            </p>
          </div>
        </div>
      </div>

      {!result ? (
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 space-y-5">

          {/* Wallet address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1.5">
              Client Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="TTVYKZnMr..."
              className="w-full h-10 px-3 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] font-mono outline-none focus:border-[#94a3b8]"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1.5">
              Reason for Access (required for audit log)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Client deposited funds but sweep failed due to network error. Manual recovery required to move 50 USDT to master wallet."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] outline-none focus:border-[#94a3b8] resize-none"
            />
            <p className="text-xs text-[#94a3b8] mt-1">{reason.length} characters (minimum 10)</p>
          </div>

          {/* Confirmation checkbox */}
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-[#f8fafc] border border-[#e5e7eb]">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-[#0f172a]"
            />
            <p className="text-xs text-[#475569]">
              I confirm this access is authorized, necessary, and will be logged permanently in the audit trail. I will handle the private key securely and not share it.
            </p>
          </label>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleRecover}
            disabled={!walletAddress.trim() || reason.trim().length < 10 || !confirmed || loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[#0f172a] text-white hover:bg-[#1e293b] transition-all disabled:opacity-40"
          >
            {loading ? 'Decrypting…' : 'Decrypt Private Key'}
          </button>
        </div>
      ) : (
        /* Result */
        <div className="rounded-xl border border-red-200 bg-white p-6 space-y-5">

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-sm font-semibold text-red-600">Private Key Retrieved — Handle With Extreme Care</p>
          </div>

          <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e5e7eb] space-y-2">
            <div>
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Wallet Address</p>
              <p className="text-xs font-mono text-[#0f172a] mt-0.5">{result.walletAddress}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider">USDT Balance</p>
              <p className="text-sm font-semibold text-[#0f172a] mt-0.5">${Number(result.usdtBalance).toFixed(2)} USDT</p>
            </div>
          </div>

          {/* Private key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Private Key</p>
              <button
                onClick={() => setKeyVisible((v) => !v)}
                className="text-xs text-[#64748b] hover:text-[#0f172a] transition-colors"
              >
                {keyVisible ? 'Hide' : 'Reveal'}
              </button>
            </div>
            <div className="relative">
              <div className="w-full px-3 py-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] font-mono text-xs text-[#0f172a] break-all">
                {keyVisible ? result.privateKey : '•'.repeat(64)}
              </div>
            </div>
            <button
              onClick={copyKey}
              className="mt-2 w-full py-2 rounded-lg text-xs font-semibold border border-[#e2e8f0] text-[#0f172a] hover:bg-[#f1f5f9] transition-all"
            >
              {copied ? '✓ Copied to clipboard' : 'Copy Private Key'}
            </button>
          </div>

          {/* Instructions */}
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-1">Next steps:</p>
            <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
              <li>Open TronLink on your phone</li>
              <li>Tap the account icon → Import Wallet → Private Key</li>
              <li>Paste the private key</li>
              <li>Send the USDT to your master wallet manually</li>
              <li>Return here and click "Clear" when done</li>
            </ol>
          </div>

          <p className="text-xs text-[#94a3b8]">{result.warning}</p>

          <button
            onClick={clearResult}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all"
          >
            Clear & Done
          </button>
        </div>
      )}
    </div>
  )
}