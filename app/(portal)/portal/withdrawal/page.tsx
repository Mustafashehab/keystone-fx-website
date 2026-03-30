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

const WHATSAPP_LINK = 'https://wa.me/447511648370'

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

  const [profileId,        setProfileId]        = useState<string | null>(null)
  const [profileName,      setProfileName]      = useState('')
  const [kycApproved,      setKycApproved]      = useState(false)
  const [registeredWallet, setRegisteredWallet] = useState<string | null>(null)
  const [requests,         setRequests]         = useState<WithdrawalRequest[]>([])
  const [loading,          setLoading]          = useState(true)
  const [submitting,       setSubmitting]       = useState(false)
  const [amount,           setAmount]           = useState('')
  const [walletAddr,       setWalletAddr]       = useState('')
  const [mt5Account,       setMt5Account]       = useState('')
  const [addrError,        setAddrError]        = useState('')

  // Maintenance mode
  const [financialEnabled, setFinancialEnabled] = useState(true)
  const [settingsLoading,  setSettingsLoading]  = useState(true)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => { setFinancialEnabled(d.financial_services_enabled ?? true) })
      .catch(() => {})
      .finally(() => setSettingsLoading(false))
  }, [])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/portal/login'); return }

      const { data: profile } = await supabase
        .from('client_profiles')
        .select('id, kyc_status, first_name, last_name')
        .eq('user_id', user.id)
        .single()

      if (!profile) { setLoading(false); return }
      setProfileId(profile.id)
      setProfileName(`${profile.first_name} ${profile.last_name}`)
      setKycApproved(profile.kyc_status === 'approved')

      const { data: wallet } = await supabase
        .from('client_wallets')
        .select('tron_address')
        .eq('client_id', profile.id)
        .maybeSingle()

      if (wallet?.tron_address) {
        setRegisteredWallet(wallet.tron_address)
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
    if (!val) { setAddrError(''); return }
    if (!isValidTRC20(val)) {
      setAddrError('Invalid TRC-20 address. Must start with T and be 34 characters.')
      return
    }
    if (registeredWallet && val !== registeredWallet) {
      setAddrError('This address does not match your registered deposit wallet.')
      return
    }
    setAddrError('')
  }

  async function submitRequest() {
    if (!profileId) return

    const parsedAmount = Number(amount)
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toastError('Invalid amount', 'Please enter a valid amount greater than zero.')
      return
    }
    if (parsedAmount < 10) {
      toastError('Amount too low', 'Minimum withdrawal amount is $10 USDT.')
      return
    }
    if (!isValidTRC20(walletAddr)) {
      toastError('Invalid address', 'Please enter a valid TRC-20 wallet address.')
      return
    }
    if (registeredWallet && walletAddr !== registeredWallet) {
      toastError('Address mismatch', 'You can only withdraw to your registered deposit wallet.')
      return
    }
    if (!mt5Account.trim()) {
      toastError('Missing MT5 account', 'Please enter your MT5 account number.')
      return
    }

    const existingPending = requests.find(r => r.status === 'pending')
    if (existingPending) {
      toastError('Request already pending', 'You already have a pending withdrawal request.')
      return
    }

    setSubmitting(true)
    try {
      const { data: newRequest, error } = await supabase
        .from('withdrawal_requests')
        .insert({
          client_id:      profileId,
          amount:         parsedAmount,
          wallet_address: walletAddr,
          mt5_account:    mt5Account.trim(),
          status:         'pending',
        })
        .select('id')
        .single()

      if (error) throw new Error(error.message)

      await fetch('/api/notifications/withdrawal-submitted', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          clientId:   profileId,
          clientName: profileName,
          amount:     parsedAmount,
          requestId:  newRequest?.id,
        }),
      })

      success('Request submitted', 'Your withdrawal request is under review.')
      setAmount('')
      setMt5Account('')

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

  // ── Render guards ────────────────────────────────────────────────────────
  if (settingsLoading) return null

  if (!financialEnabled) return (
    <div>
      <PortalHeader title="Withdraw USDT" />
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
              Withdrawals are currently unavailable. Please contact our support team on WhatsApp and we will assist you directly.
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
          </Alert>
        )}

        {kycApproved && hasPendingRequest && (
          <Alert variant="info" title="Pending Request Active">
            You have a pending withdrawal request under review. You cannot submit another until it is resolved.
          </Alert>
        )}

        {kycApproved && registeredWallet && !hasPendingRequest && (
          <Card>
            <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-4">
              New Withdrawal Request
            </h2>
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm font-bold text-red-600">
                ⚠️ For compliance, withdrawals can only be sent to your registered deposit wallet address.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--kfx-text-muted)] uppercase tracking-wider mb-1.5">
                  MT5 Account Number
                </label>
                <input type="text" value={mt5Account} onChange={(e) => setMt5Account(e.target.value)}
                  placeholder="e.g. 12345678"
                  className="w-full h-10 px-3 rounded-lg border border-[var(--kfx-border)] text-sm text-[var(--kfx-text)] bg-white outline-none focus:border-[var(--kfx-accent)] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--kfx-text-muted)] uppercase tracking-wider mb-1.5">
                  Amount (USDT) — Minimum $10
                </label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 100" min="10" step="any"
                  className="w-full h-10 px-3 rounded-lg border border-[var(--kfx-border)] text-sm text-[var(--kfx-text)] bg-white outline-none focus:border-[var(--kfx-accent)] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--kfx-text-muted)] uppercase tracking-wider mb-1.5">
                  Withdrawal Destination (TRC-20)
                </label>
                <input type="text" value={walletAddr} onChange={(e) => validateAddress(e.target.value)}
                  placeholder="T..."
                  className={`w-full h-10 px-3 rounded-lg border text-sm text-[var(--kfx-text)] bg-white outline-none transition-colors font-mono ${addrError ? 'border-red-400' : 'border-[var(--kfx-border)] focus:border-[var(--kfx-accent)]'}`} />
                {addrError && <p className="text-xs text-red-500 mt-1">{addrError}</p>}
                {registeredWallet && (
                  <p className="text-xs text-[var(--kfx-text-muted)] mt-1">
                    Your registered wallet: <span className="font-mono">{registeredWallet}</span>
                  </p>
                )}
              </div>
              <Button variant="primary" loading={submitting}
                disabled={!amount || !walletAddr || !mt5Account || !!addrError || submitting}
                onClick={submitRequest}>
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
                    <p className="text-sm font-medium text-[var(--kfx-text)]">${Number(r.amount).toFixed(2)} USDT</p>
                    {r.mt5_account && <p className="text-xs text-[var(--kfx-text-muted)] mt-0.5">MT5: {r.mt5_account}</p>}
                    <p className="text-xs text-[var(--kfx-text-muted)] font-mono truncate mt-0.5">→ {r.wallet_address}</p>
                    {r.rejection_reason && <p className="text-xs text-red-500 mt-0.5">Reason: {r.rejection_reason}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[r.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                    <p className="text-xs text-[var(--kfx-text-subtle)] mt-0.5">{formatDate(r.created_at)}</p>
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