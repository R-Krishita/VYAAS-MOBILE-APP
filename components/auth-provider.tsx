"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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
  const [language, setLanguage] = useState("en")

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
