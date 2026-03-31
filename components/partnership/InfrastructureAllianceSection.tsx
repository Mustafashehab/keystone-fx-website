import Link from "next/link";

type Props = {
  promarketsUrl?: string;
  lang?: string;
};

const pillars = [
  {
    title: "Execution Layer",
    text: "Keystone FX provides the interface and operational framework through which clients access institutional-grade trading infrastructure.",
  },
  {
    title: "Strategic Support",
    text: "ProMarkets Ltd strengthens the ecosystem through aligned infrastructure support and operational collaboration.",
  },
  {
    title: "Scalable Environment",
    text: "The structure is designed to support stable routing, resilient workflows, and future expansion across execution services.",
  },
];

export default function InfrastructureAllianceSection({
  promarketsUrl = "https://www.promarketsltd.com/",
  lang = "en",
}: Props) {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_35%)]" />
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400/80">
              Institutional Execution Infrastructure
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              A layered execution environment built for confidence, continuity, and scale.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
              Keystone FX is positioned as the technology and execution layer,
              supported by strategic infrastructure relationships including
              ProMarkets Ltd. The result is a more resilient framework for
              execution, routing, and operational stability.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/${lang}/about`}
                className="rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-3 text-sm font-medium text-amber-300 transition hover:bg-amber-400/15"
              >
                Explore Our Structure
              </Link>
              <Link
                href={promarketsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/5"
              >
                View ProMarkets Ltd
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    Infrastructure Map
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    Collaboration Framework
                  </h3>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Active Structure
                </div>
              </div>

              <div className="relative rounded-3xl border border-amber-500/10 bg-black/40 p-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-4">
                      <div className="text-xs uppercase tracking-[0.25em] text-amber-300/75">
                        Keystone FX
                      </div>
                      <div className="mt-2 text-lg font-semibold text-white">
                        Technology & Execution Layer
                      </div>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-amber-400/40 to-white/10" />
                  </div>

                  <div className="ml-auto flex items-center justify-between gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-amber-400/40" />
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                      <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                        ProMarkets Ltd
                      </div>
                      <div className="mt-2 text-lg font-semibold text-white">
                        Strategic Infrastructure Support
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 pt-4">
                    {pillars.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                      >
                        <div className="text-sm font-semibold text-white">
                          {item.title}
                        </div>
                        <p className="mt-2 text-sm leading-7 text-white/65">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-5 text-xs leading-6 text-white/45">
                Infrastructure presented for informational purposes. Structure
                reflects operational alignment and service continuity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}