'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { kycSchema, type KYCFormData } from '@/lib/validations'
import { PortalHeader } from '@/components/layout/PortalHeader'
import { Input, Select, Textarea, Checkbox } from '@/components/ui/FormFields'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import type { KYCSubmission, ClientProfile } from '@/types'

const EMPLOYMENT_OPTIONS = [
  { label: 'Employed',       value: 'employed' },
  { label: 'Self-Employed',  value: 'self_employed' },
  { label: 'Business Owner', value: 'business_owner' },
  { label: 'Retired',        value: 'retired' },
  { label: 'Unemployed',     value: 'unemployed' },
  { label: 'Student',        value: 'student' },
]

const INCOME_OPTIONS = [
  { label: 'Under $25,000',       value: 'under_25k' },
  { label: '$25,000 – $50,000',   value: '25k_50k' },
  { label: '$50,000 – $100,000',  value: '50k_100k' },
  { label: '$100,000 – $250,000', value: '100k_250k' },
  { label: '$250,000 – $500,000', value: '250k_500k' },
  { label: 'Over $500,000',       value: 'over_500k' },
]

const SOURCE_OF_FUNDS_OPTIONS = [
  { label: 'Employment Income',  value: 'employment' },
  { label: 'Business Income',    value: 'business' },
  { label: 'Investments',        value: 'investments' },
  { label: 'Inheritance / Gift', value: 'inheritance' },
  { label: 'Property Sale',      value: 'property_sale' },
  { label: 'Savings',            value: 'savings' },
  { label: 'Other',              value: 'other' },
]

const EXPERIENCE_OPTIONS = [
  { label: 'No experience',        value: 'none' },
  { label: 'Less than 1 year',     value: 'less_1yr' },
  { label: '1 – 3 years',          value: '1_3yr' },
  { label: '3 – 5 years',          value: '3_5yr' },
  { label: '5 – 10 years',         value: '5_10yr' },
  { label: 'More than 10 years',   value: 'over_10yr' },
]

const INVESTMENT_OBJECTIVES = [
  { label: 'Capital Growth',    value: 'capital_growth' },
  { label: 'Income Generation', value: 'income' },
  { label: 'Hedging',           value: 'hedging' },
  { label: 'Speculation',       value: 'speculation' },
  { label: 'Diversification',   value: 'diversification' },
]

const COUNTRIES = [
  { label: 'United Arab Emirates',  value: 'AE' },
  { label: 'United Kingdom',        value: 'GB' },
  { label: 'United States',         value: 'US' },
  { label: 'Saudi Arabia',          value: 'SA' },
  { label: 'Switzerland',           value: 'CH' },
  { label: 'Singapore',             value: 'SG' },
  { label: 'Germany',               value: 'DE' },
  { label: 'France',                value: 'FR' },
  { label: 'Canada',                value: 'CA' },
  { label: 'Australia',             value: 'AU' },
  { label: 'Other',                 value: 'OTHER' },
]

const SECTIONS = ['Personal Info', 'Address', 'Financial Profile', 'Declarations']

