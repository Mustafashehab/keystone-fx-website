import ExecutionAISection from "@/components/ExecutionAISection";
import InvestorSection from "@/components/InvestorSection";
import PartnershipHeroStrip from "@/components/partnership/PartnershipHeroStrip";
import InfrastructureAllianceSection from "@/components/partnership/InfrastructureAllianceSection";
import { MT5Section } from "@/components/MT5Section";
import HeroSection from "@/components/HeroSection";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      {/* HERO SECTION */}
      <HeroSection lang={lang} />

      {/* PARTNERSHIP STRIP — directly under hero */}
      <PartnershipHeroStrip />

      {/* EXECUTION FLOW */}
      <ExecutionAISection />

      {/* INVESTOR SECTION */}
      <InvestorSection />

      {/* MT5 DOWNLOAD SECTION */}
      <MT5Section lang={lang} />

      {/* INFRASTRUCTURE ALLIANCE — bottom of homepage */}
      <InfrastructureAllianceSection lang={lang} />
    </>
  );
}
