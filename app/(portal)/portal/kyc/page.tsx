'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import type { KYCFormData } from '@/lib/validations'
import { PortalHeader } from '@/components/layout/PortalHeader'
import { Input, Select, Textarea } from '@/components/ui/FormFields'
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
  { label: 'No experience',      value: 'none' },
  { label: 'Less than 1 year',   value: 'less_1yr' },
  { label: '1 – 3 years',        value: '1_3yr' },
  { label: '3 – 5 years',        value: '3_5yr' },
  { label: '5 – 10 years',       value: '5_10yr' },
  { label: 'More than 10 years', value: 'over_10yr' },
]

const INVESTMENT_OBJECTIVES = [
  { label: 'Capital Growth',    value: 'capital_growth' },
  { label: 'Income Generation', value: 'income' },
  { label: 'Hedging',           value: 'hedging' },
  { label: 'Speculation',       value: 'speculation' },
  { label: 'Diversification',   value: 'diversification' },
]

// Defined outside component to avoid re-creation on every render
const COUNTRIES = [
  { label: 'Afghanistan', value: 'AF' },
  { label: 'Albania', value: 'AL' },
  { label: 'Algeria', value: 'DZ' },
  { label: 'Andorra', value: 'AD' },
  { label: 'Angola', value: 'AO' },
  { label: 'Antigua and Barbuda', value: 'AG' },
  { label: 'Argentina', value: 'AR' },
  { label: 'Armenia', value: 'AM' },
  { label: 'Australia', value: 'AU' },
  { label: 'Austria', value: 'AT' },
  { label: 'Azerbaijan', value: 'AZ' },
  { label: 'Bahamas', value: 'BS' },
  { label: 'Bahrain', value: 'BH' },
  { label: 'Bangladesh', value: 'BD' },
  { label: 'Barbados', value: 'BB' },
  { label: 'Belarus', value: 'BY' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Belize', value: 'BZ' },
  { label: 'Benin', value: 'BJ' },
  { label: 'Bhutan', value: 'BT' },
  { label: 'Bolivia', value: 'BO' },
  { label: 'Bosnia and Herzegovina', value: 'BA' },
  { label: 'Botswana', value: 'BW' },
  { label: 'Brazil', value: 'BR' },
  { label: 'Brunei', value: 'BN' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Burkina Faso', value: 'BF' },
  { label: 'Burundi', value: 'BI' },
  { label: 'Cabo Verde', value: 'CV' },
  { label: 'Cambodia', value: 'KH' },
  { label: 'Cameroon', value: 'CM' },
  { label: 'Canada', value: 'CA' },
  { label: 'Central African Republic', value: 'CF' },
  { label: 'Chad', value: 'TD' },
  { label: 'Chile', value: 'CL' },
  { label: 'China', value: 'CN' },
  { label: 'Colombia', value: 'CO' },
  { label: 'Comoros', value: 'KM' },
  { label: 'Congo (Democratic Republic)', value: 'CD' },
  { label: 'Congo (Republic)', value: 'CG' },
  { label: 'Costa Rica', value: 'CR' },
  { label: 'Croatia', value: 'HR' },
  { label: 'Cuba', value: 'CU' },
  { label: 'Cyprus', value: 'CY' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Djibouti', value: 'DJ' },
  { label: 'Dominica', value: 'DM' },
  { label: 'Dominican Republic', value: 'DO' },
  { label: 'Ecuador', value: 'EC' },
  { label: 'Egypt', value: 'EG' },
  { label: 'El Salvador', value: 'SV' },
  { label: 'Equatorial Guinea', value: 'GQ' },
  { label: 'Eritrea', value: 'ER' },
  { label: 'Estonia', value: 'EE' },
  { label: 'Eswatini', value: 'SZ' },
  { label: 'Ethiopia', value: 'ET' },
  { label: 'Fiji', value: 'FJ' },
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'Gabon', value: 'GA' },
  { label: 'Gambia', value: 'GM' },
  { label: 'Georgia', value: 'GE' },
  { label: 'Germany', value: 'DE' },
  { label: 'Ghana', value: 'GH' },
  { label: 'Greece', value: 'GR' },
  { label: 'Grenada', value: 'GD' },
  { label: 'Guatemala', value: 'GT' },
  { label: 'Guinea', value: 'GN' },
  { label: 'Guinea-Bissau', value: 'GW' },
  { label: 'Guyana', value: 'GY' },
  { label: 'Haiti', value: 'HT' },
  { label: 'Honduras', value: 'HN' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Iceland', value: 'IS' },
  { label: 'India', value: 'IN' },
  { label: 'Indonesia', value: 'ID' },
  { label: 'Iran', value: 'IR' },
  { label: 'Iraq', value: 'IQ' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Israel', value: 'IL' },
  { label: 'Italy', value: 'IT' },
  { label: 'Jamaica', value: 'JM' },
  { label: 'Japan', value: 'JP' },
  { label: 'Jordan', value: 'JO' },
  { label: 'Kazakhstan', value: 'KZ' },
  { label: 'Kenya', value: 'KE' },
  { label: 'Kiribati', value: 'KI' },
  { label: 'Kuwait', value: 'KW' },
  { label: 'Kyrgyzstan', value: 'KG' },
  { label: 'Laos', value: 'LA' },
  { label: 'Latvia', value: 'LV' },
  { label: 'Lebanon', value: 'LB' },
  { label: 'Lesotho', value: 'LS' },
  { label: 'Liberia', value: 'LR' },
  { label: 'Libya', value: 'LY' },
  { label: 'Liechtenstein', value: 'LI' },
  { label: 'Lithuania', value: 'LT' },
  { label: 'Luxembourg', value: 'LU' },
  { label: 'Madagascar', value: 'MG' },
  { label: 'Malawi', value: 'MW' },
  { label: 'Malaysia', value: 'MY' },
  { label: 'Maldives', value: 'MV' },
  { label: 'Mali', value: 'ML' },
  { label: 'Malta', value: 'MT' },
  { label: 'Marshall Islands', value: 'MH' },
  { label: 'Mauritania', value: 'MR' },
  { label: 'Mauritius', value: 'MU' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Micronesia', value: 'FM' },
  { label: 'Moldova', value: 'MD' },
  { label: 'Monaco', value: 'MC' },
  { label: 'Mongolia', value: 'MN' },
  { label: 'Montenegro', value: 'ME' },
  { label: 'Morocco', value: 'MA' },
  { label: 'Mozambique', value: 'MZ' },
  { label: 'Myanmar', value: 'MM' },
  { label: 'Namibia', value: 'NA' },
  { label: 'Nauru', value: 'NR' },
  { label: 'Nepal', value: 'NP' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'New Zealand', value: 'NZ' },
  { label: 'Nicaragua', value: 'NI' },
  { label: 'Niger', value: 'NE' },
  { label: 'Nigeria', value: 'NG' },
  { label: 'North Korea', value: 'KP' },
  { label: 'North Macedonia', value: 'MK' },
  { label: 'Norway', value: 'NO' },
  { label: 'Oman', value: 'OM' },
  { label: 'Pakistan', value: 'PK' },
  { label: 'Palau', value: 'PW' },
  { label: 'Palestine', value: 'PS' },
  { label: 'Panama', value: 'PA' },
  { label: 'Papua New Guinea', value: 'PG' },
  { label: 'Paraguay', value: 'PY' },
  { label: 'Peru', value: 'PE' },
  { label: 'Philippines', value: 'PH' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Qatar', value: 'QA' },
  { label: 'Romania', value: 'RO' },
  { label: 'Russia', value: 'RU' },
  { label: 'Rwanda', value: 'RW' },
  { label: 'Saint Kitts and Nevis', value: 'KN' },
  { label: 'Saint Lucia', value: 'LC' },
  { label: 'Saint Vincent and the Grenadines', value: 'VC' },
  { label: 'Samoa', value: 'WS' },
  { label: 'San Marino', value: 'SM' },
  { label: 'Sao Tome and Principe', value: 'ST' },
  { label: 'Saudi Arabia', value: 'SA' },
  { label: 'Senegal', value: 'SN' },
  { label: 'Serbia', value: 'RS' },
  { label: 'Seychelles', value: 'SC' },
  { label: 'Sierra Leone', value: 'SL' },
  { label: 'Singapore', value: 'SG' },
  { label: 'Slovakia', value: 'SK' },
  { label: 'Slovenia', value: 'SI' },
  { label: 'Solomon Islands', value: 'SB' },
  { label: 'Somalia', value: 'SO' },
  { label: 'South Africa', value: 'ZA' },
  { label: 'South Korea', value: 'KR' },
  { label: 'South Sudan', value: 'SS' },
  { label: 'Spain', value: 'ES' },
  { label: 'Sri Lanka', value: 'LK' },
  { label: 'Sudan', value: 'SD' },
  { label: 'Suriname', value: 'SR' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'Syria', value: 'SY' },
  { label: 'Taiwan', value: 'TW' },
  { label: 'Tajikistan', value: 'TJ' },
  { label: 'Tanzania', value: 'TZ' },
  { label: 'Thailand', value: 'TH' },
  { label: 'Timor-Leste', value: 'TL' },
  { label: 'Togo', value: 'TG' },
  { label: 'Tonga', value: 'TO' },
  { label: 'Trinidad and Tobago', value: 'TT' },
  { label: 'Tunisia', value: 'TN' },
  { label: 'Turkey', value: 'TR' },
  { label: 'Turkmenistan', value: 'TM' },
  { label: 'Tuvalu', value: 'TV' },
  { label: 'Uganda', value: 'UG' },
  { label: 'Ukraine', value: 'UA' },
  { label: 'United Arab Emirates', value: 'AE' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'United States', value: 'US' },
  { label: 'Uruguay', value: 'UY' },
  { label: 'Uzbekistan', value: 'UZ' },
  { label: 'Vanuatu', value: 'VU' },
  { label: 'Vatican City', value: 'VA' },
  { label: 'Venezuela', value: 'VE' },
  { label: 'Vietnam', value: 'VN' },
  { label: 'Yemen', value: 'YE' },
  { label: 'Zambia', value: 'ZM' },
  { label: 'Zimbabwe', value: 'ZW' },
]

const SECTIONS = ['Personal Info', 'Address', 'Financial Profile', 'Declarations']

export default function KYCPage() {
  const router   = useRouter()
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [profile,       setProfile]       = useState<ClientProfile | null>(null)
  const [kyc,           setKYC]           = useState<KYCSubmission | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [submitting,    setSubmitting]    = useState(false)
  const [serverError,   setServerError]   = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [objectives,    setObjectives]    = useState<string[]>([])
  const [isPEP,         setIsPEP]         = useState(false)
  const [isUSPerson,    setIsUSPerson]    = useState(false)

  const { register, watch, setValue, getValues } = useForm<KYCFormData>({
    defaultValues: {
      firstName:            '',
      lastName:             '',
      dateOfBirth:          '',
      nationality:          '',
      countryOfResidence:   '',
      addressLine1:         '',
      addressLine2:         '',
      city:                 '',
      postalCode:           '',
      phone:                '',
      employmentStatus:     '',
      employerName:         '',
      annualIncomeRange:    '',
      sourceOfFunds:        '',
      tradingExperience:    '',
      investmentObjectives: [],
      politicallyExposed:   false,
      pepDetails:           '',
      usPerson:             false,
      taxResidency:         '',
      taxIdNumber:          '',
    },
  })

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
        setValue('firstName',          profileData.first_name)
        setValue('lastName',           profileData.last_name)
        setValue('phone',              profileData.phone ?? '')
        setValue('dateOfBirth',        profileData.date_of_birth ?? '')
        setValue('nationality',        profileData.nationality ?? '')
        setValue('countryOfResidence', profileData.country_of_residence ?? '')
        setValue('addressLine1',       profileData.address_line1 ?? '')
        setValue('addressLine2',       profileData.address_line2 ?? '')
        setValue('city',               profileData.city ?? '')
        setValue('postalCode',         profileData.postal_code ?? '')
        setValue('employmentStatus',   k.employment_status ?? '')
        setValue('employerName',       k.employer_name ?? '')
        setValue('annualIncomeRange',  k.annual_income_range ?? '')
        setValue('sourceOfFunds',      k.source_of_funds ?? '')
        setValue('tradingExperience',  k.trading_experience ?? '')
        setValue('taxResidency',       k.tax_residency ?? '')
        setValue('taxIdNumber',        k.tax_id_number ?? '')
        setValue('pepDetails',         k.pep_details ?? '')
        setObjectives(k.investment_objectives ?? [])
        setIsPEP(k.politically_exposed ?? false)
        setIsUSPerson(k.us_person ?? false)
      } else {
        setValue('firstName', profileData.first_name)
        setValue('lastName',  profileData.last_name)
      }

      setLoading(false)
    }
    load()
  }, [supabase, router, setValue])

  function toggleObjective(value: string) {
    setObjectives((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  async function onSave() {
    setServerError(null)
    if (!profile) {
      toastError('Profile not loaded', 'Please refresh the page and try again.')
      return
    }

    const data = getValues()

    // Only first name, last name, date of birth, and nationality are mandatory
    const missing: string[] = []
    if (!data.firstName)   missing.push('First Name')
    if (!data.lastName)    missing.push('Last Name')
    if (!data.dateOfBirth) missing.push('Date of Birth')
    if (!data.nationality) missing.push('Nationality')

    if (missing.length > 0) {
      const msg = 'Please complete: ' + missing.join(', ')
      setServerError(msg)
      toastError('Incomplete form', msg)
      setActiveSection(0)
      return
    }

    setSubmitting(true)
    try {
      const { error: profileErr } = await supabase
        .from('client_profiles')
        .update({
          first_name:           data.firstName,
          last_name:            data.lastName,
          phone:                data.phone || null,
          date_of_birth:        data.dateOfBirth,
          nationality:          data.nationality,
          country_of_residence: data.countryOfResidence || null,
          address_line1:        data.addressLine1 || null,
          address_line2:        data.addressLine2 || null,
          city:                 data.city || null,
          postal_code:          data.postalCode || null,
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
          employment_status:     data.employmentStatus || null,
          employer_name:         data.employerName || null,
          annual_income_range:   data.annualIncomeRange || null,
          source_of_funds:       data.sourceOfFunds || null,
          trading_experience:    data.tradingExperience || null,
          investment_objectives: objectives.length > 0 ? objectives : null,
          politically_exposed:   isPEP,
          pep_details:           data.pepDetails || null,
          us_person:             isUSPerson,
          tax_residency:         data.taxResidency || null,
          tax_id_number:         data.taxIdNumber || null,
          updated_at:            new Date().toISOString(),
        })

      if (kycErr) throw new Error(kycErr.message)

      // Notify admin of KYC submission
      await fetch('/api/notifications/kyc-submitted', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          clientId:   profile.id,
          clientName: data.firstName + ' ' + data.lastName,
        }),
      })

      success('KYC submitted', 'Your information has been saved and is under review.')
      router.push('/portal/documents')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setServerError(msg)
      toastError('Submission failed', msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <PortalHeader title="KYC Verification" subtitle="Complete your identity profile." />
        <div className="p-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-[#f1f5f9] rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const isReadOnly = kyc?.status === 'approved' || kyc?.status === 'under_review'

  return (
    <div>
      <PortalHeader
        title="KYC Verification"
        subtitle="Complete your Know Your Customer profile to activate your account."
        action={kyc ? <StatusBadge type="kyc" status={kyc.status} /> : undefined}
      />

      <div className="p-6">
        {isReadOnly && (
          <Alert variant={kyc?.status === 'approved' ? 'success' : 'info'} className="mb-6">
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
          <Alert variant="error" className="mb-6">{serverError}</Alert>
        )}

        <div className="flex gap-1 mb-6 bg-white border border-[#e5e7eb] rounded-lg p-1">
          {SECTIONS.map((s, i) => (
            <button key={s} type="button" onClick={() => setActiveSection(i)}
              className={cn(
                'flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all',
                activeSection === i
                  ? 'bg-[#0f172a] text-white'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
              )}>
              {s}
            </button>
          ))}
        </div>

        {/* SECTION 0 — Personal Info: name + DOB + nationality mandatory, rest optional */}
        {activeSection === 0 && (
          <Card>
            <h2 className="text-sm font-semibold text-[#0f172a] mb-5">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First Name"    required disabled={isReadOnly} {...register('firstName')} />
              <Input label="Last Name"     required disabled={isReadOnly} {...register('lastName')} />
              <Input label="Date of Birth" type="date" required disabled={isReadOnly} {...register('dateOfBirth')} />
              <Input label="Phone Number"  type="tel"  disabled={isReadOnly} placeholder="+1 234 567 8900" {...register('phone')} />
              <Select label="Nationality"          required disabled={isReadOnly} options={COUNTRIES} placeholder="Select nationality" {...register('nationality')} />
              <Select label="Country of Residence" disabled={isReadOnly} options={COUNTRIES} placeholder="Select country (optional)" {...register('countryOfResidence')} />
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="button" variant="primary" onClick={() => setActiveSection(1)}>
                Next: Address →
              </Button>
            </div>
          </Card>
        )}

        {/* SECTION 1 — Address: all optional */}
        {activeSection === 1 && (
          <Card>
            <h2 className="text-sm font-semibold text-[#0f172a] mb-5">
              Residential Address <span className="text-xs font-normal text-[#94a3b8]">(optional)</span>
            </h2>
            <div className="space-y-4">
              <Input label="Address Line 1" disabled={isReadOnly} placeholder="Street address" {...register('addressLine1')} />
              <Input label="Address Line 2" disabled={isReadOnly} placeholder="Apartment, suite, etc." {...register('addressLine2')} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="City"        disabled={isReadOnly} {...register('city')} />
                <Input label="Postal Code" disabled={isReadOnly} {...register('postalCode')} />
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setActiveSection(0)}>← Back</Button>
              <Button type="button" variant="primary"   onClick={() => setActiveSection(2)}>Next: Financial Profile →</Button>
            </div>
          </Card>
        )}

        {/* SECTION 2 — Financial Profile: all optional */}
        {activeSection === 2 && (
          <Card>
            <h2 className="text-sm font-semibold text-[#0f172a] mb-5">
              Financial Profile <span className="text-xs font-normal text-[#94a3b8]">(optional)</span>
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Employment Status"   disabled={isReadOnly} options={EMPLOYMENT_OPTIONS}     placeholder="Select status"    {...register('employmentStatus')} />
                {(employmentStatus === 'employed' || employmentStatus === 'self_employed') && (
                  <Input label="Employer / Company Name" disabled={isReadOnly} {...register('employerName')} />
                )}
                <Select label="Annual Income Range" disabled={isReadOnly} options={INCOME_OPTIONS}          placeholder="Select range"     {...register('annualIncomeRange')} />
                <Select label="Source of Funds"     disabled={isReadOnly} options={SOURCE_OF_FUNDS_OPTIONS} placeholder="Select source"    {...register('sourceOfFunds')} />
                <Select label="Trading Experience"  disabled={isReadOnly} options={EXPERIENCE_OPTIONS}      placeholder="Select experience" {...register('tradingExperience')} />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#0f172a] mb-2">
                  Investment Objectives <span className="text-xs font-normal text-[#94a3b8]">(optional)</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INVESTMENT_OBJECTIVES.map((obj) => (
                    <button key={obj.value} type="button" disabled={isReadOnly}
                      onClick={() => toggleObjective(obj.value)}
                      className={cn(
                        'px-3 py-2 rounded-xl text-xs font-medium border transition-all',
                        objectives.includes(obj.value)
                          ? 'bg-[#eef2f6] border-[#0f172a] text-[#0f172a]'
                          : 'border-[#e2e8f0] text-[#64748b] hover:border-[#94a3b8]'
                      )}>
                      {obj.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setActiveSection(1)}>← Back</Button>
              <Button type="button" variant="primary"   onClick={() => setActiveSection(3)}>Next: Declarations →</Button>
            </div>
          </Card>
        )}

        {/* SECTION 3 — Declarations: all optional */}
        {activeSection === 3 && (
          <Card>
            <h2 className="text-sm font-semibold text-[#0f172a] mb-5">
              Regulatory Declarations <span className="text-xs font-normal text-[#94a3b8]">(optional)</span>
            </h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Tax Residency" disabled={isReadOnly} options={COUNTRIES} placeholder="Select country" {...register('taxResidency')} />
                <Input  label="Tax ID / TIN"  disabled={isReadOnly} placeholder="e.g. 123-45-6789" {...register('taxIdNumber')} />
              </div>
              <div className="space-y-4 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={isPEP} onChange={(e) => setIsPEP(e.target.checked)}
                    disabled={isReadOnly}
                    className="mt-1 h-4 w-4 rounded border-[#cbd5e1] accent-[#0f172a]" />
                  <div>
                    <p className="text-sm font-medium text-[#0f172a]">I am a Politically Exposed Person (PEP)</p>
                    <p className="text-xs text-[#64748b] mt-0.5">A PEP is someone who holds or has held a prominent public position.</p>
                  </div>
                </label>
                {isPEP && (
                  <Textarea label="PEP Details" disabled={isReadOnly}
                    placeholder="Please describe your position and the relevant country."
                    rows={3} {...register('pepDetails')} />
                )}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={isUSPerson} onChange={(e) => setIsUSPerson(e.target.checked)}
                    disabled={isReadOnly}
                    className="mt-1 h-4 w-4 rounded border-[#cbd5e1] accent-[#0f172a]" />
                  <div>
                    <p className="text-sm font-medium text-[#0f172a]">I am a US Person</p>
                    <p className="text-xs text-[#64748b] mt-0.5">Includes US citizens, residents, and entities with US tax obligations.</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setActiveSection(2)}>← Back</Button>
              {!isReadOnly && (
                <Button type="button" variant="primary" loading={submitting} onClick={onSave}>
                  Save & Continue
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}