export default function KYCPage() {
  const router   = useRouter()
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [profile,       setProfile]       = useState<ClientProfile | null>(null)
  const [kyc,           setKYC]           = useState<KYCSubmission | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [serverError,   setServerError]   = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState(0)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      investmentObjectives: [],
      politicallyExposed:   false,
      usPerson:             false,
    },
  })

  const isPEP            = watch('politicallyExposed')
  const objectives       = watch('investmentObjectives') ?? []
  const employmentStatus = watch('employmentStatus')

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

      const { data: kycData } = await supabase
        .from('kyc_submissions')
        .select('*')
        .eq('client_id', profileData.id)
        .maybeSingle()

      if (kycData) {
        const k = kycData as KYCSubmission
        setKYC(k)
        setValue('firstName',            profileData.first_name)
        setValue('lastName',             profileData.last_name)
        setValue('phone',                profileData.phone ?? '')
        setValue('dateOfBirth',          profileData.date_of_birth ?? '')
        setValue('nationality',          profileData.nationality ?? '')
        setValue('countryOfResidence',   profileData.country_of_residence ?? '')
        setValue('addressLine1',         profileData.address_line1 ?? '')
        setValue('addressLine2',         profileData.address_line2 ?? '')
        setValue('city',                 profileData.city ?? '')
        setValue('postalCode',           profileData.postal_code ?? '')
        setValue('employmentStatus',     k.employment_status ?? '')
        setValue('employerName',         k.employer_name ?? '')
        setValue('annualIncomeRange',    k.annual_income_range ?? '')
        setValue('sourceOfFunds',        k.source_of_funds ?? '')
        setValue('tradingExperience',    k.trading_experience ?? '')
        setValue('investmentObjectives', k.investment_objectives ?? [])
        setValue('politicallyExposed',   k.politically_exposed ?? false)
        setValue('pepDetails',           k.pep_details ?? '')
        setValue('usPerson',             k.us_person ?? false)
        setValue('taxResidency',         k.tax_residency ?? '')
        setValue('taxIdNumber',          k.tax_id_number ?? '')
      } else {
        setValue('firstName', profileData.first_name)
        setValue('lastName',  profileData.last_name)
      }

      setLoading(false)
    }
    load()
  }, [supabase, router, setValue])

  async function onSubmit(data: KYCFormData) {
    setServerError(null)
    if (!profile) return

    try {
      const { error: profileErr } = await supabase
        .from('client_profiles')
        .update({
          first_name:           data.firstName,
          last_name:            data.lastName,
          phone:                data.phone,
          date_of_birth:        data.dateOfBirth,
          nationality:          data.nationality,
          country_of_residence: data.countryOfResidence,
          address_line1:        data.addressLine1,
          address_line2:        data.addressLine2 ?? null,
          city:                 data.city,
          postal_code:          data.postalCode,
          kyc_status:           'pending',
          onboarding_step:      Math.max(profile.onboarding_step, 1),
          updated_at:           new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (profileErr) throw new Error(profileErr.message)

      const { error: kycErr } = await supabase
        .from('kyc_submissions')
        .upsert({
          client_id:             profile.id,
          status:                'pending',
          submitted_at:          new Date().toISOString(),
          employment_status:     data.employmentStatus,
          employer_name:         data.employerName ?? null,
          annual_income_range:   data.annualIncomeRange,
          source_of_funds:       data.sourceOfFunds,
          trading_experience:    data.tradingExperience,
          investment_objectives: data.investmentObjectives,
          politically_exposed:   data.politicallyExposed,
          pep_details:           data.pepDetails ?? null,
          us_person:             data.usPerson,
          tax_residency:         data.taxResidency,
          tax_id_number:         data.taxIdNumber ?? null,
          updated_at:            new Date().toISOString(),
        })

      if (kycErr) throw new Error(kycErr.message)

      success('KYC submitted', 'Your information has been saved and is under review.')
      router.push('/portal/documents')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setServerError(msg)
      toastError('Submission failed', msg)
    }
  }

  function toggleObjective(value: string) {
    setValue(
      'investmentObjectives',
      objectives.includes(value)
        ? objectives.filter((v) => v !== value)
        : [...objectives, value]
    )
  }

  if (loading) {
    return (
      <div>
        <PortalHeader title="KYC Verification" subtitle="Complete your identity profile." />
        <div className="p-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 bg-[var(--kfx-surface-raised)] rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  const isReadOnly =
    kyc?.status === 'approved' || kyc?.status === 'under_review'

  return (
    <div>
      <PortalHeader
        title="KYC Verification"
        subtitle="Complete your Know Your Customer profile to activate your account."
        action={kyc ? <StatusBadge type="kyc" status={kyc.status} /> : undefined}
      />

      <div className="p-6">
        {isReadOnly && (
          <Alert
            variant={kyc?.status === 'approved' ? 'success' : 'info'}
            className="mb-6"
          >
            {kyc?.status === 'approved'
              ? 'Your KYC has been approved. No further action required.'
              : 'Your KYC submission is currently under review. You will be notified of any updates.'}
          </Alert>
        )}

        {kyc?.status === 'rejected' && kyc.rejection_reason && (
          <Alert variant="error" title="KYC Rejected" className="mb-6">
            {kyc.rejection_reason}. Please correct the information below and resubmit.
          </Alert>
        )}

        {serverError && (
          <Alert variant="error" className="mb-6">
            {serverError}
          </Alert>
        )}

        {/* Section tabs */}
        <div className="flex gap-1 mb-6 bg-[var(--kfx-surface)] border border-[var(--kfx-border)] rounded-lg p-1">
          {SECTIONS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setActiveSection(i)}
              className={cn(
                'flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all',
                activeSection === i
                  ? 'bg-[var(--kfx-accent)] text-white'
                  : 'text-[var(--kfx-text-muted)] hover:text-[var(--kfx-text)]'
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Section 0 — Personal Info */}
          {activeSection === 0 && (
            <Card>
              <h2 className="text-sm font-semibold text-[var(--kfx-text)] mb-5">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name" required disabled={isReadOnly}
                  error={errors.firstName?.message} {...register('firstName')}
                />
                <Input
                  label="Last Name" required disabled={isReadOnly}
                  error={errors.lastName?.message} {...register('lastName')}
                />
                <Input
                  label="Date of Birth" type="date" required disabled={isReadOnly}
                  error={errors.dateOfBirth?.message} {...register('dateOfBirth')}
                />
                <Input
                  label="Phone Number" type="tel" required disabled={isReadOnly}
                  placeholder="+1 234 567 8900"
                  error={errors.phone?.message} {...register('phone')}
                />
                <Select
                  label="Nationality" required disabled={isReadOnly}
                  options={COUNTRIES} placeholder="Select country"
                  error={errors.nationality?.message} {...register('nationality')}
                />
                <Select
                  label="Country of Residence" required disabled={isReadOnly}
                  options={COUNTRIES} placeholder="Select country"
                  error={errors.countryOfResidence?.message}
                  {...register('countryOfResidence')}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button type="button" variant="primary" onClick={() => setActiveSection(1)}>
                  Next: Address →
                </Button>
              </div>
            </Card>
          )}

          {/* Section 1 — Address */}
          {activeSection === 1 && (
            <Card>
              <h2 className="text-sm font-semibold text-[var(--kfx-text)] mb-5">
                Residential Address
              </h2>
              <div className="space-y-4">
                <Input
                  label="Address Line 1" required disabled={isReadOnly}
                  placeholder="Street address"
                  error={errors.addressLine1?.message} {...register('addressLine1')}
                />
                <Input
                  label="Address Line 2" disabled={isReadOnly}
                  placeholder="Apartment, suite, etc. (optional)"
                  error={errors.addressLine2?.message} {...register('addressLine2')}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City" required disabled={isReadOnly}
                    error={errors.city?.message} {...register('city')}
                  />
                  <Input
                    label="Postal Code" required disabled={isReadOnly}
                    error={errors.postalCode?.message} {...register('postalCode')}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Button type="button" variant="secondary" onClick={() => setActiveSection(0)}>
                  ← Back
                </Button>
                <Button type="button" variant="primary" onClick={() => setActiveSection(2)}>
                  Next: Financial Profile →
                </Button>
              </div>
            </Card>
          )}

          {/* Section 2 — Financial Profile */}
          {activeSection === 2 && (
            <Card>
              <h2 className="text-sm font-semibold text-[var(--kfx-text)] mb-5">
                Financial Profile
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Employment Status" required disabled={isReadOnly}
                    options={EMPLOYMENT_OPTIONS} placeholder="Select status"
                    error={errors.employmentStatus?.message}
                    {...register('employmentStatus')}
                  />
                  {(employmentStatus === 'employed' ||
                    employmentStatus === 'self_employed') && (
                    <Input
                      label="Employer / Company Name" disabled={isReadOnly}
                      error={errors.employerName?.message}
                      {...register('employerName')}
                    />
                  )}
                  <Select
                    label="Annual Income Range" required disabled={isReadOnly}
                    options={INCOME_OPTIONS} placeholder="Select range"
                    error={errors.annualIncomeRange?.message}
                    {...register('annualIncomeRange')}
                  />
                  <Select
                    label="Source of Funds" required disabled={isReadOnly}
                    options={SOURCE_OF_FUNDS_OPTIONS} placeholder="Select source"
                    error={errors.sourceOfFunds?.message}
                    {...register('sourceOfFunds')}
                  />
                  <Select
                    label="Trading Experience" required disabled={isReadOnly}
                    options={EXPERIENCE_OPTIONS} placeholder="Select experience"
                    error={errors.tradingExperience?.message}
                    {...register('tradingExperience')}
                  />
                </div>

                {/* Investment Objectives */}
                <div>
                  <p className="kfx-label">
                    Investment Objectives{' '}
                    <span className="text-[var(--kfx-danger)]">*</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {INVESTMENT_OBJECTIVES.map((obj) => (
                      <button
                        key={obj.value}
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => toggleObjective(obj.value)}
                        className={cn(
                          'px-3 py-2 rounded-md text-xs font-medium border transition-all',
                          objectives.includes(obj.value)
                            ? 'bg-[var(--kfx-accent-muted)] border-[var(--kfx-accent)] text-[var(--kfx-accent)]'
                            : 'border-[var(--kfx-border)] text-[var(--kfx-text-muted)] hover:border-[var(--kfx-accent)]/40'
                        )}
                      >
                        {obj.label}
                      </button>
                    ))}
                  </div>
                  {errors.investmentObjectives && (
                    <p className="mt-1.5 text-xs text-[var(--kfx-danger)]">
                      {errors.investmentObjectives.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Button type="button" variant="secondary" onClick={() => setActiveSection(1)}>
                  ← Back
                </Button>
                <Button type="button" variant="primary" onClick={() => setActiveSection(3)}>
                  Next: Declarations →
                </Button>
              </div>
            </Card>
          )}

          {/* Section 3 — Declarations */}
          {activeSection === 3 && (
            <Card>
              <h2 className="text-sm font-semibold text-[var(--kfx-text)] mb-5">
                Regulatory Declarations
              </h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Tax Residency" required disabled={isReadOnly}
                    options={COUNTRIES} placeholder="Select country"
                    error={errors.taxResidency?.message}
                    {...register('taxResidency')}
                  />
                  <Input
                    label="Tax ID / TIN (optional)" disabled={isReadOnly}
                    placeholder="e.g. 123-45-6789"
                    error={errors.taxIdNumber?.message}
                    {...register('taxIdNumber')}
                  />
                </div>
                <div className="space-y-4 pt-2">
                  <Checkbox
                    label="I am a Politically Exposed Person (PEP)"
                    description="A PEP is someone who holds or has held a prominent public position."
                    disabled={isReadOnly}
                    {...register('politicallyExposed')}
                  />
                  {isPEP && (
                    <Textarea
                      label="PEP Details"
                      disabled={isReadOnly}
                      placeholder="Please describe your position and the relevant country."
                      rows={3}
                      error={errors.pepDetails?.message}
                      {...register('pepDetails')}
                    />
                  )}
                  <Checkbox
                    label="I am a US Person"
                    description="Includes US citizens, residents, and entities with US tax obligations."
                    disabled={isReadOnly}
                    {...register('usPerson')}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button type="button" variant="secondary" onClick={() => setActiveSection(2)}>
                  ← Back
                </Button>
                {!isReadOnly && (
                  <Button type="submit" variant="primary" loading={isSubmitting}>
                    Save & Continue
                  </Button>
                )}
              </div>
            </Card>
          )}
        </form>
      </div>
    </div>
  )
}