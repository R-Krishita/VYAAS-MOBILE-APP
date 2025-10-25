"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { HomeTab } from "@/components/tabs/home-tab"
import { DataCollectionTab } from "@/components/tabs/data-collection-tab"
import { CropRecommendationTab } from "@/components/tabs/crop-recommendation-tab"
import { MarketInsightsTab } from "@/components/tabs/market-insights-tab"
import { ProfileTab } from "@/components/tabs/profile-tab"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, X } from "lucide-react"

export type TabType = "home" | "data-collection" | "crop-recommendation" | "market-insights" | "profile"

interface HomePageProps {
  onAuthClick?: () => void
}

export function HomePage({ onAuthClick }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const { isAuthenticated } = useAuth()
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [showDemoBanner, setShowDemoBanner] = useState(false)

  useEffect(() => {
    // Check if in demo mode
    const savedData = localStorage.getItem("farmData")
    if (savedData) {
      const data = JSON.parse(savedData)
      if (data.isDemoMode) {
        setIsDemoMode(true)
        setShowDemoBanner(true)
      }
    }

    const handleSwitchTab = (event: CustomEvent) => {
      setActiveTab(event.detail as TabType)
    }

    window.addEventListener("switchTab", handleSwitchTab as EventListener)
    return () => {
      window.removeEventListener("switchTab", handleSwitchTab as EventListener)
    }
  }, [])

  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab onAuthClick={onAuthClick} />
      case "data-collection":
        return <DataCollectionTab onAuthClick={onAuthClick} />
      case "crop-recommendation":
        return <CropRecommendationTab onAuthClick={onAuthClick} />
      case "market-insights":
        return <MarketInsightsTab onAuthClick={onAuthClick} />
      case "profile":
        return <ProfileTab />
      default:
        return <HomeTab onAuthClick={onAuthClick} />
    }
  }

  return (
    <div className="flex flex-col h-full relative">
      <Navbar onAuthClick={onAuthClick} />
      
      {/* Demo Mode Banner */}
      {isDemoMode && showDemoBanner && (
        <Alert className="mx-4 mt-2 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">
              <strong>Demo Mode:</strong> Exploring with sample data
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDemoBanner(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex-1 overflow-y-auto pb-20">{renderActiveTab()}</div>

      {isAuthenticated && <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />}

      {!isAuthenticated && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            onClick={onAuthClick}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full shadow-lg"
            size="lg"
          >
            Sign Up / Login
          </Button>
        </div>
      )}
    </div>
  )
}
