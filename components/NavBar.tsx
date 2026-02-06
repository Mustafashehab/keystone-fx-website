"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { Lang, t } from "@/lib/i18n";

export default function NavBar() {
  const params = useParams();
  const pathname = usePathname();
  const lang = (params?.lang as Lang) || "en";

  const swapLang = (l: Lang) => {
    if (!pathname) return `/${l}`;
    const parts = pathname.split("/");
    parts[1] = l;
    return parts.join("/");
  };

  const navItems = [
    { key: "products", path: "products" },
    { key: "platforms", path: "platforms" },
    { key: "accounts", path: "accounts" },
    { key: "blog", path: "blog" },
    { key: "about", path: "about" },
    { key: "contact", path: "contact" },
  ];

  return (
    <header className="border-b bg-white">
      {/* FIXED NAVBAR HEIGHT */}
      <div className="mx-auto flex h-[150px] max-w-6xl items-center justify-between px-10">
        
        {/* LOGO BLOCK (INDEPENDENT SIZE) */}
        <Link href={`/${lang}`} className="flex items-center gap-4">
          <div className="relative h-[150px] w-[150px] md:h-[150px] md:w-[150px] shrink-0">

            <Image
              src="/logo.png"
              alt="Keystone FX"
              fill
              priority
              className="object-contain"
            />
          </div>

          <div className="leading-tight">
            <div className="text-lg font-semibold tracking-wide">
              KEYSTONE <span className="text-yellow-600">FX</span>
            </div>
            <div className="text-[11px] tracking-widest text-gray-500">
              FOREX BROKERAGE
            </div>
          </div>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${lang}/${item.path}`}
              className="hover:text-yellow-600"
            >
              {t(lang, `nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        {/* LANGUAGE SWITCH */}
        <div className="text-sm whitespace-nowrap">
          <Link href={swapLang("en")}>EN</Link> |{" "}
          <Link href={swapLang("ar")}>AR</Link> |{" "}
          <Link href={swapLang("zh")}>中文</Link>
        </div>
      </div>
    </header>
  );
}
