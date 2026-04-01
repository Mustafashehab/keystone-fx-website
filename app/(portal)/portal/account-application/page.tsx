'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import {
  accountApplicationSchema,
  type AccountApplicationFormData,
} from '@/lib/validations'
import { PortalHeader } from '@/components/layout/PortalHeader'
import { Card } from '@/components/ui/Card'
import { Input, Select } from '@/components/ui/FormFields'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import type { AccountApplication, ClientProfile } from '@/types'

const LEVERAGE_OPTIONS = [
  { label: '1:100', value: '1:100' },
  { label: '1:200', value: '1:200' },
  { label: '1:500', value: '1:500' },
]

const CURRENCY_OPTIONS = [
  { label: 'USD — US Dollar', value: 'USD' },
  { label: 'EUR — Euro',      value: 'EUR' },
]

const PLATFORM_OPTIONS = [
  { label: 'MetaTrader 5 (MT5)', value: 'MT5' },
]

const ACCOUNT_TYPE_OPTIONS = [
  { label: 'Individual',    value: 'individual' },
  { label: 'Professional',  value: 'professional' },
  { label: 'Institutional', value: 'institutional' },
]

const TIERS = [
  {
    label: 'Standard',
    min: '$100',
    features: ['MT5', 'Standard spreads', 'Email support'],
  },
  {
    label: 'Advanced',
    min: '$10,000',
    features: ['All platforms', 'Tight spreads', 'Priority support'],
  },
  {
    label: 'Institutional',
    min: '$250,000',
    features: ['Dedicated desk', 'Raw spreads', '24/7 support'],
  },
]

export default function AccountApplicationPage() {
  const router   = useRouter()
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [profile,     setProfile]     = useState<ClientProfile | null>(null)
  const [application, setApplication] = useState<AccountApplication | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AccountApplicationFormData>({
    resolver: zodResolver(accountApplicationSchema),
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/portal/login'); return }

      const { data: profileData } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!profileData) { setLoading(false); return }
      setProfile(profileData as ClientProfile)
      setValue(
        'accountType',
        profileData.account_type as AccountApplicationFormData['accountType']
      )

      const { data: appData } = await supabase
        .from('account_applications')
        .select('*')
        .eq('client_id', profileData.id)
        .maybeSingle()

      if (appData) {
        const app = appData as AccountApplication
        setApplication(app)
        setValue('accountType',
          app.account_type as AccountApplicationFormData['accountType'])
        setValue('leveragePreference',   app.leverage_preference ?? '')
        setValue('baseCurrency',         app.base_currency ?? '')
        setValue('platformPreference',   app.platform_preference ?? '')
        setValue('initialDepositAmount', app.initial_deposit_amount ?? 0)
      }

      setLoading(false)
    }
    load()
  }, [supabase, router, setValue])

  async function onSubmit(data: AccountApplicationFormData) {
    setServerError(null)
    if (!profile) return

    try {
      const { data: upserted, error: upsertErr } = await supabase
        .from('account_applications')
        .upsert({
          client_id:              profile.id,
          account_type:           data.accountType,
          leverage_preference:    data.leveragePreference,
          base_currency:          data.baseCurrency,
          platform_preference:    data.platformPreference,
          initial_deposit_amount: data.initialDepositAmount,
          status:                 'submitted',
          submitted_at:           new Date().toISOString(),
          updated_at:             new Date().toISOString(),
        })
        .select()
        .single()

      if (upsertErr) throw new Error(upsertErr.message)
      setApplication(upserted as AccountApplication)

      await supabase
        .from('client_profiles')
        .update({ onboarding_step: 4, updated_at: new Date().toISOString() })
        .eq('id', profile.id)

      setProfile((prev) => (prev ? { ...prev, onboarding_step: 4 } : prev))
      success('Application submitted', 'Your trading account application is under review.')
      router.push('/portal/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed'
      setServerError(msg)
      toastError('Submission failed', msg)
    }
  }

  if (loading) {
    return (
      <div>
        <PortalHeader title="Account Application" />
        <div className="p-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-[var(--kfx-surface-raised)] rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  const isReadOnly =
    application?.status === 'approved' ||
    application?.status === 'under_review' ||
    application?.status === 'submitted'

  const prereqsMet = true

  return (
    <div>
      <PortalHeader
        title="Account Application"
        subtitle="Configure your trading account preferences."
        action={
          application ? (
            <StatusBadge type="application" status={application.status} />
          ) : undefined
        }
      />

      <div className="p-6 space-y-5">
        {isReadOnly && (
          <Alert variant={application?.status === 'approved' ? 'success' : 'info'}>
            {application?.status === 'approved'
              ? `Your account application was approved on ${formatDate(
                  application.reviewed_at
                )}.`
              : 'Your application has been submitted and is under review. You will be notified of any updates.'}
          </Alert>
        )}

        {application?.status === 'rejected' && application.rejection_reason && (
          <Alert variant="error" title="Application Rejected">
            {application.rejection_reason}. Please update your details and resubmit.
          </Alert>
        )}

        {serverError && <Alert variant="error">{serverError}</Alert>}

        {!prereqsMet && (
          <Alert variant="warning" title="Prerequisites incomplete">
            Please complete your KYC verification and upload your documents before
            submitting an account application.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Card>
            <h2 className="text-sm font-semibold text-[var(--kfx-text)] mb-5">
              Account Configuration
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Account Type" required disabled={isReadOnly}
                options={ACCOUNT_TYPE_OPTIONS}
                error={errors.accountType?.message}
                {...register('accountType')}
              />
              <Select
                label="Base Currency" required disabled={isReadOnly}
                options={CURRENCY_OPTIONS} placeholder="Select currency"
                error={errors.baseCurrency?.message}
                {...register('baseCurrency')}
              />
              <Select
                label="Trading Platform" required disabled={isReadOnly}
                options={PLATFORM_OPTIONS} placeholder="Select platform"
                error={errors.platformPreference?.message}
                {...register('platformPreference')}
              />
              <Select
                label="Leverage Preference" required disabled={isReadOnly}
                options={LEVERAGE_OPTIONS} placeholder="Select leverage"
                hint="Higher leverage increases both potential gains and losses."
                error={errors.leveragePreference?.message}
                {...register('leveragePreference')}
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-[var(--kfx-text)] mb-5">
              Initial Deposit
            </h2>
            <div className="max-w-xs">
              <Input
                label="Intended Initial Deposit (USD)"
                type="number" required min={0} step={100}
                placeholder="e.g. 100"
                hint="This is an indication only and does not constitute a commitment."
                error={errors.initialDepositAmount?.message}
                disabled={isReadOnly}
                {...register('initialDepositAmount', { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              {TIERS.map((tier) => (
                <div
                  key={tier.label}
                  className="p-3 rounded-lg border border-[var(--kfx-border)] bg-[var(--kfx-surface-raised)]"
                >
                  <p className="text-xs font-semibold text-[var(--kfx-text)]">
                    {tier.label}
                  </p>
                  <p className="text-[11px] text-[var(--kfx-accent)] font-medium mt-0.5">
                    From {tier.min}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="text-[11px] text-[var(--kfx-text-muted)] flex items-center gap-1"
                      >
                        <svg
                          className="w-3 h-3 text-[var(--kfx-success)] shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          <Alert variant="warning">
            Trading foreign exchange and CFDs carries a high level of risk and
            may not be suitable for all investors. Please ensure you fully
            understand the risks involved before applying.
          </Alert>

          {!isReadOnly && (
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                disabled={!prereqsMet}
              >
                Submit Application
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}