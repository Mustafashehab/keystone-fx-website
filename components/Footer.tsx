"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { LEGAL_PATHS, LEGAL_UI, type LegalDocKey } from "@/lib/legal-content";

const LEGAL_KEYS: LegalDocKey[] = ["terms", "privacy", "risk"];

function langFromPath(pathname: string | null): Lang {
  const segment = pathname?.split("/")[1];
  return segment === "ar" || segment === "zh" ? segment : "en";
}

export default function Footer() {
  const lang = langFromPath(usePathname());
  const ui = LEGAL_UI[lang];

  return (
    <footer className="border-t bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <nav
          aria-label={ui.legalNav}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
        >
          {LEGAL_KEYS.map((key) => (
            <Link
              key={key}
              href={`/${lang}/${LEGAL_PATHS[key]}`}
              className="text-slate-300 hover:text-white hover:underline"
            >
              {ui.links[key]}
            </Link>
          ))}
        </nav>
        <p className="text-center text-sm text-slate-400 leading-relaxed">
          <strong>Important Notice:</strong> Keystone FX is a technology and
          infrastructure provider. We do not operate as a broker, do not accept
          or hold client funds, and do not provide regulated investment or
          advisory services. All services are provided on a non-custodial,
          professional-use basis only.
        </p>
      </div>
    </footer>
  );
}
