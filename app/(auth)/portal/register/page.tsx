'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [confirmationPending, setConfirmationPending] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

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

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            first_name: data.firstName.trim(),
            last_name: data.lastName.trim(),
            account_type: data.accountType,
            role: 'client',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) { setServerError(error.message); return }

      if (!authData.session) {
        setConfirmationPending(true)
        return
      }

      // Session comes directly from signup when email confirmation is disabled.
      // Passwords are never sent to the notification endpoints.
      await Promise.allSettled([
        fetch('/api/notifications/welcome-email', { method: 'POST' }),
        fetch('/api/notifications/client-registered', { method: 'POST' }),
      ])
      router.push('/portal/dashboard')
      router.refresh()
    } catch {
      setServerError('Unable to connect to the account service. Check your connection and try signing in before registering again.')
    }
  }

  if (confirmationPending) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold text-[var(--kfx-text)]">Check your email</h1>
        <p className="text-sm text-[var(--kfx-text-muted)]">If this is a new registration, open the confirmation email to finish creating your account. Check your spam folder too. If you already have an account, sign in or reset your password.</p>
        <Link href="/portal/login" className="block font-medium text-[var(--kfx-accent)]">Go to sign in</Link>
        <Link href="/portal/forgot-password" className="block text-sm text-[var(--kfx-accent)]">Reset password</Link>
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
          By registering you agree to our{' '}
          <Link href="/en/terms" target="_blank" rel="noopener noreferrer" className="font-medium underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/en/privacy" target="_blank" rel="noopener noreferrer" className="font-medium underline">
            Privacy Policy
          </Link>
          , and confirm you have read our{' '}
          <Link href="/en/risk-warning" target="_blank" rel="noopener noreferrer" className="font-medium underline">
            Risk Warning
          </Link>
          . Your information will be used for regulatory compliance and account verification purposes only.
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