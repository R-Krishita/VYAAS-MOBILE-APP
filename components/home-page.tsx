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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Info, X, MessageCircle, Sparkles } from "lucide-react"

export type TabType = "home" | "data-collection" | "crop-recommendation" | "market-insights" | "profile"

interface HomePageProps {
  onAuthClick?: () => void
}

export function HomePage({ onAuthClick }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const { isAuthenticated } = useAuth()
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [showDemoBanner, setShowDemoBanner] = useState(false)
  const [showChatbotDialog, setShowChatbotDialog] = useState(false)

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
      
      <div className="flex-1 overflow-y-auto pb-20 relative">{renderActiveTab()}</div>

      {/* AI Chatbot Floating Button - positioned within app container */}
      {isAuthenticated && (
        <div className="absolute bottom-[88px] right-4 z-40">
          <Button
            onClick={() => setShowChatbotDialog(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-2 border-white dark:border-gray-800"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

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

      {/* Chatbot Coming Soon Dialog */}
      <Dialog open={showChatbotDialog} onOpenChange={setShowChatbotDialog}>
        <DialogContent className="w-[95vw] max-w-[380px] mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              AI Farm Assistant
            </DialogTitle>
            <DialogDescription>
              Your intelligent farming companion
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="text-center space-y-4">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Coming Soon!</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI-powered chatbot will help you with:
                </p>
              </div>
              <ul className="text-sm text-left space-y-2 max-w-xs mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400">✓</span>
                  <span>Instant answers to farming questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400">✓</span>
                  <span>Personalized crop recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400">✓</span>
                  <span>Weather alerts and pest warnings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400">✓</span>
                  <span>Market price updates</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowChatbotDialog(false)}
              className="flex-1"
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
