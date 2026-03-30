'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export type PortalLang = 'en' | 'ar'

const translations = {
  en: {
    nav: {
      dashboard:          'Dashboard',
      kyc:                'KYC Verification',
      documents:          'Documents',
      accountApplication: 'Account Application',
      deposit:            'Deposit USDT',
      withdrawal:         'Withdraw USDT',
      support:            'Support',
      settings:           'Settings',
      signOut:            'Sign out',
      clientPortal:       'Client Portal',
    },
    dir: 'ltr' as const,
  },
  ar: {
    nav: {
      dashboard:          'لوحة التحكم',
      kyc:                'التحقق من الهوية',
      documents:          'المستندات',
      accountApplication: 'طلب الحساب',
      deposit:            'إيداع USDT',
      withdrawal:         'سحب USDT',
      support:            'الدعم',
      settings:           'الإعدادات',
      signOut:            'تسجيل الخروج',
      clientPortal:       'بوابة العميل',
    },
    dir: 'rtl' as const,
  },
}

interface PortalI18nContextValue {
  lang:   PortalLang
  t:      typeof translations['en']
  toggle: () => void
}

const PortalI18nContext = createContext<PortalI18nContextValue>({
  lang:   'en',
  t:      translations.en,
  toggle: () => {},
})

export function PortalI18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<PortalLang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('portal-lang') as PortalLang | null
    if (saved === 'en' || saved === 'ar') setLang(saved)
  }, [])

  useEffect(() => {
    document.documentElement.dir = translations[lang].dir
    document.documentElement.lang = lang
  }, [lang])

  function toggle() {
    const next = lang === 'en' ? 'ar' : 'en'
    setLang(next)
    localStorage.setItem('portal-lang', next)
  }

  return (
    <PortalI18nContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </PortalI18nContext.Provider>
  )
}

export function usePortalI18n() {
  return useContext(PortalI18nContext)
}