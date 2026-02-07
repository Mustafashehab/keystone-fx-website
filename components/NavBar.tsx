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
    { key: "about", path: "about" },
    { key: "contact", path: "contact" },
  ];

  return (
    <header className="border-b bg-white">
      {/* FIXED NAVBAR HEIGHT */}
      <div className="mx-auto flex h-[150px] max-w-6xl items-center justify-between px-10">
        
        {/* LOGO BLOCK */}
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

        {/* NAV LINKS - Moved closer with flex-1 and justify-center */}
        <nav className="hidden md:flex gap-6 text-sm flex-1 justify-center ml-[-100px]">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${lang}/${item.path}`}
              className="hover:text-yellow-600 transition-colors"
            >
              {t(lang, `nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        {/* SIGN IN & LANGUAGE SWITCH */}
        <div className="flex items-center gap-6">
          {/* Sign In Button */}
          <Link 
            href={`/${lang}/signin`}
            className="text-sm font-medium text-slate-700 hover:text-yellow-600 transition-colors"
          >
            {t(lang, "nav.signin")}
          </Link>

          {/* Language Switch */}
          <div className="text-sm whitespace-nowrap text-slate-600">
            <Link href={swapLang("en")} className="hover:text-yellow-600">EN</Link>
            {" | "}
            <Link href={swapLang("ar")} className="hover:text-yellow-600">AR</Link>
            {" | "}
            <Link href={swapLang("zh")} className="hover:text-yellow-600">中文</Link>
          </div>
        </div>
      </div>
    </header>
  );
}