"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { Lang, t } from "@/lib/i18n";
import { useState } from "react";

export default function NavBar() {
  const params = useParams();
  const pathname = usePathname();
  const lang = (params?.lang as Lang) || "en";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const swapLang = (l: Lang) => {
    if (!pathname) return `/${l}`;
    const parts = pathname.split("/");
    parts[1] = l;
    return parts.join("/");
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "447511648370";
    const message = "Hello! I'm interested in learning more about Keystone FX.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
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
      <div className="mx-auto flex h-[100px] md:h-[150px] max-w-6xl items-center justify-between px-4 md:px-10">
        
        <Link href={`/${lang}`} className="flex items-center gap-2 md:gap-4">
          <div className="relative h-[60px] w-[60px] md:h-[120px] md:w-[120px] shrink-0">
            <Image
              src="/logo.png"
              alt="Keystone FX"
              fill
              priority
              className="object-contain"
            />
          </div>

          <div className="leading-tight">
            <div className="text-sm md:text-lg font-semibold tracking-wide">
              KEYSTONE <span className="text-yellow-600">FX</span>
            </div>
            <div className="text-[9px] md:text-[11px] tracking-widest text-gray-500">
              FOREX BROKERAGE
            </div>
          </div>
        </Link>

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

        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={handleWhatsAppClick}
            className="text-sm font-medium text-slate-700 hover:text-yellow-600 transition-colors"
          >
            {t(lang, "nav.signin")}
          </button>

          <div className="text-sm whitespace-nowrap text-slate-600">
            <Link href={swapLang("en")} className="hover:text-yellow-600">EN</Link>
            {" | "}
            <Link href={swapLang("ar")} className="hover:text-yellow-600">AR</Link>
            {" | "}
            <Link href={swapLang("zh")} className="hover:text-yellow-600">中文</Link>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 z-50"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-slate-700 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-slate-700 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-slate-700 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={`/${lang}/${item.path}`}
                className="text-sm hover:text-yellow-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(lang, `nav.${item.key}`)}
              </Link>
            ))}
            
            <button 
              onClick={() => {
                handleWhatsAppClick();
                setMobileMenuOpen(false);
              }}
              className="text-sm font-medium text-slate-700 hover:text-yellow-600 transition-colors py-2 text-left"
            >
              {t(lang, "nav.signin")}
            </button>

            <div className="text-sm text-slate-600 py-2 border-t">
              <Link href={swapLang("en")} className="hover:text-yellow-600" onClick={() => setMobileMenuOpen(false)}>EN</Link>
              {" | "}
              <Link href={swapLang("ar")} className="hover:text-yellow-600" onClick={() => setMobileMenuOpen(false)}>AR</Link>
              {" | "}
              <Link href={swapLang("zh")} className="hover:text-yellow-600" onClick={() => setMobileMenuOpen(false)}>中文</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}