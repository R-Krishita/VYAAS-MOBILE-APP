"use client"

import { useState } from "react"
import { MobileContainer } from "@/components/mobile-container"
import { AuthProvider } from "@/components/auth-provider"
import { LandingPage } from "@/components/landing-page"
import { AuthPage } from "@/components/auth-page"
import { HomePage } from "@/components/home-page"
import { OnboardingTour } from "@/components/onboarding-tour"

export default function App() {
  const [currentPage, setCurrentPage] = useState<"landing" | "auth" | "home">("landing")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setCurrentPage("home")
    setShowOnboarding(true)
  }

  const handleDemoMode = () => {
    setIsAuthenticated(true)
    setCurrentPage("home")
    setShowOnboarding(false)
  }

  const handleAuthRequest = () => {
    setCurrentPage("auth")
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setCurrentPage("landing")
    setShowOnboarding(false)
  }

  const handleAuthBack = () => {
    setCurrentPage("landing")
  }
  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
  }

  return (
    <AuthProvider isAuthenticated={isAuthenticated} onSignOut={handleSignOut}>
      <MobileContainer>
        {currentPage === "landing" && <LandingPage onAuthRequest={handleAuthRequest} onDemoMode={handleDemoMode} />}
        {currentPage === "auth" && <AuthPage onAuthSuccess={handleAuthSuccess} onBack={handleAuthBack} />}
        {currentPage === "home" && <HomePage onAuthClick={handleAuthRequest} />}
        {showOnboarding && <OnboardingTour onComplete={handleOnboardingComplete} />}
      </MobileContainer>
    </AuthProvider>
  )
}
