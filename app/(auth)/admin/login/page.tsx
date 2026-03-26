'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { Alert } from '@/components/ui/Alert'

const GOLD = 'var(--kfx-gold)'
const GOLD_15 = 'rgba(201,168,76,0.15)'
const GOLD_05 = 'rgba(201,168,76,0.05)'

export default function AdminLoginPage() {
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

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError(error.message)
      return
    }

    if (authData.user?.user_metadata?.role !== 'admin') {
      await supabase.auth.signOut()
      setServerError('Access denied. Admin credentials required.')
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #07090d 0%, #0d1117 50%, #070a0f 100%)',
      }}
    >
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(201,168,76,0.12) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-sm animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
            style={{ background: GOLD }}
          >
            <span className="text-[#070a0f] text-base font-bold">K</span>
          </div>
          <p className="text-lg font-semibold text-[var(--kfx-text)] tracking-tight">
            Keystone <span style={{ color: GOLD }}>FX</span>
          </p>
          <p
            className="text-xs tracking-widest uppercase mt-0.5 font-medium"
            style={{ color: 'rgba(201,168,76,0.50)' }}
          >
            Admin Console
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-6 border"
          style={{
            background: 'rgba(13,17,23,0.95)',
            borderColor: GOLD_15,
            boxShadow: `0 0 40px ${GOLD_05}`,
          }}
        >
          <h1 className="text-base font-semibold text-[var(--kfx-text)] mb-5">
            Administrator sign in
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <Alert variant="error">{serverError}</Alert>
            )}

            <div>
              <label className="kfx-label">Email</label>
              <input
                type="email"
                placeholder="admin@keystonefx.com"
                autoComplete="email"
                className="kfx-input"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-[var(--kfx-danger)]">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="kfx-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="kfx-input"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-[var(--kfx-danger)]">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-md text-sm font-semibold transition-all duration-150 disabled:opacity-50 mt-2"
              style={{
                background: isSubmitting ? 'rgba(201,168,76,0.5)' : GOLD,
                color: '#070a0f',
              }}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-[var(--kfx-text-subtle)]">
          Restricted access. Keystone FX personnel only.
        </p>
      </div>
    </div>
  )
}