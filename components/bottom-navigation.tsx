"use client"

import { Button } from "@/components/ui/button"
import { Home, Database, TrendingUp, MapPin, User } from "lucide-react"
import type { TabType } from "@/components/home-page"

interface BottomNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home" as TabType, label: "Home", icon: Home },
    { id: "data-collection" as TabType, label: "Data Collection", icon: Database },
    { id: "crop-recommendation" as TabType, label: "Crops", icon: TrendingUp },
    { id: "market-insights" as TabType, label: "Market", icon: MapPin },
    { id: "profile" as TabType, label: "Profile", icon: User },
  ]

  return (
    <div className="bg-card border-t border-border px-2 py-2">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive ? "text-primary" : "text-muted-foreground hover:bg-muted"
              }`}
              data-tour={`${tab.id}-tab`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
