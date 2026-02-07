import { Lang, t } from "@/lib/i18n";
import InteractiveHero from "@/components/InteractiveHero";
import ExecutionMetrics from "@/components/ExecutionMetrics";
import ExecutionAISection from "@/components/ExecutionAISection";
import InvestorSection from "@/components/InvestorSection";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;

  return (
    <>
      <InteractiveHero
        title={t(lang, "hero.title") as string}
        subtitle={t(lang, "hero.subtitle") as string}
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
