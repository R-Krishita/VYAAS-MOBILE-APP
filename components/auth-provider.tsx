"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import i18n from "./i18n-provider"

interface AuthContextType {
  isAuthenticated: boolean
  language: string
  signOut: () => void
  setLanguage: (lang: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
  isAuthenticated: boolean
  onSignOut: () => void
}

export function AuthProvider({ children, isAuthenticated, onSignOut }: AuthProviderProps) {
  const [language, setLanguageState] = useState("en")

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    // Update i18n language when language changes
    if (typeof window !== 'undefined' && i18n.isInitialized) {
      i18n.changeLanguage(lang)
    }
  }

  useEffect(() => {
    // Initialize i18n language on mount
    if (typeof window !== 'undefined' && i18n.isInitialized) {
      i18n.changeLanguage(language)
    }
  }, [])

  const signOut = () => {
    onSignOut()
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, language, signOut, setLanguage }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
