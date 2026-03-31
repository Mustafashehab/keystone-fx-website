import Link from "next/link";
import InfrastructureFlow from "@/components/visuals/InfrastructureFlow";

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

          {/* Left — text content */}
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

          {/* Right — animated infrastructure visual */}
          <InfrastructureFlow />

        </div>
      </div>
    </section>
  );
}