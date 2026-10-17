import { MetadataRoute } from "next";

const BASE_URL = "https://keystone-fx.com";
const LANGS = ["en", "ar", "zh"] as const;

// Every public page lives under a language prefix (/en, /ar, /zh).
// Paths without a prefix are not real pages, so they are never listed here.
const PAGES: { path: string; priority: number }[] = [
  { path: "", priority: 1.0 },
  { path: "/products", priority: 0.9 },
  { path: "/platforms", priority: 0.9 },
  { path: "/accounts", priority: 0.9 },
  { path: "/execution", priority: 0.9 },
  { path: "/execution/fix-api", priority: 0.8 },
  { path: "/execution/latency", priority: 0.8 },
  { path: "/execution/slippage", priority: 0.8 },
  { path: "/liquidity", priority: 0.9 },
  { path: "/about", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/explained/is-keystone-fx-a-broker", priority: 0.7 },
  { path: "/terms", priority: 0.5 },
  { path: "/privacy", priority: 0.5 },
  { path: "/risk-warning", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.flatMap(({ path, priority }) =>
    LANGS.map((lang) => ({
      url: `${BASE_URL}/${lang}${path}`,
      lastModified,
      priority: lang === "en" ? priority : Math.round(priority * 0.9 * 10) / 10,
      alternates: {
        languages: Object.fromEntries(LANGS.map((l) => [l, `${BASE_URL}/${l}${path}`])),
      },
    }))
  );
}
