'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PortalHeader } from '@/components/layout/PortalHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'

interface WithdrawalRequest {
  id: string
  amount: number
  wallet_address: string
  mt5_account: string | null
  status: string
  rejection_reason: string | null
  created_at: string
}

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-600',
  approved: 'bg-green-100 text-green-600',
  rejected: 'bg-red-100 text-red-600',
}

function isValidTRC20(address: string): boolean {
  return /^T[A-Za-z0-9]{33}$/.test(address)
}

export default function WithdrawalPage() {
  const router   = useRouter()
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [profileId,   setProfileId]   = useState<string | null>(null)
  const [kycApproved, setKycApproved] = useState(false)
  const [requests,    setRequests]    = useState<WithdrawalRequest[]>([])
  const [loading,     setLoading]     = useState(true)
  const [submitting,  setSubmitting]  = useState(false)
  const [amount,      setAmount]      = useState('')
  const [walletAddr,  setWalletAddr]  = useState('')
  const [mt5Account,  setMt5Account]  = useState('')
  const [addrError,   setAddrError]   = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/portal/login'); return }

      const { data: profile } = await supabase
        .from('client_profiles')
        .select('id, kyc_status')
        .eq('user_id', user.id)
        .single()

      if (!profile) { setLoading(false); return }
      setProfileId(profile.id)
      setKycApproved(profile.kyc_status === 'approved')

      const { data } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('client_id', profile.id)
        .order('created_at', { ascending: false })

      setRequests((data ?? []) as WithdrawalRequest[])
      setLoading(false)
    }
    load()
  }, [supabase, router])

  function validateAddress(val: string) {
    setWalletAddr(val)
    if (val && !isValidTRC20(val)) {
      setAddrError('Invalid TRC-20 address. Must start with T and be 34 characters.')
    } else {
      setAddrError('')
    }
  }

  async function submitRequest() {
    if (!profileId) return
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toastError('Invalid amount', 'Please enter a valid amount.')
      return
    }
    if (!isValidTRC20(walletAddr)) {
      toastError('Invalid address', 'Please enter a valid TRC-20 wallet address.')
      return
    }
    if (!mt5Account.trim()) {
      toastError('Missing MT5 account', 'Please enter your MT5 account number.')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          client_id:      profileId,
          amount:         Number(amount),
          wallet_address: walletAddr,
          mt5_account:    mt5Account.trim(),
          status:         'pending',
        })

      if (error) throw new Error(error.message)

      success('Request submitted', 'Your withdrawal request is under review.')
      setAmount('')
      setWalletAddr('')
      setMt5Account('')

      const { data } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('client_id', profileId)
        .order('created_at', { ascending: false })
      setRequests((data ?? []) as WithdrawalRequest[])
    } catch (err: unknown) {
      toastError('Submission failed', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <PortalHeader title="Withdraw USDT" />
        <div className="p-6 space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-32 bg-[var(--kfx-surface-raised)] rounded animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PortalHeader
        title="Withdraw USDT"
        subtitle="Submit a withdrawal request to receive USDT to your TRC-20 wallet."
      />
      <div className="p-6 space-y-5 max-w-2xl">

        {!kycApproved && (
          <Alert variant="warning" title="KYC Required">
            Your KYC must be approved before you can submit a withdrawal request.
          </Alert>
        )}

        {kycApproved && (
          <Card>
            <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-4">
              New Withdrawal Request
            </h2>

            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm font-bold text-red-600">
                ⚠️ Only TRC-20 wallet addresses are accepted. Sending to any other network will result in permanent loss of funds.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--kfx-text-muted)] uppercase tracking-wider mb-1.5">
                  MT5 Account Number
                </label>
                <input
                  type="text"
                  value={mt5Account}
                  onChange={(e) => setMt5Account(e.target.value)}
                  placeholder="e.g. 12345678"
                  className="w-full h-10 px-3 rounded-lg border border-[var(--kfx-border)] text-sm text-[var(--kfx-text)] bg-white outline-none focus:border-[var(--kfx-accent)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--kfx-text-muted)] uppercase tracking-wider mb-1.5">
                  Amount (USDT)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 100"
                  min="0"
                  step="any"
                  className="w-full h-10 px-3 rounded-lg border border-[var(--kfx-border)] text-sm text-[var(--kfx-text)] bg-white outline-none focus:border-[var(--kfx-accent)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--kfx-text-muted)] uppercase tracking-wider mb-1.5">
                  TRC-20 Wallet Address
                </label>
                <input
                  type="text"
                  value={walletAddr}
                  onChange={(e) => validateAddress(e.target.value)}
                  placeholder="T..."
                  className={`w-full h-10 px-3 rounded-lg border text-sm text-[var(--kfx-text)] bg-white outline-none transition-colors font-mono ${
                    addrError ? 'border-red-400 focus:border-red-500' : 'border-[var(--kfx-border)] focus:border-[var(--kfx-accent)]'
                  }`}
                />
                {addrError && (
                  <p className="text-xs text-red-500 mt-1">{addrError}</p>
                )}
              </div>

              <Button
                variant="primary"
                loading={submitting}
                disabled={!amount || !walletAddr || !mt5Account || !!addrError}
                onClick={submitRequest}
              >
                Submit Withdrawal Request
              </Button>
            </div>
          </Card>
        )}

        <Card padding="none">
          <div className="px-5 py-4 border-b border-[var(--kfx-border)]">
            <h2 className="text-sm font-semibold text-[var(--kfx-text)]">Withdrawal History</h2>
          </div>
          {requests.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[var(--kfx-text-muted)]">No withdrawal requests yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--kfx-border-subtle)]">
              {requests.map((r) => (
                <div key={r.id} className="px-5 py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--kfx-text)]">
                      ${Number(r.amount).toFixed(2)} USDT
                    </p>
                    {r.mt5_account && (
                      <p className="text-xs text-[var(--kfx-text-muted)] mt-0.5">
                        MT5: {r.mt5_account}
                      </p>
                    )}
                    <p className="text-xs text-[var(--kfx-text-muted)] font-mono truncate mt-0.5">
                      → {r.wallet_address}
                    </p>
                    {r.rejection_reason && (
                      <p className="text-xs text-red-500 mt-0.5">Reason: {r.rejection_reason}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[r.status]}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                    <p className="text-xs text-[var(--kfx-text-subtle)] mt-0.5">
                      {formatDate(r.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}