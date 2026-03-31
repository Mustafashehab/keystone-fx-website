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
import { usePortalI18n } from '@/lib/portal-i18n'

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

function WhatsAppBlock() {
  const { t } = usePortalI18n()
  return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="max-w-sm w-full bg-[var(--kfx-surface)] border border-[var(--kfx-border)] rounded-2xl p-8 text-center space-y-5">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">💬</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--kfx-text)] mb-2">
            {t.withdrawal.serviceUnavailable}
          </h2>
          <p className="text-sm text-[var(--kfx-text-muted)] leading-relaxed">
            {t.withdrawal.serviceUnavailableDesc}
          </p>
        </div>
        <button
          onClick={() => window.open(WHATSAPP_LINK, '_blank')}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          {t.withdrawal.contactWhatsApp}
        </button>
      </div>
    </div>
  )
}

export default function WithdrawalPage() {
  const router   = useRouter()
  const supabase = createClient()
  const { success, error: toastError } = useToast()
  const { t } = usePortalI18n()

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

  if (settingsLoading) return null

  if (!financialEnabled) return (
    <div>
      <PortalHeader title={t.withdrawal.title} />
      <WhatsAppBlock />
    </div>
  )

  if (loading) {
    return (
      <div>
        <PortalHeader title={t.withdrawal.title} />
        <div className="p-6 space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-32 bg-[var(--kfx-surface-raised)] rounded animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PortalHeader
        title={t.withdrawal.title}
        subtitle={t.withdrawal.subtitle}
      />
      <div className="p-6 space-y-5 max-w-2xl">

        {!kycApproved && (
          <Alert variant="warning" title={t.withdrawal.kycRequired}>
            {t.withdrawal.kycRequiredDesc}
          </Alert>
        )}

        {kycApproved && !registeredWallet && (
          <Alert variant="warning" title={t.withdrawal.noWallet}>
            {t.withdrawal.noWalletDesc}
          </Alert>
        )}

        {kycApproved && hasPendingRequest && (
          <Alert variant="info" title={t.withdrawal.pendingRequest}>
            {t.withdrawal.pendingRequestDesc}
          </Alert>
        )}

        {kycApproved && registeredWallet && !hasPendingRequest && (
          <Card>
            <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-4">{t.withdrawal.newRequest}</h2>
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm font-bold text-red-600">
                {t.withdrawal.complianceWarning}
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--kfx-text-muted)] uppercase tracking-wider mb-1.5">{t.withdrawal.mt5Account}</label>
                <input type="text" value={mt5Account} onChange={(e) => setMt5Account(e.target.value)}
                  placeholder={t.withdrawal.mt5Placeholder}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--kfx-border)] text-sm text-[var(--kfx-text)] bg-white outline-none focus:border-[var(--kfx-accent)] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--kfx-text-muted)] uppercase tracking-wider mb-1.5">{t.withdrawal.amount}</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder={t.withdrawal.amountPlaceholder} min="10" step="any"
                  className="w-full h-10 px-3 rounded-lg border border-[var(--kfx-border)] text-sm text-[var(--kfx-text)] bg-white outline-none focus:border-[var(--kfx-accent)] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--kfx-text-muted)] uppercase tracking-wider mb-1.5">{t.withdrawal.destination}</label>
                <input type="text" value={walletAddr} onChange={(e) => validateAddress(e.target.value)}
                  placeholder={t.withdrawal.destinationPlaceholder}
                  className={`w-full h-10 px-3 rounded-lg border text-sm text-[var(--kfx-text)] bg-white outline-none transition-colors font-mono ${addrError ? 'border-red-400' : 'border-[var(--kfx-border)] focus:border-[var(--kfx-accent)]'}`} />
                {addrError && <p className="text-xs text-red-500 mt-1">{addrError}</p>}
                {registeredWallet && (
                  <p className="text-xs text-[var(--kfx-text-muted)] mt-1">
                    {t.withdrawal.registeredWallet}<span className="font-mono">{registeredWallet}</span>
                  </p>
                )}
              </div>
              <Button variant="primary" loading={submitting}
                disabled={!amount || !walletAddr || !mt5Account || !!addrError || submitting}
                onClick={submitRequest}>
                {t.withdrawal.submitRequest}
              </Button>
            </div>
          </Card>
        )}

        <Card padding="none">
          <div className="px-5 py-4 border-b border-[var(--kfx-border)]">
            <h2 className="text-sm font-semibold text-[var(--kfx-text)]">{t.withdrawal.history}</h2>
          </div>
          {requests.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[var(--kfx-text-muted)]">{t.withdrawal.noHistory}</p>
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
