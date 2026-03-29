'use client'

import { useState } from 'react'
import Link from 'next/link'
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

export default function PortalLoginPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [serverError,  setServerError]  = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

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
      email:    data.email,
      password: data.password,
    })
    if (error) { setServerError(error.message); return }
    router.push('/portal/dashboard')
    router.refresh()
  }

  const inputStyle = {
    background: '#fdfbf7',
    border: '1.5px solid #e8dfc8',
    color: '#1a1308',
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = GOLD
    e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD_SOFT}`
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = '#e8dfc8'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(145deg, #f8f6f0 0%, #fefdf9 50%, #f5f3ec 100%)' }}
    >
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
      <div className="fixed top-0 left-0 pointer-events-none" style={{ width: '400px', height: '400px', background: `radial-gradient(circle at 30% 30%, ${GOLD_GLOW} 0%, transparent 70%)` }} />
      <div className="fixed bottom-0 right-0 pointer-events-none" style={{ width: '300px', height: '300px', background: `radial-gradient(circle at 70% 70%, rgba(245,200,66,0.18) 0%, transparent 70%)` }} />

      <div className="relative z-10 w-full max-w-sm">

        <div className="flex flex-col items-center mb-8">
          <div className="mb-3">
            <Image src="/logo.png" alt="Keystone FX" width={80} height={80} className="object-contain drop-shadow-md" priority />
          </div>
          <div className="flex items-center gap-2 mt-1 px-3 py-0.5 rounded-full" style={{ background: GOLD_SOFT, border: `1px solid ${GOLD_BORDER}` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD_NEON, boxShadow: `0 0 6px ${GOLD_NEON}` }} />
            <p className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: GOLD }}>Client Portal</p>
          </div>
        </div>

        <div
          className="rounded-2xl p-7"
          style={{
            background: 'rgba(255,255,255,0.92)',
            border: `1.5px solid ${GOLD_BORDER}`,
            boxShadow: `0 4px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.8) inset, 0 2px 60px ${GOLD_SOFT}`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="mb-6">
            <h1 className="text-lg font-bold" style={{ color: '#0f0a02' }}>Welcome back</h1>
            <p className="text-xs mt-0.5" style={{ color: '#92816a' }}>Sign in to your Keystone FX client portal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && <Alert variant="error">{serverError}</Alert>}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6b5c3e' }}>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                style={inputStyle}
                {...register('email')}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password with eye toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b5c3e' }}>Password</label>
                <Link href="/portal/forgot-password" className="text-xs transition-colors" style={{ color: GOLD }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-10 pl-3 pr-10 rounded-lg text-sm outline-none transition-all"
                  style={inputStyle}
                  {...register('password')}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92816a] hover:text-[#6b5c3e] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-150 mt-2"
              style={{
                background: isSubmitting ? GOLD : `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_NEON} 100%)`,
                color: '#0f0a02',
                boxShadow: isSubmitting ? 'none' : `0 4px 16px ${GOLD_GLOW}, 0 0 0 1px ${GOLD_BORDER}`,
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs" style={{ color: '#92816a' }}>
              Don&apos;t have an account?{' '}
              <Link href="/portal/register" className="font-semibold transition-colors" style={{ color: GOLD }}>Apply now</Link>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          <div className="w-1 h-1 rounded-full" style={{ background: GOLD, boxShadow: `0 0 4px ${GOLD_NEON}` }} />
          <p className="text-xs" style={{ color: '#a08c6e' }}>Keystone FX · Secure Client Portal</p>
          <div className="w-1 h-1 rounded-full" style={{ background: GOLD, boxShadow: `0 0 4px ${GOLD_NEON}` }} />
        </div>
      </div>
    </div>
  )
}