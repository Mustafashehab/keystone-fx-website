import "@/app/globals.css";
import { Lang, isRTL } from "@/lib/i18n";
import Image from "next/image";

export default async function LangLayout({
  params,
  children,
}: {
  params: Promise<{ lang: Lang }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} dir={isRTL(lang) ? "rtl" : "ltr"}>
      <body>
        {/* HEADER */}
        <header className="border-b border-kfx-line bg-white">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
            <Image src="/logo.png" alt="Keystone FX" width={44} height={44} />
            <div>
              <div className="font-semibold text-kfx-navy">
                KEYSTONE <span className="text-kfx-gold">FX</span>
              </div>
              <div className="text-xs text-kfx-muted">FOREX BROKERAGE</div>
            </div>
          </div>
        </header>

        {/* PAGE */}
        {children}

        {/* FOOTER */}
        <footer className="mt-20 border-t border-kfx-line bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-kfx-muted">
            © {new Date().getFullYear()} Keystone FX — All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
