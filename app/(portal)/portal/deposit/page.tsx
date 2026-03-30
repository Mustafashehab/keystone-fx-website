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
            <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.336-1.512A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.52-5.16-1.426l-.37-.22-3.762.897.944-3.668-.242-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
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
          
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.336-1.512A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.52-5.16-1.426l-.37-.22-3.762.897.944-3.668-.242-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Contact Support on WhatsApp
          </a>
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

  // Maintenance mode
  const [financialEnabled,  setFinancialEnabled]  = useState(true)
  const [settingsLoading,   setSettingsLoading]   = useState(true)

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

  // ── Render guards ──────────────────────────────────────────────────────────
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