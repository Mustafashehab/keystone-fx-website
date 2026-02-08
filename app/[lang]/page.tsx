import InteractiveHero from "@/components/InteractiveHero";
import ExecutionMetrics from "@/components/ExecutionMetrics";
import ExecutionAISection from "@/components/ExecutionAISection";
import InvestorSection from "@/components/InvestorSection";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params; // keep signature consistent, lang not needed here

  return (
    <>
      <InteractiveHero
        title="Institutional Trading Infrastructure & Execution Technology"
        subtitle="Keystone FX provides institutional-grade trading infrastructure and execution technology for professional market participants. Our systems are designed to support low-latency execution, robust connectivity, and transparent architecture across professional trading environments."
      />

      {/* EXECUTION METRICS */}
      <ExecutionMetrics />

      {/* EXECUTION FLOW */}
      <ExecutionAISection />

      {/* INVESTOR SECTION */}
      <InvestorSection />
    </>
  );
}
