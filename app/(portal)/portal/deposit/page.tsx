'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PortalHeader } from '@/components/layout/PortalHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'

const WHATSAPP_LINK = 'https://wa.me/447511648370'

interface WalletData {
  tron_address: string
  usdt_balance: number
  total_deposited: number
  last_checked_at: string | null
}

interface Transaction {
  id: string
  tx_hash: string
  amount: number
  status: string
  created_at: string
}

function TxLink({ hash }: { hash: string }) {
  const url = 'https://tronscan.org/#/transaction/' + hash
  const short = hash.slice(0, 20) + '...'
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="text-xs text-[var(--kfx-accent)] hover:underline font-mono truncate block">
      {short}
    </a>
  )
}

function SweepModal({ amount, onClose }: { amount: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-2xl" style={{ border: '1.5px solid rgba(201,168,76,0.4)' }}>
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.12)', border: '1.5px solid rgba(201,168,76,0.4)' }}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#c9a84c" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-lg font-bold text-center text-[#0f172a] mb-2">Deposit Confirmed</h2>
        <p className="text-sm text-center text-[#64748b] mb-1">Your deposit of</p>
        <p className="text-3xl font-bold text-center mb-1" style={{ color: '#c9a84c' }}>${amount.toFixed(2)} USDT</p>
        <p className="text-sm text-center text-[#64748b] mb-6">has been added to your MT5 account</p>
        <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-bold transition-all"
          style={{ background: 'linear-gradient(135deg, #c9a84c 0%, #f5c842 100%)', color: '#0f0a02', boxShadow: '0 4px 16px rgba(245,200,66,0.35)' }}>
          OK
        </button>
      </div>
    </div>
  )
}

