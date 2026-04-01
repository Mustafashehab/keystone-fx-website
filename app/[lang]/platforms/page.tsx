import Link from "next/link"

const MT5_LINKS = {
  windows: "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/mt5setup.exe",
  mac: "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg",
  ios: "https://apps.apple.com/app/metatrader-5/id413251709",
  android: "https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5",
  web: "https://trade.mql5.com/trade",
}

export default async function PlatformsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-yellow-400 rounded-full filter blur-[120px] opacity-15" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-[100px] opacity-10" />

        <div className="relative mx-auto max-w-5xl px-6 pt-32 pb-20 text-center">
          <p className="inline-block mb-5 rounded-full bg-yellow-400/10 border border-yellow-400/20 px-5 py-1.5 text-xs font-semibold text-yellow-400 uppercase tracking-widest">
            MetaTrader 5
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-5">
            Trading Platforms
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
            Professional trading infrastructure powered by MetaTrader 5. Fast execution, advanced charting, and automated trading — available on every device.
          </p>
        </div>
      </section>

      {/* Platform Cards */}
      <section className="relative mx-auto max-w-6xl px-6 pb-32 space-y-8">

        {/* MT5 Desktop */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-8 md:p-10">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">MetaTrader 5 Desktop</h2>
              <p className="text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
                Full-featured trading terminal with advanced charting, automated trading, and real-time execution. The industry standard for professional traders.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              "Advanced multi-timeframe charting",
              "Algorithmic trading with Expert Advisors",
              "Real-time market depth & Level II data",
              "One-click trading execution",
              "Built-in economic calendar",
              "Multi-monitor support",
            ].map((f) => (
              <div key={f} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-slate-300">{f}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={MT5_LINKS.windows}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-slate-900 hover:bg-yellow-300 transition-all hover:shadow-lg hover:shadow-yellow-400/25"
            >
              <WindowsIcon />
              Download for Windows
            </a>
            <a
              href={MT5_LINKS.mac}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
            >
              <AppleIcon />
              Download for Mac
            </a>
          </div>
        </div>

        {/* MT5 Web Terminal */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-8 md:p-10">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Web Trading Platform</h2>
              <p className="text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
                Trade directly from your browser — no download required. Full MT5 functionality accessible from any device with an internet connection.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              "No installation required",
              "Works on any OS or browser",
              "Full charting & trading tools",
              "Secure encrypted connection",
              "Real-time quotes & execution",
              "Instant access from anywhere",
            ].map((f) => (
              <div key={f} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-slate-300">{f}</span>
              </div>
            ))}
          </div>
          <a
            href={MT5_LINKS.web}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white hover:bg-blue-400 transition-all hover:shadow-lg hover:shadow-blue-500/25"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Launch Web Terminal
          </a>
        </div>

        {/* MT5 Mobile */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-8 md:p-10">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Mobile Trading</h2>
              <p className="text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
                Monitor markets and execute trades from anywhere with the MT5 mobile app. Full trading capabilities in the palm of your hand.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              "Real-time price alerts",
              "Full order management",
              "Interactive charts & indicators",
              "Push notifications",
              "Biometric authentication",
              "Portfolio monitoring on the go",
            ].map((f) => (
              <div key={f} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-slate-300">{f}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={MT5_LINKS.ios}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
            >
              <AppleIcon />
              Download on App Store
            </a>
            <a
              href={MT5_LINKS.android}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
            >
              <AndroidIcon />
              Get on Google Play
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <p className="text-slate-500 text-sm mb-4">Ready to start trading?</p>
          <Link
            href={`/${lang}/accounts`}
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-8 py-3.5 text-sm font-bold text-slate-900 hover:bg-yellow-300 transition-all hover:shadow-lg hover:shadow-yellow-400/25"
          >
            Open an Account
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
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
