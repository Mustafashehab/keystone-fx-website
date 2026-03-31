import type { Metadata } from "next";
import Script from "next/script";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Keystone FX | Institutional Trading Infrastructure & Execution Technology",
  description:
    "Keystone FX provides institutional-grade trading infrastructure and execution technology for professional market participants. Non-broker, non-custodial, technology-only services.",
};

export default async function LangLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
      <WhatsAppButton />

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-35NDK9JRY6"
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-35NDK9JRY6');
        `}
      </Script>
    </>
  );
}