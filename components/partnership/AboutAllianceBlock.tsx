import Link from "next/link";

type Props = {
  promarketsUrl?: string;
  lang?: string;
};

export default function AboutAllianceBlock({
  promarketsUrl = "https://www.promarketsltd.com/",
  lang = "en",
}: Props) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(245,158,11,0.06),transparent_32%)]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-8 rounded-[32px] border border-white/10 bg-neutral-950 p-8 shadow-2xl shadow-black/30 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400/80">
                Strategic Alliance
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Built with strategic infrastructure alignment.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/70">
                Keystone FX collaborates with ProMarkets Ltd as part of a
                broader infrastructure framework designed to support stable
                execution environments, operational continuity, and scalable
                service delivery.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={promarketsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-3 text-sm font-medium text-amber-300 transition hover:bg-amber-400/15"
              >
                Visit ProMarkets Ltd
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/5"
              >
                Contact Keystone FX
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <div className="text-xs uppercase tracking-[0.28em] text-white/45">
                  Keystone FX
                </div>
                <div className="mt-3 text-lg font-semibold text-white">
                  Execution & Technology Layer
                </div>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  Client-facing operational framework, execution presentation,
                  and infrastructure-led service environment.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-5">
                <div className="text-xs uppercase tracking-[0.28em] text-amber-300/70">
                  ProMarkets Ltd
                </div>
                <div className="mt-3 text-lg font-semibold text-white">
                  Strategic Infrastructure Support
                </div>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  Aligned support layer contributing to a more robust and
                  scalable execution environment.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <div className="text-sm font-semibold text-white">
                Operational Continuity
              </div>
              <p className="mt-3 text-sm leading-7 text-white/65">
                This infrastructure alignment reflects a commitment to service
                stability, execution depth, and long-term operational resilience
                — ensuring clients operate within a well-supported environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}