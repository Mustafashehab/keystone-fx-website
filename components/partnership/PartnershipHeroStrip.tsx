import Link from "next/link";

type Props = {
  promarketsUrl?: string;
};

export default function PartnershipHeroStrip({
  promarketsUrl = "https://www.promarketsltd.com/",
}: Props) {
  return (
    <section className="relative overflow-hidden border-y border-amber-500/15 bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.10),transparent_45%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400/80">
              Strategic Collaboration
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Trusted Infrastructure. Institutional Backing.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              Keystone FX operates as an execution and technology layer,
              supported by strategic infrastructure partnerships, including
              ProMarkets Ltd. This collaboration enables efficient routing,
              stable execution environments, and scalable trading infrastructure.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-amber-500/20 bg-black px-4 py-3">
                <span className="block text-xs uppercase tracking-[0.3em] text-white/45">
                  Execution Layer
                </span>
                <span className="mt-1 block text-lg font-semibold text-white">
                  Keystone FX
                </span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/25 bg-amber-400/10 text-amber-300">
                ×
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-black px-4 py-3">
                <span className="block text-xs uppercase tracking-[0.3em] text-white/45">
                  Strategic Partner
                </span>
                <span className="mt-1 block text-lg font-semibold text-white">
                  ProMarkets Ltd
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-white/55">
          <span className="rounded-full border border-white/10 px-3 py-1.5">
            Execution Support
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1.5">
            Operational Infrastructure
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1.5">
            Scalable Routing Environment
          </span>
          <Link
            href={promarketsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-amber-300 transition hover:bg-amber-400/15"
          >
            Visit ProMarkets Ltd
          </Link>
        </div>
      </div>
    </section>
  );
}