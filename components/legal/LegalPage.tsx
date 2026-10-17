import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_DOCS,
  LEGAL_PATHS,
  LEGAL_UI,
  LEGAL_UPDATED,
  type LegalDocKey,
} from "@/lib/legal-content";

const LANGS: Lang[] = ["en", "ar", "zh"];
const BASE_URL = "https://www.keystone-fx.com";

export function isLang(value: string): value is Lang {
  return (LANGS as string[]).includes(value);
}

export function legalStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export function legalMetadata(doc: LegalDocKey, lang: string): Metadata {
  const safeLang: Lang = isLang(lang) ? lang : "en";
  const content = LEGAL_DOCS[doc][safeLang];
  const path = LEGAL_PATHS[doc];
  return {
    title: `${content.title} | Keystone FX`,
    description: content.summary,
    alternates: {
      canonical: `${BASE_URL}/${safeLang}/${path}`,
      languages: Object.fromEntries(LANGS.map((l) => [l, `${BASE_URL}/${l}/${path}`])),
    },
  };
}

function slugify(index: number) {
  return `section-${index + 1}`;
}

export default function LegalPage({ doc, lang }: { doc: LegalDocKey; lang: string }) {
  if (!isLang(lang)) notFound();

  const content = LEGAL_DOCS[doc][lang];
  const ui = LEGAL_UI[lang];
  const rtl = lang === "ar";
  const others = (Object.keys(LEGAL_PATHS) as LegalDocKey[]).filter((k) => k !== doc);

  return (
    <div dir={rtl ? "rtl" : "ltr"} lang={lang} className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{ui.legalNav}</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">{content.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">{content.summary}</p>
          <p className="mt-6 text-sm text-slate-500">
            {ui.updated}: <time dateTime={LEGAL_UPDATED}>{ui.updatedDate}</time>
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <nav aria-label={ui.contents} className="sticky top-28">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{ui.contents}</p>
            <ol className="mt-4 space-y-2 text-sm">
              {content.sections.map((s, i) => (
                <li key={s.heading}>
                  <a href={`#${slugify(i)}`} className="text-slate-600 hover:text-slate-900">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl">
          {content.callout && (
            <div
              role="note"
              className="mb-10 rounded-xl border border-amber-300 bg-amber-50 p-5 text-base font-medium leading-relaxed text-amber-900"
            >
              {content.callout}
            </div>
          )}

          <div className="space-y-10">
            {content.sections.map((s, i) => (
              <section key={s.heading} id={slugify(i)} className="scroll-mt-28">
                <h2 className="text-xl font-semibold text-slate-900">{s.heading}</h2>
                {s.paragraphs?.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed text-slate-700">
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="mt-3 list-disc space-y-2 ps-6 leading-relaxed text-slate-700">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-14 border-t pt-8 text-sm text-slate-600">
            <p>
              {ui.contact}{" "}
              <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="font-medium text-slate-900 underline">
                {LEGAL_CONTACT_EMAIL}
              </a>
            </p>
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {others.map((k) => (
                <Link key={k} href={`/${lang}/${LEGAL_PATHS[k]}`} className="font-medium text-slate-900 hover:underline">
                  {ui.links[k]}
                </Link>
              ))}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
