import type { Metadata } from "next";
import { Lang } from "@/lib/i18n";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

/**
 * Global metadata for Keystone FX
 * This is CRITICAL for Google & AI classification
 */
export const metadata: Metadata = {
  title: "Keystone FX | Institutional Trading Infrastructure & Execution Technology",
  description:
    "Keystone FX provides institutional-grade trading infrastructure and execution technology for professional market participants. Non-broker, non-custodial, technology-only services.",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <NavBar />
      {children}
      <Footer lang={lang as Lang} />
      <WhatsAppButton />
    </>
  );
}
