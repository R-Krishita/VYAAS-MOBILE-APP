'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import i18n from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'

// Import translation files
import en from '../src/locales/en.json'
import hi from '../src/locales/hi.json'
import mr from '../src/locales/mr.json'
import ta from '../src/locales/ta.json'

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  ta: { translation: ta },
}

// Initialize i18n only on client side
if (typeof window !== 'undefined' && !i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en', // default language set to English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // Important for Next.js
    },
  })
}

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsInitialized(true)
    }
  }, [])

  if (!isInitialized) {
    return <>{children}</>
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

export default i18n