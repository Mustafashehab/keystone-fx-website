import { Lang, t } from "@/lib/i18n";

export default async function About({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            {t(lang, "about.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
            {t(lang, "about.subtitle")}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {t(lang, "about.mission.title")}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              {t(lang, "about.mission.text1")}
            </p>
            <p className="text-slate-600 leading-relaxed">
              {t(lang, "about.mission.text2")}
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-12 text-white">
            <div className="space-y-6">
              {(t(lang, "about.values") as string[]).map((value, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(t(lang, "about.stats") as any[]).map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-300 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          {t(lang, "about.whyUs.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(t(lang, "about.whyUs.reasons") as any[]).map((reason, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{reason.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {reason.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Regulation Section */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            {t(lang, "about.regulation.title")}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            {t(lang, "about.regulation.text")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {(t(lang, "about.regulation.badges") as string[]).map((badge, idx) => (
              <div key={idx} className="rounded-lg border-2 border-yellow-400 bg-white px-6 py-3 font-semibold text-slate-900">
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">
            {t(lang, "about.cta.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-slate-300 mb-8">
            {t(lang, "about.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="rounded-lg bg-yellow-400 px-8 py-3 font-semibold text-slate-900 transition hover:bg-yellow-300">
              {t(lang, "about.cta.contact")}
            </button>
            <button className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white/10">
              {t(lang, "about.cta.learn")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}