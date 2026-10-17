import LegalPage, { legalMetadata, legalStaticParams } from "@/components/legal/LegalPage";

export const generateStaticParams = legalStaticParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return legalMetadata("terms", lang);
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LegalPage doc="terms" lang={lang} />;
}
