'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

const GOLD        = '#c9a84c'
const GOLD_NEON   = '#f5c842'
const GOLD_GLOW   = 'rgba(245,200,66,0.35)'
const GOLD_SOFT   = 'rgba(201,168,76,0.12)'
const GOLD_BORDER = 'rgba(201,168,76,0.40)'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email,     setEmail]     = useState('')
  const [sending,   setSending]   = useState(false)
  const [sent,      setSent]      = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSending(true)
    setError(null)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/portal/reset-password` }
    )

    if (resetError) {
      setError(resetError.message)
      setSending(false)
      return
    }

    setSent(true)
    setSending(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(145deg, #f8f6f0 0%, #fefdf9 50%, #f5f3ec 100%)',
      }}
    >
      {/* Grid */}
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

      {/* Glow blobs */}
      <div className="fixed top-0 left-0 pointer-events-none" style={{ width: '400px', height: '400px', background: `radial-gradient(circle at 30% 30%, ${GOLD_GLOW} 0%, transparent 70%)` }} />
      <div className="fixed bottom-0 right-0 pointer-events-none" style={{ width: '300px', height: '300px', background: `radial-gradient(circle at 70% 70%, rgba(245,200,66,0.18) 0%, transparent 70%)` }} />

      <div className="relative z-10 w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-3">
            <Image src="/logo.png" alt="Keystone FX" width={80} height={80} className="object-contain drop-shadow-md" priority />
          </div>
          <div
            className="flex items-center gap-2 mt-1 px-3 py-0.5 rounded-full"
            style={{ background: GOLD_SOFT, border: `1px solid ${GOLD_BORDER}` }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD_NEON, boxShadow: `0 0 6px ${GOLD_NEON}` }} />
            <p className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: GOLD }}>
              Client Portal
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7"
          style={{
            background: 'rgba(255,255,255,0.92)',
            border: `1.5px solid ${GOLD_BORDER}`,
            boxShadow: `0 4px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.8) inset, 0 2px 60px ${GOLD_SOFT}`,
            backdropFilter: 'blur(12px)',
          }}
        >
          {sent ? (
            /* Success state */
            <div className="text-center py-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: GOLD_SOFT, border: `1.5px solid ${GOLD_BORDER}` }}
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold mb-2" style={{ color: '#0f0a02' }}>Check your email</h1>
              <p className="text-sm mb-1" style={{ color: '#92816a' }}>
                We sent a password reset link to
              </p>
              <p className="text-sm font-semibold mb-5" style={{ color: '#0f0a02' }}>{email}</p>
              <p className="text-xs mb-6" style={{ color: '#92816a' }}>
                Click the link in the email to reset your password. If you don't see it, check your spam folder.
              </p>
              <Link
                href="/portal/login"
                className="text-sm font-semibold transition-colors"
                style={{ color: GOLD }}
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-6">
                <h1 className="text-lg font-bold" style={{ color: '#0f0a02' }}>Reset your password</h1>
                <p className="text-xs mt-0.5" style={{ color: '#92816a' }}>
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: '#6b5c3e' }}
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
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
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending || !email.trim()}
                  className="w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-150 mt-2"
                  style={{
                    background: sending ? GOLD : `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_NEON} 100%)`,
                    color: '#0f0a02',
                    boxShadow: sending ? 'none' : `0 4px 16px ${GOLD_GLOW}, 0 0 0 1px ${GOLD_BORDER}`,
                    opacity: sending || !email.trim() ? 0.7 : 1,
                  }}
                >
                  {sending ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link
                  href="/portal/login"
                  className="text-xs transition-colors"
                  style={{ color: '#92816a' }}
                >
                  ← Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <div className="w-1 h-1 rounded-full" style={{ background: GOLD, boxShadow: `0 0 4px ${GOLD_NEON}` }} />
          <p className="text-xs" style={{ color: '#a08c6e' }}>Keystone FX · Secure Client Portal</p>
          <div className="w-1 h-1 rounded-full" style={{ background: GOLD, boxShadow: `0 0 4px ${GOLD_NEON}` }} />
        </div>
      </div>
    </div>
  )
}