import LegalPage, { legalMetadata, legalStaticParams } from "@/components/legal/LegalPage";

export const generateStaticParams = legalStaticParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return legalMetadata("risk", lang);
}

export default async function RiskWarningPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LegalPage doc="risk" lang={lang} />;
}