function WhatsAppScreen({ page }: { page: 'deposit' | 'withdrawal' }) {
  return (
    <div>
      <PortalHeader title={page === 'deposit' ? 'Deposit USDT' : 'Withdraw USDT'} />
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-sm w-full bg-[var(--kfx-surface)] border border-[var(--kfx-border)] rounded-2xl p-8 text-center space-y-5">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">💬</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--kfx-text)] mb-2">
              Service Temporarily Unavailable
            </h2>
            <p className="text-sm text-[var(--kfx-text-muted)] leading-relaxed">
              {page === 'deposit'
                ? 'Deposits are currently unavailable. Please contact our support team on WhatsApp and we will assist you directly.'
                : 'Withdrawals are currently unavailable. Please contact our support team on WhatsApp and we will assist you directly.'}
            </p>
          </div>
          <button
            onClick={() => window.open(WHATSAPP_LINK, '_blank')}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Contact Support on WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DepositPage() {
  const router = useRouter()
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [wallet,       setWallet]       = useState<WalletData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading,      setLoading]      = useState(true)
  const [creating,     setCreating]     = useState(false)
  const [checking,     setChecking]     = useState(false)
  const [kycApproved,  setKycApproved]  = useState(false)
  const [copied,       setCopied]       = useState(false)
  const [clientId,     setClientId]     = useState<string | null>(null)
  const [sweepModal,   setSweepModal]   = useState(false)
  const [sweptAmount,  setSweptAmount]  = useState(0)
  const prevBalanceRef = useRef<number | null>(null)

  const [financialEnabled, setFinancialEnabled] = useState(true)
  const [settingsLoading,  setSettingsLoading]  = useState(true)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => { setFinancialEnabled(d.financial_services_enabled ?? true) })
      .catch(() => {})
      .finally(() => setSettingsLoading(false))
  }, [])

  const loadWallet = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/portal/login'); return }

    const { data: profile } = await supabase
      .from('client_profiles')
      .select('id, kyc_status')
      .eq('user_id', user.id)
      .single()

    if (!profile) { setLoading(false); return }
    setKycApproved(profile.kyc_status === 'approved')
    setClientId(profile.id)

    const { data: walletData } = await supabase
      .from('client_wallets')
      .select('*')
      .eq('client_id', profile.id)
      .maybeSingle()

    if (walletData) {
      const w = walletData as WalletData
      if (prevBalanceRef.current !== null && prevBalanceRef.current > 0 && w.usdt_balance === 0) {
        setSweptAmount(prevBalanceRef.current)
        setSweepModal(true)
      }
      prevBalanceRef.current = w.usdt_balance
      setWallet(w)

      const { data: txData } = await supabase
        .from('deposit_transactions')
        .select('*')
        .eq('client_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20)
      setTransactions((txData ?? []) as Transaction[])
    }

    setLoading(false)
  }, [supabase, router])

  useEffect(() => { loadWallet() }, [loadWallet])

  useEffect(() => {
    if (!clientId) return
    const interval = setInterval(async () => {
      const { data: walletData } = await supabase
        .from('client_wallets')
        .select('usdt_balance, total_deposited, last_checked_at, tron_address')
        .eq('client_id', clientId)
        .maybeSingle()

      if (walletData) {
        const w = walletData as WalletData
        if (prevBalanceRef.current !== null && prevBalanceRef.current > 0 && w.usdt_balance === 0) {
          setSweptAmount(prevBalanceRef.current)
          setSweepModal(true)
          await loadWallet()
          return
        }
        prevBalanceRef.current = w.usdt_balance
        setWallet((prev) => prev ? { ...prev, ...w } : w)
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [clientId, supabase, loadWallet])

  async function createWallet() {
    setCreating(true)
    try {
      const res = await fetch('/api/tron/create-wallet', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      success('Wallet created', 'Your unique deposit wallet is ready.')
      await loadWallet()
    } catch (err: unknown) {
      toastError('Failed', err instanceof Error ? err.message : 'Error')
    } finally {
      setCreating(false)
    }
  }

  async function checkDeposits() {
    setChecking(true)
    try {
      const res = await fetch('/api/tron/check-deposits', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (data.newDeposits > 0) {
        success('Deposit detected', `${data.newDeposits} new deposit(s) totalling $${data.totalNewAmount.toFixed(2)} USDT.`)
        await loadWallet()
      } else {
        success('No new deposits', 'No new transactions found.')
      }
    } catch (err: unknown) {
      toastError('Check failed', err instanceof Error ? err.message : 'Error')
    } finally {
      setChecking(false)
    }
  }

  async function copyAddress() {
    if (!wallet?.tron_address) return
    await navigator.clipboard.writeText(wallet.tron_address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (settingsLoading) return null
  if (!financialEnabled) return <WhatsAppScreen page="deposit" />

  if (loading) {
    return (
      <div>
        <PortalHeader title="Deposit USDT" />
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-[var(--kfx-surface-raised)] rounded animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div>
      {sweepModal && <SweepModal amount={sweptAmount} onClose={() => setSweepModal(false)} />}
      <PortalHeader title="Deposit USDT" subtitle="Send USDT (TRC-20) to your unique wallet address below." />
      <div className="p-6 space-y-5 max-w-2xl">

        {!kycApproved && (
          <Alert variant="warning" title="KYC Required">
            Your KYC must be approved before you can deposit.
          </Alert>
        )}

        {kycApproved && !wallet && (
          <Card>
            <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-2">Generate Your Deposit Wallet</h2>
            <p className="text-sm text-[var(--kfx-text-muted)] mb-4">
              You need a unique TRC-20 wallet address to receive USDT deposits.
            </p>
            <Button variant="primary" loading={creating} onClick={createWallet}>
              Generate Wallet
            </Button>
          </Card>
        )}

        {kycApproved && wallet && (
          <>
            <Card>
              <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-4">Your Deposit Address</h2>
              <div className="flex items-center gap-2 p-3 bg-[var(--kfx-surface-raised)] rounded-lg mb-4">
                <p className="text-xs font-mono text-[var(--kfx-text)] break-all flex-1">{wallet.tron_address}</p>
                <button onClick={copyAddress} className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-[var(--kfx-accent)] text-black font-semibold">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-xl overflow-hidden border border-[var(--kfx-border)]">
                  <img
                    src={'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + wallet.tron_address}
                    alt="Wallet QR Code"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-4">Wallet Balance</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--kfx-surface-raised)] rounded-lg p-4">
                  <p className="text-xs text-[var(--kfx-text-muted)] mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-[var(--kfx-text)] tabular-nums">${wallet.usdt_balance.toFixed(2)}</p>
                  <p className="text-xs text-[var(--kfx-text-subtle)] mt-0.5">USDT</p>
                </div>
                <div className="bg-[var(--kfx-surface-raised)] rounded-lg p-4">
                  <p className="text-xs text-[var(--kfx-text-muted)] mb-1">Total Deposited</p>
                  <p className="text-2xl font-bold text-[var(--kfx-text)] tabular-nums">${wallet.total_deposited.toFixed(2)}</p>
                  <p className="text-xs text-[var(--kfx-text-subtle)] mt-0.5">USDT</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-[var(--kfx-text-subtle)]">
                  {wallet.last_checked_at ? 'Last checked: ' + formatDate(wallet.last_checked_at) : 'Never checked'}
                </p>
                <Button variant="secondary" size="sm" loading={checking} onClick={checkDeposits}>
                  Check for Deposits
                </Button>
              </div>
            </Card>

            <Card padding="none">
              <div className="px-5 py-4 border-b border-[var(--kfx-border)]">
                <h2 className="text-sm font-semibold text-[var(--kfx-text)]">Transaction History</h2>
              </div>
              {transactions.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-[var(--kfx-text-muted)]">No deposits yet.</p>
                  <p className="text-xs text-[var(--kfx-text-subtle)] mt-1">Send USDT to your address above and click Check for Deposits.</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--kfx-border-subtle)]">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="px-5 py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--kfx-text)]">{'+$' + tx.amount.toFixed(2) + ' USDT'}</p>
                        <TxLink hash={tx.tx_hash} />
                      </div>
                      <div className="text-right shrink-0">
                        <span className={'text-xs font-semibold px-2 py-0.5 rounded ' + (tx.status === 'swept' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600')}>
                          {tx.status === 'swept' ? 'Added to MT5' : 'Pending'}
                        </span>
                        <p className="text-xs text-[var(--kfx-text-subtle)] mt-0.5">{formatDate(tx.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  )
}