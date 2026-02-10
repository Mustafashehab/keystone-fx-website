import ExecutionMetrics from "@/components/ExecutionMetrics";
import ExecutionAISection from "@/components/ExecutionAISection";
import InvestorSection from "@/components/InvestorSection";
import Link from "next/link";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      {/* HERO SECTION — IMAGE BASED (FAST & SEO FRIENDLY) */}
      <section
        className="relative min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero/hero-ether.webp')",
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55" />

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center text-white">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Institutional Trading Infrastructure &<br />
            Execution Technology
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            Keystone FX provides institutional-grade trading infrastructure and execution
            technology for professional market participants. Our systems are designed
            to support low-latency execution, robust connectivity, and transparent
            architecture across professional trading environments.
          </p>

          <div className="mt-8 flex justify-center flex-wrap gap-3">
            <Link
              href={`/${lang}/execution`}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              Explore Execution
            </Link>

            <Link
              href={`/${lang}/platforms`}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              Platforms
            </Link>

            <Link
              href={`/${lang}/accounts`}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              Accounts
            </Link>
          </div>
        </div>
      </section>

      {/* EXECUTION METRICS */}
      <ExecutionMetrics />

      {/* EXECUTION FLOW */}
      <ExecutionAISection />

      {/* INVESTOR SECTION */}
      <InvestorSection />
    </>
  );
}
