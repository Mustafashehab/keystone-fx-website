import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Software Solutions & Technical Support",
  description:
    "Keystone FX Ltd. provides software solutions, platform connectivity assistance, and technical support for professional business environments.",
  robots: { index: true, follow: true },
};

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-35NDK9JRY6" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-35NDK9JRY6');`}
      </Script>
    </>
  );
}
