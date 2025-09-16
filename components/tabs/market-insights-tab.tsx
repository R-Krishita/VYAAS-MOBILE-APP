"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TrendingUp, TrendingDown, Sprout, Calendar, Droplets, Download, FileText } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface MarketInsightsTabProps {
  onAuthClick?: () => void
}

interface CropData {
  name: string
  currentPrice: number
  expectedYield: number
  expectedRevenue: number
  profitMargin: number
  trend: "up" | "down"
  profit: number
}

export function MarketInsightsTab({ onAuthClick }: MarketInsightsTabProps) {
  const { isAuthenticated } = useAuth()
  const [cropData, setCropData] = useState<CropData[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [personalizedPlans, setPersonalizedPlans] = useState<any[]>([])

  useEffect(() => {
    const savedPlans = localStorage.getItem("vyaas_saved_plans")
    let recommendedCrops = ["Tulsi", "Ashwagandha", "Aloe Vera"]

    if (savedPlans) {
      try {
        const plans = JSON.parse(savedPlans)
        if (plans.length > 0) {
          recommendedCrops = plans.map((plan: any) => plan.cropName)
        }
      } catch (error) {
        console.log("Error parsing saved plans:", error)
      }
    }

    const marketData = recommendedCrops.slice(0, 3).map((crop) => {
      const currentPrice = Math.floor(Math.random() * (250 - 120) + 120)
      const expectedYield = Math.floor(Math.random() * (1000 - 500) + 500)
      const expectedRevenue = currentPrice * expectedYield
      const profitMargin = Math.floor(Math.random() * (50 - 20) + 20)
      const profit = Math.floor(expectedRevenue * (profitMargin / 100))
      const trend = Math.random() > 0.5 ? "up" : "down"

      return {
        name: crop,
        currentPrice,
        expectedYield,
        expectedRevenue,
        profitMargin,
        trend,
        profit,
      }
    })

    setCropData(marketData)
  }, [])

  const handleFeatureClick = () => {
    if (!isAuthenticated && onAuthClick) {
      onAuthClick()
    }
  }

  const getTrendIcon = (trend: "up" | "down") => {
    return trend === "up" ? (
      <TrendingUp className="h-5 w-5 text-green-600" />
    ) : (
      <TrendingDown className="h-5 w-5 text-red-600" />
    )
  }

  const getTrendColor = (trend: "up" | "down") => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  const generatePersonalizedPlan = (cropName: string) => {
    const plans = {
      Tulsi: [
        {
          step: 1,
          title: "Soil Preparation",
          description: "Add organic compost & vermicompost. Ensure well-drained soil with pH 6.0-7.5",
          icon: "🌱",
          timeline: "Week 1-2",
        },
        {
          step: 2,
          title: "Sowing Window",
          description: "Plant during March-April or June-July. Spacing: 30cm x 30cm between plants",
          icon: "🌿",
          timeline: "Week 3",
        },
        {
          step: 3,
          title: "Care & Maintenance",
          description: "Water twice weekly. Watch for aphids & whiteflies. Harvest leaves after 90 days",
          icon: "💧",
          timeline: "Week 4-12",
        },
      ],
      Ashwagandha: [
        {
          step: 1,
          title: "Soil Preparation",
          description: "Prepare well-drained sandy loam soil. Add farmyard manure 10-15 tons/hectare",
          icon: "🌱",
          timeline: "Week 1-2",
        },
        {
          step: 2,
          title: "Sowing Window",
          description: "Sow seeds in June-July. Row spacing: 30cm, plant spacing: 10cm",
          icon: "🌿",
          timeline: "Week 3",
        },
        {
          step: 3,
          title: "Irrigation & Care",
          description: "Light irrigation weekly. Harvest roots after 150-180 days. Watch for root rot",
          icon: "💧",
          timeline: "Week 4-24",
        },
      ],
      "Aloe Vera": [
        {
          step: 1,
          title: "Soil Preparation",
          description: "Ensure excellent drainage. Mix sand with garden soil. pH should be 6.0-8.0",
          icon: "🌱",
          timeline: "Week 1-2",
        },
        {
          step: 2,
          title: "Planting",
          description: "Plant suckers in February-March. Spacing: 60cm x 60cm for commercial cultivation",
          icon: "🌿",
          timeline: "Week 3",
        },
        {
          step: 3,
          title: "Maintenance",
          description: "Minimal watering needed. Harvest mature leaves after 8-10 months. Remove weeds regularly",
          icon: "💧",
          timeline: "Week 4-32",
        },
      ],
    }

    return plans[cropName as keyof typeof plans] || plans["Tulsi"]
  }

  const handleGetPersonalizedPlan = () => {
    if (!isAuthenticated && onAuthClick) {
      onAuthClick()
      return
    }

    const allPlans = cropData.map((crop) => ({
      cropName: crop.name,
      steps: generatePersonalizedPlan(crop.name),
    }))

    setPersonalizedPlans(allPlans)
    setIsModalOpen(true)
  }

  const handleSaveAsPDF = () => {
    // Simulate PDF generation and download
    const pdfContent = personalizedPlans
      .map(
        (plan) =>
          `${plan.cropName} Cultivation Plan:\n${plan.steps
            .map((step: any) => `${step.step}. ${step.title} (${step.timeline}): ${step.description}`)
            .join("\n")}`,
      )
      .join("\n\n")

    const blob = new Blob([pdfContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "vyaas-farming-plan.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">Market Insights</h2>
        <p className="text-muted-foreground">Compare current market value & business potential</p>
      </div>

      <div className="px-4 space-y-4">
        {cropData.map((crop, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{crop.name}</CardTitle>
                <div className={`flex items-center gap-1 ${getTrendColor(crop.trend)}`}>{getTrendIcon(crop.trend)}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-xl font-bold">₹{crop.currentPrice}/kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Yield/Acre</p>
                  <p className="text-xl font-bold">{crop.expectedYield.toLocaleString()} kg</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-lg font-semibold">₹{crop.expectedRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="text-lg font-semibold">{crop.profitMargin}%</p>
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Expected Profit</p>
                <p className="text-2xl font-bold text-green-700">₹{crop.profit.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="px-4">
        <Button className="w-full h-12 text-lg font-semibold" size="lg" onClick={handleGetPersonalizedPlan}>
          <FileText className="h-5 w-5 mr-2" />
          Get Personalized Plan
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] max-w-[380px] max-h-[85vh] mx-auto overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg">Personalized Farming Plan</DialogTitle>
            <DialogDescription className="text-sm">Step-by-step actionable insights for your crops</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {personalizedPlans.map((plan, cropIndex) => (
              <div key={cropIndex} className="space-y-3">
                <h4 className="font-semibold text-primary flex items-center gap-2 text-sm">
                  <Sprout className="h-4 w-4" />
                  {plan.cropName} Cultivation Plan
                </h4>
                <div className="space-y-2">
                  {plan.steps.map((step: any, stepIndex: number) => (
                    <Card key={stepIndex} className="p-3">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {step.step}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-1 mb-2">
                            <p className="font-medium text-sm">{step.title}</p>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded self-start">
                              {step.timeline}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                {cropIndex < personalizedPlans.length - 1 && <div className="border-b my-3" />}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t flex-shrink-0">
            <Button className="w-full h-10 text-sm bg-transparent" onClick={handleSaveAsPDF} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Save as PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="px-4 pb-6 space-y-3">
        <Button variant="outline" className="w-full bg-transparent" onClick={handleFeatureClick}>
          <Calendar className="h-4 w-4 mr-2" />
          View Seasonal Calendar
        </Button>
        <Button variant="outline" className="w-full bg-transparent" onClick={handleFeatureClick}>
          <Droplets className="h-4 w-4 mr-2" />
          Weather Forecast
        </Button>
      </div>
    </div>
  )
}
