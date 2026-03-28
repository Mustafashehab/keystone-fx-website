'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { Alert } from '@/components/ui/Alert'

const GOLD        = '#c9a84c'
const GOLD_NEON   = '#f5c842'
const GOLD_GLOW   = 'rgba(245,200,66,0.35)'
const GOLD_SOFT   = 'rgba(201,168,76,0.12)'
const GOLD_BORDER = 'rgba(201,168,76,0.40)'

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
      email:    data.email,
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
        background: 'linear-gradient(145deg, #f8f6f0 0%, #fefdf9 50%, #f5f3ec 100%)',
      }}
    >
      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glow — top right */}
      <div
        className="fixed top-0 right-0 pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle at 70% 30%, ${GOLD_GLOW} 0%, transparent 70%)`,
        }}
      />

      {/* Glow — bottom left */}
      <div
        className="fixed bottom-0 left-0 pointer-events-none"
        style={{
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle at 30% 70%, rgba(245,200,66,0.18) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-3">
            <Image
              src="/logo.png"
              alt="Keystone FX"
              width={80}
              height={80}
              className="object-contain drop-shadow-md"
              priority
            />
          </div>

          {/* Admin Console badge */}
          <div
            className="flex items-center gap-2 mt-1 px-3 py-0.5 rounded-full"
            style={{
              background: GOLD_SOFT,
              border: `1px solid ${GOLD_BORDER}`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: GOLD_NEON,
                boxShadow: `0 0 6px ${GOLD_NEON}`,
              }}
            />
            <p
              className="text-[10px] tracking-widest uppercase font-semibold"
              style={{ color: GOLD }}
            >
              Admin Console
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7"
          style={{
            background: 'rgba(255,255,255,0.92)',
            border: `1.5px solid ${GOLD_BORDER}`,
            boxShadow: `
              0 4px 32px rgba(0,0,0,0.08),
              0 0 0 1px rgba(255,255,255,0.8) inset,
              0 2px 60px ${GOLD_SOFT}
            `,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="mb-6">
            <h1 className="text-lg font-bold" style={{ color: '#0f0a02' }}>
              Administrator Sign In
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#92816a' }}>
              Restricted to Keystone FX personnel only
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <Alert variant="error">{serverError}</Alert>
            )}

            {/* Email */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: '#6b5c3e' }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="admin@keystonefx.com"
                autoComplete="email"
                className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: '#fdfbf7',
                  border: '1.5px solid #e8dfc8',
                  color: '#1a1308',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = GOLD
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD_SOFT}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e8dfc8'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: '#6b5c3e' }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: '#fdfbf7',
                  border: '1.5px solid #e8dfc8',
                  color: '#1a1308',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = GOLD
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD_SOFT}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e8dfc8'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-150 mt-2"
              style={{
                background: isSubmitting
                  ? GOLD
                  : `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_NEON} 100%)`,
                color: '#0f0a02',
                boxShadow: isSubmitting
                  ? 'none'
                  : `0 4px 16px ${GOLD_GLOW}, 0 0 0 1px ${GOLD_BORDER}`,
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <div
            className="w-1 h-1 rounded-full"
            style={{ background: GOLD, boxShadow: `0 0 4px ${GOLD_NEON}` }}
          />
          <p className="text-xs" style={{ color: '#a08c6e' }}>
            Keystone FX · Secure Admin Access
          </p>
          <div
            className="w-1 h-1 rounded-full"
            style={{ background: GOLD, boxShadow: `0 0 4px ${GOLD_NEON}` }}
          />
        </div>
      </div>
    </div>
  )
}