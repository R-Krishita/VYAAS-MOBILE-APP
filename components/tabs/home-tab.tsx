"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TrendingUp, Droplets, Thermometer, Sun, Database, Bell, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { WeatherWidget } from "@/components/weather-widget"

interface HomeTabProps {
  onAuthClick?: () => void
}

export function HomeTab({ onAuthClick }: HomeTabProps) {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [farmData, setFarmData] = useState<any>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const actionableInsights = [
    {
      title: "Optimal Sowing Window",
      action: "Plant Mustard now for best yield",
      image: "/tulsi-holy-basil-planting-season.jpg", // Using available planting season image
      priority: "high",
    },
    {
      title: "Market Price Rising",
      action: "Soybean demand up 12% this week",
      image: "/market_price_soybean_home.png", // Using existing soybean market chart
      priority: "medium",
    },
    {
      title: "Pest Alert",
      action: "Aphids detected in nearby regions, monitor your crops",
      image: "/placeholder.svg", // Generic placeholder for pest alert
      priority: "low",
    },
  ]

  const archivedNotifications = [
    { id: 1, message: t("home.insights.soilHealth"), time: "2 hours ago", dismissed: false },
    { id: 2, message: "Mustard fits your soil this season", time: "1 day ago", dismissed: false },
    { id: 3, message: t("home.insights.marketTrend"), time: "2 days ago", dismissed: false },
    { id: 4, message: t("home.insights.weatherAlert"), time: "3 days ago", dismissed: false },
    { id: 5, message: "Harvest reminder: Soybean is approaching maturity", time: "1 week ago", dismissed: false },
  ]

  const [notifications, setNotifications] = useState(archivedNotifications)

  useEffect(() => {
    const savedData = localStorage.getItem("farmData")
    if (savedData) {
      setFarmData(JSON.parse(savedData))
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % actionableInsights.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleFeatureClick = (tab: string) => {
    if (!isAuthenticated && onAuthClick) {
      onAuthClick()
      return
    }
    window.dispatchEvent(new CustomEvent("switchTab", { detail: tab }))
  }

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, dismissed: true } : notif)))
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % actionableInsights.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + actionableInsights.length) % actionableInsights.length)
  }

  return (
    <div className="space-y-6">
      {/* Header with Notifications */}
      <div className="flex justify-between items-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Good morning, Farmer!</h2>
          <p className="text-muted-foreground">Here's your farm overview</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)} className="relative">
          <Bell className="h-6 w-6" />
          {notifications.filter((n) => !n.dismissed).length > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          )}
        </Button>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {actionableInsights.map((insight, index) => (
              <div key={index} className="w-full flex-shrink-0 relative">
                <div className="w-full h-48 relative">
                  <Image
                    src={insight.image}
                    alt={insight.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                    onError={(e) => {
                      console.error(`Failed to load image: ${insight.image}`)
                      // Fallback to placeholder
                      e.currentTarget.src = "/placeholder.jpg"
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-end">
                  <div className="p-4 text-white w-full">
                    <h3 className="text-lg font-bold">{insight.title}</h3>
                    <p className="text-sm opacity-90">{insight.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-3" />
        </Button>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-3">
          {actionableInsights.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-primary" : "bg-gray-300"
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              title={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="px-4">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {/* Quick Action Buttons */}
          <Button
            className="w-full h-16 text-lg font-semibold justify-start gap-4"
            onClick={() => handleFeatureClick("data-collection")}
          >
            <Database className="h-8 w-8" />
            <div className="text-left">
              <div>Collect Data</div>
              <div className="text-sm opacity-80 font-normal">Farm & Soil Info</div>
            </div>
          </Button>
          <Button
            className="w-full h-16 text-lg font-semibold justify-start gap-4"
            onClick={() => handleFeatureClick("crop-recommendation")}
          >
            <TrendingUp className="h-8 w-8" />
            <div className="text-left">
              <div>Get Crops</div>
              <div className="text-sm opacity-80 font-normal">Recommendations</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="px-4">
        <WeatherWidget />
      </div>

      {/* Farm Health Overview */}
      <div className="px-4">
        <Card>
          <CardHeader>
            <CardTitle>Farm Health Overview</CardTitle>
            <CardDescription>
              {farmData ? "Based on your collected farm data" : "Current status of your farm metrics"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Soil Health</span>
                <span>{farmData?.soilPH ? `pH ${farmData.soilPH}` : "85%"}</span>
              </div>
              <Progress
                value={farmData?.soilPH ? (Number.parseFloat(farmData.soilPH) / 14) * 100 : 85}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Land Size</span>
                <span>{farmData?.landSize ? `${farmData.landSize} ${farmData.landUnit}` : "72%"}</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Water Level</span>
                <span>{farmData?.soilMoisture ? `${farmData.soilMoisture}%` : "60%"}</span>
              </div>
              <Progress
                value={farmData?.soilMoisture ? Number.parseFloat(farmData.soilMoisture) : 60}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="px-4 pb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {farmData && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Farm Collected Data</p>
                    <p className="text-xs text-muted-foreground">Recently Saved</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Soil Test Completed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New Crop Recommendation Available</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Market Price Alert : Soybean</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="w-[95vw] max-w-[380px] max-h-[85vh] mx-auto overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {notifications
              .filter((n) => !n.dismissed)
              .map((notification) => (
                <Card key={notification.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => dismissNotification(notification.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {notifications.filter((n) => !n.dismissed).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No new notifications</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
