'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { Input } from '@/components/ui/FormFields'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

export default function PortalLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setServerError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setServerError(error.message)
      return
    }
    router.push('/portal/dashboard')
    router.refresh()
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--kfx-text)] tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-[var(--kfx-text-muted)] mt-1.5">
          Sign in to your Keystone FX client portal.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <Alert variant="error">{serverError}</Alert>
        )}

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="mt-2 text-right">
            <Link
              href="/portal/forgot-password"
              className="text-xs text-[var(--kfx-text-muted)] hover:text-[var(--kfx-accent)] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="w-full"
        >
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--kfx-text-muted)]">
          Don&apos;t have an account?{' '}
          <Link
            href="/portal/register"
            className="text-[var(--kfx-accent)] hover:underline font-medium"
          >
            Apply now
          </Link>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-[var(--kfx-border-subtle)] text-center">
        <Link
          href="/admin/login"
          className="text-xs text-[var(--kfx-text-subtle)] hover:text-[var(--kfx-text-muted)] transition-colors"
        >
          Admin access →
        </Link>
      </div>
    </div>
  )
}