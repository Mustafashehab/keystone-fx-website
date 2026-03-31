'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterFormData } from '@/lib/validations'
import { Input, Select } from '@/components/ui/FormFields'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

const ACCOUNT_TYPE_OPTIONS = [
  { label: 'Individual Trader',   value: 'individual' },
  { label: 'Professional Client', value: 'professional' },
  { label: 'Institutional',       value: 'institutional' },
]

export default function PortalRegisterPage() {
  const supabase = createClient()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success,     setSuccess]     = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { accountType: 'individual' },
  })

  async function onSubmit(data: RegisterFormData) {
    setServerError(null)

    const { error } = await supabase.auth.signUp({
      email:    data.email,
      password: data.password,
      options: {
        data: {
          first_name:   data.firstName,
          last_name:    data.lastName,
          account_type: data.accountType,
          role:         'client',
        },
      },
    })

    if (error) {
      setServerError(error.message)
      return
    }

    fetch('/api/notifications/client-registered', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        clientName:  `${data.firstName} ${data.lastName}`,
        email:       data.email,
        accountType: data.accountType,
      }),
    }).catch(() => {})

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="animate-fade-in text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--kfx-success-muted)] flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[var(--kfx-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[var(--kfx-text)] mb-2">Check your email</h2>
        <p className="text-sm text-[var(--kfx-text-muted)]">
          We&apos;ve sent a confirmation link to your email address. Click it to activate your account and begin onboarding.
        </p>
        <Link href="/portal/login" className="kfx-btn-secondary mt-6 inline-flex">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-[var(--kfx-text)] tracking-tight">Open an account</h1>
        <p className="text-sm text-[var(--kfx-text-muted)] mt-1.5">Start your Keystone FX client onboarding.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && <Alert variant="error">{serverError}</Alert>}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name" placeholder="Jane" autoComplete="given-name"
            error={errors.firstName?.message} required {...register('firstName')}
          />
          <Input
            label="Last name" placeholder="Smith" autoComplete="family-name"
            error={errors.lastName?.message} required {...register('lastName')}
          />
        </div>

        <Input
          label="Email address" type="email" placeholder="you@example.com"
          autoComplete="email" error={errors.email?.message} required {...register('email')}
        />

        <Select
          label="Account type" options={ACCOUNT_TYPE_OPTIONS}
          error={errors.accountType?.message} required {...register('accountType')}
        />

        <Input
          label="Password" type="password" placeholder="Min. 8 characters"
          autoComplete="new-password" error={errors.password?.message} required {...register('password')}
        />

        <Input
          label="Confirm password" type="password" placeholder="Repeat password"
          autoComplete="new-password" error={errors.confirmPassword?.message} required {...register('confirmPassword')}
        />

        <Alert variant="info">
          By registering you agree to our Terms of Service and Privacy Policy.
          Your information will be used for regulatory compliance and account verification purposes only.
        </Alert>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>

      <div className="mt-5 text-center">
        <p className="text-sm text-[var(--kfx-text-muted)]">
          Already have an account?{' '}
          <Link href="/portal/login" className="text-[var(--kfx-accent)] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}