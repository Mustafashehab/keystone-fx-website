'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

const MT5_LINKS = {
  windows: 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/mt5setup.exe',
  mac: 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg',
  ios: 'https://apps.apple.com/app/metatrader-5/id413251709',
  android: 'https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5',
  web: 'https://trade.mql5.com/trade',
}

// ─── Animated counter ────────────────────────────────────────────────────────

function StatCounter({ target, suffix, label, duration = 2000 }: { target: number; suffix: string; label: string; duration?: number }) {
  const [value, setValue] = useState(0)
  const started = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const callbackRef = (node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (node) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            function tick(now: number) {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              // Slow start, fast middle, slow end (ease-in-out cubic)
              const eased = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2
              setValue(Math.round(eased * target))
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        },
        { threshold: 0.3 }
      )
      observerRef.current.observe(node)
    }
  }

  return (
    <div ref={callbackRef} className="text-center">
      <p className="stat-number text-3xl md:text-4xl font-bold tabular-nums">
        {value}<span className="stat-suffix">{suffix}</span>
      </p>
      <p className="text-sm text-slate-500 mt-1.5 font-medium">{label}</p>
    </div>
  )
}

// ─── Scroll reveal wrapper ───────────────────────────────────────────────────

function RevealCard({ children, className, style, glowColor = 'gold' }: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  glowColor?: 'gold' | 'blue' | 'emerald'
}) {
  const [visible, setVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const glowClass = {
    gold: 'card-glow-gold',
    blue: 'card-glow-blue',
    emerald: 'card-glow-emerald',
  }[glowColor]

  const callbackRef = (node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (node) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observerRef.current?.disconnect()
          }
        },
        { threshold: 0.1 }
      )
      observerRef.current.observe(node)
    }
  }

  return (
    <div
      ref={callbackRef}
      className={`reveal-card ${visible ? 'visible' : ''} ${glowClass} ${className ?? ''}`}
      style={style}
    >
      {children}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PlatformsPage() {
  return (
    <>
      <style jsx>{`
        /* ── Animation 1: Moving dot grid ── */
        @keyframes gridDrift {
          0%   { background-position: 0 0; }
          100% { background-position: 48px 48px; }
        }
        .hero-grid {
          background-image: radial-gradient(circle, rgba(201,168,76,0.35) 0.75px, transparent 0.75px);
          background-size: 24px 24px;
          animation: gridDrift 8s linear infinite;
        }

        /* ── Animation 2: Scan line ── */
        @keyframes scanline {
          0%   { transform: translateY(-100%); opacity: 0; }
          5%   { opacity: 0.6; }
          95%  { opacity: 0.6; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
          animation: scanline 4s ease-in-out infinite;
          z-index: 1;
          pointer-events: none;
        }

        /* ── Animation 3: Card border glow on hover ── */
        .card-glow-gold {
          transition: box-shadow 0.4s ease, border-color 0.4s ease, transform 0.4s ease;
        }
        .card-glow-gold:hover {
          border-color: rgba(201,168,76,0.4);
          box-shadow: 0 0 0 1px rgba(201,168,76,0.15), 0 8px 40px rgba(201,168,76,0.12), 0 2px 8px rgba(0,0,0,0.04);
          transform: translateY(-2px);
        }
        .card-glow-blue {
          transition: box-shadow 0.4s ease, border-color 0.4s ease, transform 0.4s ease;
        }
        .card-glow-blue:hover {
          border-color: rgba(59,130,246,0.4);
          box-shadow: 0 0 0 1px rgba(59,130,246,0.15), 0 8px 40px rgba(59,130,246,0.12), 0 2px 8px rgba(0,0,0,0.04);
          transform: translateY(-2px);
        }
        .card-glow-emerald {
          transition: box-shadow 0.4s ease, border-color 0.4s ease, transform 0.4s ease;
        }
        .card-glow-emerald:hover {
          border-color: rgba(16,185,129,0.4);
          box-shadow: 0 0 0 1px rgba(16,185,129,0.15), 0 8px 40px rgba(16,185,129,0.12), 0 2px 8px rgba(0,0,0,0.04);
          transform: translateY(-2px);
        }

        /* ── Animation 4: Floating icons ── */
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .icon-float-1 { animation: iconFloat 3s ease-in-out infinite; }
        .icon-float-2 { animation: iconFloat 3s ease-in-out 0.8s infinite; }
        .icon-float-3 { animation: iconFloat 3s ease-in-out 1.6s infinite; }

        /* ── Animation 5: Counter numbers ── */
        .stat-number {
          color: #c9a84c;
        }
        .stat-suffix {
          color: #b8963f;
        }

        /* ── Animation 6: Button shimmer ── */
        .btn-shimmer {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #c9a84c 0%, #dbb850 50%, #c9a84c 100%);
          transition: all 0.3s ease;
        }
        .btn-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transition: none;
        }
        .btn-shimmer:hover::before {
          animation: btnSweep 0.6s ease forwards;
        }
        .btn-shimmer:hover {
          box-shadow: 0 8px 32px rgba(201,168,76,0.4);
          transform: translateY(-1px);
        }
        @keyframes btnSweep {
          0%   { left: -100%; }
          100% { left: 100%; }
        }

        .btn-outline {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .btn-outline::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.08), transparent);
          transition: none;
        }
        .btn-outline:hover::before {
          animation: btnSweep 0.6s ease forwards;
        }
        .btn-outline:hover {
          border-color: rgba(201,168,76,0.5);
          transform: translateY(-1px);
        }

        .btn-dark {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .btn-dark::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: none;
        }
        .btn-dark:hover::before {
          animation: btnSweep 0.6s ease forwards;
        }
        .btn-dark:hover {
          transform: translateY(-1px);
        }

        /* ── Animation 7: Page entry stagger ── */
        @keyframes heroEntry {
          from { opacity: 0; transform: translateY(40px); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .hero-badge    { animation: heroEntry 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .hero-headline { animation: heroEntry 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .hero-subtitle { animation: heroEntry 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
        .hero-line     { animation: heroEntry 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
        .hero-stats    { animation: heroEntry 0.8s cubic-bezier(0.16,1,0.3,1) 0.9s both; }

        @keyframes lineGrow {
          from { width: 0; }
          to   { width: 48px; }
        }
        .gold-line {
          animation: lineGrow 1s ease-out 1.2s forwards;
          width: 0;
        }

        /* ── Scroll reveal ── */
        .reveal-card {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Gold pulse on hero glow ── */
        @keyframes glowPulse {
          0%, 100% { opacity: 0.04; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 0.07; transform: translate(-50%,-50%) scale(1.05); }
        }
        .hero-glow {
          animation: glowPulse 5s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-[#fafafa]">

        {/* ─── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white pt-28 pb-20 md:pt-36 md:pb-28">
          {/* Moving dot grid */}
          <div className="absolute inset-0 hero-grid" />
          {/* Scan line */}
          <div className="scan-line" />
          {/* Pulsing gold glow */}
          <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-[#c9a84c] rounded-full filter blur-[250px] hero-glow" />

          <div className="relative mx-auto max-w-4xl px-6 text-center z-10">
            <p className="hero-badge inline-flex items-center gap-2 mb-6 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-[#c9a84c] uppercase tracking-[0.15em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
              MetaTrader 5
            </p>
            <h1 className="hero-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08]">
              Trade on Any Device.
              <br />
              <span className="text-[#c9a84c]">Any Time.</span>
            </h1>
            <p className="hero-subtitle mx-auto mt-6 max-w-2xl text-base md:text-lg text-slate-500 leading-relaxed">
              MetaTrader 5 — the world&apos;s most powerful trading platform, fully integrated with Keystone FX infrastructure
            </p>
            <div className="hero-line flex justify-center mt-8">
              <div className="h-[2px] bg-gradient-to-r from-[#c9a84c] to-[#f5e6a3] gold-line rounded-full" />
            </div>
          </div>

          {/* Stats */}
          <div className="hero-stats relative mx-auto max-w-4xl px-6 mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 z-10">
            <StatCounter target={1000} suffix="+" label="Trading Instruments" />
            <StatCounter target={8} suffix="ms" label="Average Execution" />
            <StatCounter target={99} suffix=".99%" label="Uptime" />
            <StatCounter target={24} suffix="/5" label="Market Access" />
          </div>
        </section>

        {/* ─── Platform Cards ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28 space-y-10">

          {/* Card 1 — Desktop */}
          <RevealCard glowColor="gold" className="rounded-3xl bg-white border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 md:p-12">
            <div className="flex items-start gap-5 mb-8">
              <div className="icon-float-1 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c9a84c]/10 to-[#c9a84c]/5 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">MetaTrader 5 Desktop</h2>
                <p className="text-slate-500 mt-1 text-sm">Full-featured professional terminal</p>
                <div className="h-[2px] w-12 bg-gradient-to-r from-[#c9a84c] to-transparent mt-3 rounded-full gold-line" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 mb-10">
              {[
                'Advanced charting with 21 timeframes',
                '80+ technical indicators',
                'Automated trading with Expert Advisors',
                'Real-time market depth',
                'One-click trading',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600">{f}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={MT5_LINKS.windows}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shimmer inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold text-slate-900"
              >
                <WindowsIcon />
                Download for Windows
              </a>
              <a
                href={MT5_LINKS.mac}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2.5 rounded-xl border-2 border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700"
              >
                <AppleIcon />
                Download for Mac
              </a>
            </div>
          </RevealCard>

          {/* Card 2 — Web Terminal */}
          <RevealCard glowColor="blue" className="rounded-3xl bg-white border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 md:p-12" style={{ transitionDelay: '0.1s' }}>
            <div className="flex items-start gap-5 mb-8">
              <div className="icon-float-2 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Web Trading Platform</h2>
                <p className="text-slate-500 mt-1 text-sm">Trade from any browser instantly</p>
                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent mt-3 rounded-full gold-line" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 mb-10">
              {[
                'No download required',
                'Full MT5 functionality',
                'Works on any device',
                'Secure encrypted connection',
                'Real-time quotes and charts',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600">{f}</span>
                </div>
              ))}
            </div>
            <a
              href={MT5_LINKS.web}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold text-slate-900"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Launch Web Terminal
            </a>
          </RevealCard>

          {/* Card 3 — Mobile */}
          <RevealCard glowColor="emerald" className="rounded-3xl bg-white border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 md:p-12" style={{ transitionDelay: '0.2s' }}>
            <div className="flex items-start gap-5 mb-8">
              <div className="icon-float-3 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Mobile Trading App</h2>
                <p className="text-slate-500 mt-1 text-sm">Markets in your pocket</p>
                <div className="h-[2px] w-12 bg-gradient-to-r from-emerald-500 to-transparent mt-3 rounded-full gold-line" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 mb-10">
              {[
                'iOS and Android',
                'Push notifications for price alerts',
                'Full account management',
                'Biometric authentication',
                'Trade execution in one tap',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600">{f}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={MT5_LINKS.ios}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark inline-flex items-center gap-2.5 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 hover:shadow-lg"
              >
                <AppleIcon />
                App Store
              </a>
              <a
                href={MT5_LINKS.android}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2.5 rounded-xl border-2 border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700"
              >
                <AndroidIcon />
                Google Play
              </a>
            </div>
          </RevealCard>
        </section>

        {/* ─── Bottom CTA ───────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-slate-900 py-24">
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)',
                backgroundSize: '20px 20px',
              }}
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c9a84c] rounded-full filter blur-[200px] opacity-[0.06]" />

          <div className="relative mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to start trading?
            </h2>
            <p className="text-slate-400 mb-10 text-base">
              Open your account and access all platforms instantly
            </p>
            <Link
              href="/portal/register"
              className="btn-shimmer inline-flex items-center gap-2.5 rounded-xl px-10 py-4 text-base font-bold text-slate-900"
            >
              Open Account
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function WindowsIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function AndroidIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.523 15.34a1 1 0 01-.992-1.007 1 1 0 011.007-.993 1 1 0 01.993 1.007 1 1 0 01-1.008.993m-11.046 0a1 1 0 01-.992-1.007 1 1 0 011.007-.993 1 1 0 01.993 1.007 1 1 0 01-1.008.993m11.4-6.02l1.997-3.46a.416.416 0 00-.152-.567.416.416 0 00-.568.152L17.12 8.95c-1.46-.67-3.1-1.04-4.87-1.04-1.77 0-3.41.37-4.87 1.04L5.345 5.445a.416.416 0 00-.567-.152.416.416 0 00-.153.567l1.998 3.46C3.39 11.16 1.198 14.42 1 18.18h22c-.198-3.76-2.39-7.02-5.623-8.86" />
    </svg>
  )
}
