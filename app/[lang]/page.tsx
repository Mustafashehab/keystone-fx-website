import ExecutionMetrics from "@/components/ExecutionMetrics";
import ExecutionAISection from "@/components/ExecutionAISection";
import InvestorSection from "@/components/InvestorSection";
import HeroVideoController from "../../components/HeroVideoController";
import Link from "next/link";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      {/* HERO SECTION — DUAL VIDEO CROSSFADE (FREEZE-SAFE) */}
      <section className="relative min-h-screen overflow-hidden bg-black">
        {/* Video playback controller (MOUNTED HERE) */}
        <HeroVideoController />

        {/* Video A */}
        <video
          id="hero-video-a"
          className="absolute inset-0 h-full w-full object-cover hero-video hero-video-a hero-video-enhance"
          src="/hero/hero-ether.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
        />

        {/* Video B */}
        <video
          id="hero-video-b"
          className="absolute inset-0 h-full w-full object-cover hero-video hero-video-b hero-video-enhance"
          src="/hero/hero-ether.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
        />

        {/* Softer, cinematic overlay (less wash-out) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55 z-10" />

        {/* Hero content — MATCHES MAIN */}
        <div className="relative z-20 mx-auto max-w-4xl px-6 py-32 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
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
