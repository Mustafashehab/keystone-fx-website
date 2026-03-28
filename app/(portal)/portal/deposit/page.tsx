'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PortalHeader } from '@/components/layout/PortalHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'

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

export default function DepositPage() {
  const router = useRouter()
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [checking, setChecking] = useState(false)
  const [kycApproved, setKycApproved] = useState(false)
  const [copied, setCopied] = useState(false)

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

    const { data: walletData } = await supabase
      .from('client_wallets')
      .select('*')
      .eq('client_id', profile.id)
      .maybeSingle()

    if (walletData) {
      setWallet(walletData as WalletData)
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
        success('New deposit detected!', data.newDeposits + ' new transaction(s) found.')
      } else {
        success('Checked', 'No new deposits found.')
      }
      await loadWallet()
    } catch (err: unknown) {
      toastError('Check failed', err instanceof Error ? err.message : 'Error')
    } finally {
      setChecking(false)
    }
  }

  function copyAddress() {
    if (!wallet) return
    navigator.clipboard.writeText(wallet.tron_address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div>
        <PortalHeader title="Deposit USDT" />
        <div className="p-6 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-[var(--kfx-surface-raised)] rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PortalHeader
        title="Deposit USDT"
        subtitle="Send USDT (TRC-20) to your unique deposit wallet below."
      />
      <div className="p-6 space-y-5 max-w-2xl">

        {!kycApproved && (
          <Alert variant="warning" title="KYC Required">
            Your KYC must be approved before you can access your deposit wallet.
          </Alert>
        )}

        {kycApproved && !wallet && (
          <Card>
            <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-3">
              Create Your Deposit Wallet
            </h2>
            <p className="text-sm text-[var(--kfx-text-muted)] mb-5">
              Generate your unique TRON wallet address for USDT (TRC-20) deposits.
              All deposits will be automatically forwarded to Keystone FX.
            </p>
            <Button variant="primary" loading={creating} onClick={createWallet}>
              Generate My Wallet
            </Button>
          </Card>
        )}

        {wallet && (
          <div className="space-y-5">
            <Card>
              <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-4">
                Your Deposit Address
              </h2>

              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm font-bold text-red-600">
                  ⚠️ Only send USDT (TRC-20) to this address. Do not send TRX, ERC-20, or any other token — funds will be lost.
                </p>
              </div>

              <div className="bg-[var(--kfx-surface-raised)] border border-[var(--kfx-border)] rounded-lg p-4">
                <p className="text-[10px] text-[var(--kfx-text-muted)] uppercase tracking-widest mb-2">
                  TRON (TRC-20) Address
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-mono text-[var(--kfx-text)] break-all flex-1">
                    {wallet.tron_address}
                  </p>
                  <button onClick={copyAddress}
                    className="kfx-btn-secondary shrink-0 text-xs !px-3 !py-1.5">
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center border border-[var(--kfx-border)] p-2">
                  <img
                    src={'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + wallet.tron_address}
                    alt="Wallet QR Code"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-4">
                Wallet Balance
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--kfx-surface-raised)] rounded-lg p-4">
                  <p className="text-xs text-[var(--kfx-text-muted)] mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-[var(--kfx-text)] tabular-nums">
                    {'$' + wallet.usdt_balance.toFixed(2)}
                  </p>
                  <p className="text-xs text-[var(--kfx-text-subtle)] mt-0.5">USDT</p>
                </div>
                <div className="bg-[var(--kfx-surface-raised)] rounded-lg p-4">
                  <p className="text-xs text-[var(--kfx-text-muted)] mb-1">Total Deposited</p>
                  <p className="text-2xl font-bold text-[var(--kfx-text)] tabular-nums">
                    {'$' + wallet.total_deposited.toFixed(2)}
                  </p>
                  <p className="text-xs text-[var(--kfx-text-subtle)] mt-0.5">USDT</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-[var(--kfx-text-subtle)]">
                  {wallet.last_checked_at
                    ? 'Last checked: ' + formatDate(wallet.last_checked_at)
                    : 'Never checked'}
                </p>
                <Button variant="secondary" size="sm" loading={checking} onClick={checkDeposits}>
                  Check for Deposits
                </Button>
              </div>
            </Card>

            <Card padding="none">
              <div className="px-5 py-4 border-b border-[var(--kfx-border)]">
                <h2 className="text-sm font-semibold text-[var(--kfx-text)]">
                  Transaction History
                </h2>
              </div>
              {transactions.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-[var(--kfx-text-muted)]">No deposits yet.</p>
                  <p className="text-xs text-[var(--kfx-text-subtle)] mt-1">
                    Send USDT to your address above and click Check for Deposits.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--kfx-border-subtle)]">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="px-5 py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--kfx-text)]">
                          {'+$' + tx.amount.toFixed(2) + ' USDT'}
                        </p>
                        <TxLink hash={tx.tx_hash} />
                      </div>
                      <div className="text-right shrink-0">
                        <span className={
                          'text-xs font-semibold px-2 py-0.5 rounded ' +
                          (tx.status === 'swept'
                            ? 'bg-[var(--kfx-success-muted)] text-[var(--kfx-success)]'
                            : 'bg-[var(--kfx-accent-muted)] text-[var(--kfx-accent)]')
                        }>
                          {tx.status === 'swept' ? 'Processed' : 'Detected'}
                        </span>
                        <p className="text-xs text-[var(--kfx-text-subtle)] mt-0.5">
                          {formatDate(tx.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}