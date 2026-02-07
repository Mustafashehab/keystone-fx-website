import { Lang, t } from "@/lib/i18n";

export default async function Accounts({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;

  const accountTypes = [
    {
      name: t(lang, "accounts.types.standard.name"),
      features: t(lang, "accounts.types.standard.features") as string[],
      minDeposit: "$100",
      leverage: "1:500",
    },
    {
      name: t(lang, "accounts.types.pro.name"),
      features: t(lang, "accounts.types.pro.features") as string[],
      minDeposit: "$1,000",
      leverage: "1:1000",
    },
    {
      name: t(lang, "accounts.types.vip.name"),
      features: t(lang, "accounts.types.vip.features") as string[],
      minDeposit: "$10,000",
      leverage: "1:2000",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section - More Dynamic */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>

        <div className="relative mx-auto max-w-6xl px-6 py-32 text-center text-white">
          <div className="inline-block mb-6 rounded-full bg-yellow-400 px-6 py-2 text-sm font-semibold text-slate-900 shadow-lg animate-bounce">
            ⚡ {t(lang, "accounts.hero.badge")}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
            {t(lang, "accounts.title")}
          </h1>
          
          <p className="mx-auto max-w-3xl text-xl text-slate-300 leading-relaxed mb-12">
            {t(lang, "accounts.subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group relative overflow-hidden rounded-xl bg-yellow-400 px-10 py-4 text-lg font-bold text-slate-900 transition-all hover:bg-yellow-300 hover:shadow-2xl hover:shadow-yellow-400/50 hover:scale-105">
              <span className="relative z-10">{t(lang, "accounts.startTrading")}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button className="group rounded-xl border-2 border-yellow-400 px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-yellow-400 hover:text-slate-900 hover:shadow-2xl hover:shadow-yellow-400/30 hover:scale-105">
              {t(lang, "accounts.openAccount")}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">50K+</div>
              <div className="text-sm text-slate-400">{t(lang, "accounts.hero.traders")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">$2B+</div>
              <div className="text-sm text-slate-400">{t(lang, "accounts.hero.volume")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">8ms</div>
              <div className="text-sm text-slate-400">{t(lang, "accounts.hero.execution")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/6</div>
              <div className="text-sm text-slate-400">{t(lang, "accounts.hero.support")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trade With Us - Icon Cards */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {t(lang, "accounts.features.title")}
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t(lang, "accounts.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative rounded-2xl border-2 border-slate-200 bg-white p-8 transition-all hover:border-yellow-400 hover:shadow-2xl hover:-translate-y-2">
            <div className="mb-6 inline-block rounded-full bg-yellow-400 p-4 text-4xl shadow-lg group-hover:scale-110 transition-transform">
              🚀
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {t(lang, "accounts.features.global.title")}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {t(lang, "accounts.features.global.description")}
            </p>
          </div>

          <div className="group relative rounded-2xl border-2 border-slate-200 bg-white p-8 transition-all hover:border-yellow-400 hover:shadow-2xl hover:-translate-y-2">
            <div className="mb-6 inline-block rounded-full bg-yellow-400 p-4 text-4xl shadow-lg group-hover:scale-110 transition-transform">
              🔒
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {t(lang, "accounts.features.secure.title")}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {t(lang, "accounts.features.secure.description")}
            </p>
          </div>

          <div className="group relative rounded-2xl border-2 border-slate-200 bg-white p-8 transition-all hover:border-yellow-400 hover:shadow-2xl hover:-translate-y-2">
            <div className="mb-6 inline-block rounded-full bg-yellow-400 p-4 text-4xl shadow-lg group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {t(lang, "accounts.features.fast.title")}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {t(lang, "accounts.features.fast.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section - More Visual */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, #fbbf24 25%, transparent 25%, transparent 75%, #fbbf24 75%, #fbbf24), linear-gradient(45deg, #fbbf24 25%, transparent 25%, transparent 75%, #fbbf24 75%, #fbbf24)`,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px'
          }}></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t(lang, "accounts.steps.title")}
            </h2>
            <p className="text-xl text-slate-300">
              {t(lang, "accounts.steps.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {(t(lang, "accounts.steps.list") as any[]).map((step, idx) => (
              <div key={idx} className="relative">
                {/* Connector Line */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-gradient-to-r from-yellow-400 to-transparent"></div>
                )}
                
                <div className="relative text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-3xl font-bold text-slate-900 shadow-2xl shadow-yellow-400/50 animate-pulse" style={{animationDelay: `${idx * 0.2}s`}}>
                    {idx + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Bonus Section - More Dramatic */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-16 text-center shadow-2xl">
          {/* Animated Sparkles */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 h-4 w-4 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-20 right-20 h-3 w-3 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-20 left-20 h-5 w-5 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="relative">
            <div className="inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white mb-6 shadow-xl animate-bounce">
              🎁 {t(lang, "accounts.bonus.badge")}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {t(lang, "accounts.bonus.title")}
            </h2>
            
            <p className="text-xl text-slate-800 mb-8 max-w-2xl mx-auto">
              {t(lang, "accounts.bonus.terms")}
            </p>
            
            <button className="group relative overflow-hidden rounded-xl bg-slate-900 px-12 py-5 text-lg font-bold text-white transition-all hover:bg-slate-800 hover:shadow-2xl hover:scale-105">
              <span className="relative z-10">{t(lang, "accounts.openAccount")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Compare Accounts Section - Enhanced */}
      <section className="bg-slate-900 text-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
              {t(lang, "accounts.compare.title")}
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              {t(lang, "accounts.compare.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accountTypes.map((account, idx) => (
              <div 
                key={idx} 
                className={`group relative rounded-3xl p-8 transition-all hover:-translate-y-2 ${
                  idx === 1 
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 transform md:scale-105 shadow-2xl shadow-yellow-400/50 ring-4 ring-yellow-300' 
                    : 'bg-slate-800 border-2 border-slate-700 hover:border-yellow-400'
                }`}
              >
                {idx === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-6 py-2 text-sm font-bold text-white shadow-xl">
                    ⭐ {t(lang, "accounts.compare.popular")}
                  </div>
                )}

                <h3 className={`text-3xl font-bold mb-8 ${idx === 1 ? 'text-slate-900' : 'text-white'}`}>
                  {account.name}
                </h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-baseline gap-2">
                    <div className={`text-sm font-semibold ${idx === 1 ? 'text-slate-700' : 'text-slate-400'}`}>
                      {t(lang, "accounts.compare.minDeposit")}
                    </div>
                  </div>
                  <div className="text-5xl font-bold">{account.minDeposit}</div>
                  
                  <div className="pt-4 border-t ${idx === 1 ? 'border-slate-800' : 'border-slate-700'}">
                    <div className={`text-sm font-semibold mb-2 ${idx === 1 ? 'text-slate-700' : 'text-slate-400'}`}>
                      {t(lang, "accounts.compare.leverage")}
                    </div>
                    <div className="text-2xl font-bold">{account.leverage}</div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {account.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <span className={`text-xl ${idx === 1 ? 'text-slate-900' : 'text-yellow-400'}`}>✓</span>
                      <span className={`${idx === 1 ? 'text-slate-800' : 'text-slate-300'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button 
                  className={`w-full rounded-xl px-6 py-4 text-lg font-bold transition-all ${
                    idx === 1 
                      ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl hover:shadow-2xl' 
                      : 'bg-yellow-400 text-slate-900 hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-400/50'
                  }`}
                >
                  {t(lang, "accounts.compare.select")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-16 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">
            {t(lang, "accounts.finalCta.title")}
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {t(lang, "accounts.finalCta.subtitle")}
          </p>
          <button className="rounded-xl bg-yellow-400 px-12 py-5 text-lg font-bold text-slate-900 transition-all hover:bg-yellow-300 hover:shadow-2xl hover:shadow-yellow-400/50 hover:scale-105">
            {t(lang, "accounts.startTrading")}
          </button>
        </div>
      </section>
    </div>
  );
}