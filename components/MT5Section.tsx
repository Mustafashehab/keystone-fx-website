import Link from "next/link"

const MT5_LINKS = {
  windows: "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/mt5setup.exe",
  mac: "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg",
  ios: "https://apps.apple.com/app/metatrader-5/id413251709",
  android: "https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5",
  web: "https://trade.mql5.com/trade",
}

export function MT5Section({ lang }: { lang: string }) {
  return (
    <section className="relative bg-slate-950 py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-400 rounded-full filter blur-[200px] opacity-[0.07]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="inline-block mb-4 rounded-full bg-yellow-400/10 border border-yellow-400/20 px-5 py-1.5 text-xs font-semibold text-yellow-400 uppercase tracking-widest">
          MetaTrader 5
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
          Trade with MetaTrader 5
        </h2>
        <p className="text-slate-400 text-base mb-12 max-w-xl mx-auto">
          Download the platform or trade directly from your browser
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <a
            href={MT5_LINKS.windows}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-slate-900 hover:bg-yellow-300 transition-all hover:shadow-lg hover:shadow-yellow-400/25"
          >
            <WindowsIcon />
            Windows
          </a>
          <a
            href={MT5_LINKS.mac}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
          >
            <AppleIcon />
            Mac
          </a>
          <a
            href={MT5_LINKS.web}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-2.5 text-sm font-semibold text-blue-400 hover:bg-blue-500/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Web Terminal
          </a>
          <a
            href={MT5_LINKS.ios}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
          >
            <AppleIcon />
            App Store
          </a>
          <a
            href={MT5_LINKS.android}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
          >
            <AndroidIcon />
            Google Play
          </a>
        </div>

        <Link
          href={`/${lang}/platforms`}
          className="text-sm text-slate-500 hover:text-yellow-400 transition-colors"
        >
          Learn more about our platforms →
        </Link>
      </div>
    </section>
  )
}

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
