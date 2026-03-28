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
  pending:   'bg-amber-100 text-amber-600',
  approved:  'bg-green-100 text-green-600',
  rejected:  'bg-red-100 text-red-600',
  cancelled: 'bg-gray-100 text-gray-500',
}

function isValidTRC20(address: string): boolean {
  return /^T[A-Za-z0-9]{33}$/.test(address)
}

export default function WithdrawalPage() {
  const router   = useRouter()
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [profileId,         setProfileId]         = useState<string | null>(null)
  const [kycApproved,       setKycApproved]       = useState(false)
  const [registeredWallet,  setRegisteredWallet]  = useState<string | null>(null)
  const [requests,          setRequests]          = useState<WithdrawalRequest[]>([])
  const [loading,           setLoading]           = useState(true)
  const [submitting,        setSubmitting]        = useState(false)
  const [amount,            setAmount]            = useState('')
  const [walletAddr,        setWalletAddr]        = useState('')
  const [mt5Account,        setMt5Account]        = useState('')
  const [addrError,         setAddrError]         = useState('')

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

      // Load the client's registered deposit wallet address.
      // This is used to validate withdrawal destination for AML compliance.
      const { data: wallet } = await supabase
        .from('client_wallets')
        .select('tron_address')
        .eq('client_id', profile.id)
        .maybeSingle()

      if (wallet?.tron_address) {
        setRegisteredWallet(wallet.tron_address)
        // Pre-fill the wallet address field with the registered wallet.
        // Client should be withdrawing back to the same wallet they deposited from.
        setWalletAddr(wallet.tron_address)
      }

      const { data } = await supabase
        .from('withdrawal_requests')
        .select('id, amount, wallet_address, mt5_account, status, rejection_reason, created_at')
        .eq('client_id', profile.id)
        .order('created_at', { ascending: false })

      setRequests((data ?? []) as WithdrawalRequest[])
      setLoading(false)
    }
    load()
  }, [supabase, router])

  function validateAddress(val: string) {
    setWalletAddr(val)
    if (!val) {
      setAddrError('')
      return
    }
    if (!isValidTRC20(val)) {
      setAddrError('Invalid TRC-20 address. Must start with T and be 34 characters.')
      return
    }
    // AML CHECK: Warn if the address doesn't match the registered deposit wallet
    if (registeredWallet && val !== registeredWallet) {
      setAddrError('This address does not match your registered deposit wallet. For compliance, withdrawals must return to your original funding wallet.')
      return
    }
    setAddrError('')
  }

  async function submitRequest() {
    if (!profileId) return

    // Amount validation
    const parsedAmount = Number(amount)
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toastError('Invalid amount', 'Please enter a valid amount greater than zero.')
      return
    }

    // Minimum withdrawal
    if (parsedAmount < 10) {
      toastError('Amount too low', 'Minimum withdrawal amount is $10 USDT.')
      return
    }

    // Address validation
    if (!isValidTRC20(walletAddr)) {
      toastError('Invalid address', 'Please enter a valid TRC-20 wallet address.')
      return
    }

    // AML: Address must match registered deposit wallet
    if (registeredWallet && walletAddr !== registeredWallet) {
      toastError(
        'Address mismatch',
        'For compliance, you can only withdraw to your registered deposit wallet address.'
      )
      return
    }

    // MT5 account required
    if (!mt5Account.trim()) {
      toastError('Missing MT5 account', 'Please enter your MT5 account number.')
      return
    }

    // IDEMPOTENCY CHECK: Prevent duplicate pending requests.
    // If the client already has a pending withdrawal request, block submission.
    // This prevents double-click and retry duplicates.
    const existingPending = requests.find(r => r.status === 'pending')
    if (existingPending) {
      toastError(
        'Request already pending',
        'You already have a pending withdrawal request. Please wait for it to be reviewed before submitting another.'
      )
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          client_id:      profileId,
          amount:         parsedAmount,
          wallet_address: walletAddr,
          mt5_account:    mt5Account.trim(),
          status:         'pending',
        })

      if (error) throw new Error(error.message)

      success('Request submitted', 'Your withdrawal request is under review. You will be notified of the outcome.')
      setAmount('')
      setMt5Account('')
      // Do not clear wallet address — it should stay as the registered wallet

      // Refresh the request list
      const { data } = await supabase
        .from('withdrawal_requests')
        .select('id, amount, wallet_address, mt5_account, status, rejection_reason, created_at')
        .eq('client_id', profileId)
        .order('created_at', { ascending: false })
      setRequests((data ?? []) as WithdrawalRequest[])
    } catch (err: unknown) {
      toastError('Submission failed', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  const hasPendingRequest = requests.some(r => r.status === 'pending')

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

        {kycApproved && !registeredWallet && (
          <Alert variant="warning" title="No Deposit Wallet Found">
            You must make a deposit first before submitting a withdrawal request.
            Please visit the Deposit page to generate your wallet.
          </Alert>
        )}

        {kycApproved && hasPendingRequest && (
          <Alert variant="info" title="Pending Request Active">
            You have a pending withdrawal request under review. You cannot submit another until the current one is resolved.
          </Alert>
        )}

        {kycApproved && registeredWallet && !hasPendingRequest && (
          <Card>
            <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-4">
              New Withdrawal Request
            </h2>

            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm font-bold text-red-600">
                ⚠️ For compliance, withdrawals can only be sent to your registered deposit wallet address. This cannot be changed.
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
                  Amount (USDT) — Minimum $10
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 100"
                  min="10"
                  step="any"
                  className="w-full h-10 px-3 rounded-lg border border-[var(--kfx-border)] text-sm text-[var(--kfx-text)] bg-white outline-none focus:border-[var(--kfx-accent)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--kfx-text-muted)] uppercase tracking-wider mb-1.5">
                  Withdrawal Destination (TRC-20)
                </label>
                <input
                  type="text"
                  value={walletAddr}
                  onChange={(e) => validateAddress(e.target.value)}
                  placeholder="T..."
                  className={`w-full h-10 px-3 rounded-lg border text-sm text-[var(--kfx-text)] bg-white outline-none transition-colors font-mono ${
                    addrError
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[var(--kfx-border)] focus:border-[var(--kfx-accent)]'
                  }`}
                />
                {addrError && (
                  <p className="text-xs text-red-500 mt-1">{addrError}</p>
                )}
                {registeredWallet && (
                  <p className="text-xs text-[var(--kfx-text-muted)] mt-1">
                    Your registered deposit wallet: <span className="font-mono">{registeredWallet}</span>
                  </p>
                )}
              </div>

              <Button
                variant="primary"
                loading={submitting}
                disabled={!amount || !walletAddr || !mt5Account || !!addrError || submitting}
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
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[r.status] ?? 'bg-gray-100 text-gray-500'}`}>
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