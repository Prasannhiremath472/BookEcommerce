import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type TranslationKey } from '@/i18n/translations'

export type Language = 'en' | 'mr'

interface LanguageContextValue {
  lang: Language
  setLang: (l: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'cosmosedge-lang'

function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'mr' ? 'mr' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang)

  const setLang = (l: Language) => {
    setLangState(l)
    window.localStorage.setItem(STORAGE_KEY, l)
  }

  const t = (key: TranslationKey): string => {
    return translations[key]?.[lang] ?? translations[key]?.en ?? key
  }

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
