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

export type TabType = "home" | "data-collection" | "crop-recommendation" | "market-insights" | "profile"

interface HomePageProps {
  onAuthClick?: () => void
}

export function HomePage({ onAuthClick }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const { isAuthenticated } = useAuth()

  useEffect(() => {
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
