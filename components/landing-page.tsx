"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Leaf, TrendingUp, MapPin, User } from "lucide-react"

interface LandingPageProps {
  onAuthRequest: () => void
}

export function LandingPage({ onAuthRequest }: LandingPageProps) {
  const features = [
    {
      icon: Leaf,
      title: "Soil Health",
      description: "Monitor and analyze your soil conditions for optimal crop growth",
    },
    {
      icon: TrendingUp,
      title: "Crop Recommendation",
      description: "Get personalized crop suggestions based on your land and climate",
    },
    {
      icon: MapPin,
      title: "Market Insights",
      description: "Stay updated with current and future market prices",
    },
    {
      icon: User,
      title: "Profile",
      description: "Manage your farm details and preferences",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Navbar onAuthClick={onAuthRequest} />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Vyaas</h2>
          <p className="text-muted-foreground">Your Smart Farming companion</p>
        </div>

        <div className="space-y-4 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={onAuthRequest}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                      <CardDescription className="text-sm">{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="space-y-3">
          <Button onClick={onAuthRequest} className="w-full" size="lg">
            Get Started
          </Button>
          <p className="text-center text-sm text-muted-foreground">Sign up to unlock all features</p>
        </div>
      </div>
    </div>
  )
}
