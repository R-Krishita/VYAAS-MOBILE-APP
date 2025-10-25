"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Sprout, Calendar, Droplets, Download, FileText, MapPin, Info } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface MarketInsightsTabProps {
  onAuthClick?: () => void
}

interface RegionalPrice {
  location: string
  state: string
  price: number
  trend: "up" | "down" | "stable"
  percentChange: number
  marketName: string
}

interface CropData {
  name: string
  currentPrice: number
  expectedYield: number
  expectedRevenue: number
  profitMargin: number
  trend: "up" | "down"
  profit: number
  regionalPrices: RegionalPrice[]
}

export function MarketInsightsTab({ onAuthClick }: MarketInsightsTabProps) {
  const { isAuthenticated } = useAuth()
  const [cropData, setCropData] = useState<CropData[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null)
  const [personalizedPlans, setPersonalizedPlans] = useState<any[]>([])

  useEffect(() => {
    const savedPlans = localStorage.getItem("vyaas_saved_plans")
    let recommendedCrops = ["Mustard", "Soybean", "Sunflower"]

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

    // Regional markets data for India
    const generateRegionalPrices = (baseCrop: string): RegionalPrice[] => {
      const markets = [
        { location: "Mumbai", state: "Maharashtra", market: "Vashi APMC" },
        { location: "Delhi", state: "Delhi", market: "Azadpur Mandi" },
        { location: "Bhopal", state: "Madhya Pradesh", market: "Bhopal Mandi" },
        { location: "Jaipur", state: "Rajasthan", market: "Jaipur Grain Market" },
        { location: "Indore", state: "Madhya Pradesh", market: "Indore APMC" },
        { location: "Hyderabad", state: "Telangana", market: "Begum Bazaar" },
      ]

      return markets.map((market) => {
        const basePrice = Math.floor(Math.random() * (250 - 120) + 120)
        const variance = Math.floor(Math.random() * 30 - 15) // -15 to +15
        const price = basePrice + variance
        const percentChange = Math.floor(Math.random() * 20 - 5) // -5% to +15%
        const trend = percentChange > 2 ? "up" : percentChange < -2 ? "down" : "stable"

        return {
          location: market.location,
          state: market.state,
          price,
          trend: trend as "up" | "down" | "stable",
          percentChange,
          marketName: market.market,
        }
      })
    }

    const marketData = recommendedCrops.slice(0, 3).map((crop) => {
      const regionalPrices = generateRegionalPrices(crop)
      const avgPrice = Math.floor(regionalPrices.reduce((sum, r) => sum + r.price, 0) / regionalPrices.length)
      const expectedYield = Math.floor(Math.random() * (1000 - 500) + 500)
      const expectedRevenue = avgPrice * expectedYield
      const profitMargin = Math.floor(Math.random() * (50 - 20) + 20)
      const profit = Math.floor(expectedRevenue * (profitMargin / 100))
      const trend = Math.random() > 0.5 ? "up" : "down"

      return {
        name: crop,
        currentPrice: avgPrice,
        expectedYield,
        expectedRevenue,
        profitMargin,
        trend: trend as "up" | "down",
        profit,
        regionalPrices: regionalPrices.sort((a, b) => b.price - a.price), // Sort by highest price
      }
    })

    setCropData(marketData)
  }, [])

  const handleFeatureClick = () => {
    if (!isAuthenticated && onAuthClick) {
      onAuthClick()
    }
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />
    return <div className="h-4 w-4 text-gray-600">—</div>
  }

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return "text-green-600"
    if (trend === "down") return "text-red-600"
    return "text-gray-600"
  }

  const showRegionalPrices = (crop: CropData) => {
    setSelectedCrop(crop)
    setIsPriceModalOpen(true)
  }

  const generatePersonalizedPlan = (cropName: string) => {
    const plans = {
      Mustard: [
        {
          step: 1,
          title: "Soil Preparation",
          description: "Ensure well-drained, loam to sandy loam soil. pH 6.5-7.5. Plow 2-3 times.",
          icon: "🌱",
          timeline: "Week 1-2",
        },
        {
          step: 2,
          title: "Sowing Window",
          description: "Sow seeds from late September to October. Spacing: 30cm x 10cm.",
          icon: "🌿",
          timeline: "Week 3",
        },
        {
          step: 3,
          title: "Irrigation & Care",
          description: "Requires 2-3 irrigations at critical stages. Monitor for aphids.",
          icon: "💧",
          timeline: "Week 4-16",
        },
      ],
      Soybean: [
        {
          step: 1,
          title: "Soil Preparation",
          description: "Prefers loam or clay loam soil. Ensure good drainage. pH 6.0-7.0.",
          icon: "🌱",
          timeline: "Week 1-2",
        },
        {
          step: 2,
          title: "Sowing Window",
          description: "Sow during the Kharif season (June-July). Use a seed drill for uniform spacing.",
          icon: "🌿",
          timeline: "Week 3",
        },
        {
          step: 3,
          title: "Weed & Pest Management",
          description: "Critical in the first 30-45 days. Watch for girdle beetle and leaf miners.",
          icon: "💧",
          timeline: "Week 4-15",
        },
      ],
      Sunflower: [
        {
          step: 1,
          title: "Soil Preparation",
          description: "Grows in a wide range of soils, but prefers sandy loam. Good drainage is key.",
          icon: "🌱",
          timeline: "Week 1-2",
        },
        {
          step: 2,
          title: "Planting",
          description: "Can be sown in both Kharif and Rabi seasons. Spacing: 60cm x 30cm.",
          icon: "🌿",
          timeline: "Week 3",
        },
        {
          step: 3,
          title: "Irrigation & Harvest",
          description: "Requires irrigation at flowering stage. Harvest when the back of the head turns yellow.",
          icon: "💧",
          timeline: "Week 4-14",
        },
      ],
    }

    return plans[cropName as keyof typeof plans] || plans["Mustard"]
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
                <div className={`flex items-center gap-1 ${getTrendColor(crop.trend)}`}>
                  {getTrendIcon(crop.trend)}
                  <span className="text-sm font-medium">
                    {crop.trend === "up" ? "+" : ""}
                    {Math.floor(Math.random() * 15 - 3)}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Price</p>
                  <p className="text-xl font-bold">₹{crop.currentPrice}/kg</p>
                  <p className="text-xs text-muted-foreground">National average</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Yield/Acre</p>
                  <p className="text-xl font-bold">{crop.expectedYield.toLocaleString()} kg</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-lg font-semibold">₹{crop.expectedRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="text-lg font-semibold">{crop.profitMargin}%</p>
                </div>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Expected Profit</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  ₹{crop.profit.toLocaleString()}
                </p>
              </div>

              {/* Regional Prices Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Top Markets
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => showRegionalPrices(crop)}
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-1.5">
                  {crop.regionalPrices.slice(0, 3).map((region, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{region.location}</span>
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          {region.state}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">₹{region.price}</span>
                        <div className={getTrendColor(region.trend)}>
                          {getTrendIcon(region.trend)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

      {/* Regional Prices Modal */}
      <Dialog open={isPriceModalOpen} onOpenChange={setIsPriceModalOpen}>
        <DialogContent className="w-[95vw] max-w-[380px] max-h-[85vh] mx-auto overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {selectedCrop?.name} - Regional Prices
            </DialogTitle>
            <DialogDescription className="text-sm">
              Compare prices across major markets in India
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {selectedCrop?.regionalPrices.map((region, index) => (
              <Card key={index} className={`p-4 ${
                index === 0 
                  ? "border-green-500 bg-green-50 dark:bg-green-950" 
                  : index === selectedCrop.regionalPrices.length - 1 
                  ? "border-red-500 bg-red-50 dark:bg-red-950" 
                  : ""
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <h4 className="font-semibold text-base">{region.location}</h4>
                      {index === 0 && (
                        <Badge variant="default" className="text-xs bg-green-600">
                          Highest
                        </Badge>
                      )}
                      {index === selectedCrop.regionalPrices.length - 1 && (
                        <Badge variant="destructive" className="text-xs">
                          Lowest
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{region.marketName}</p>
                    <Badge variant="outline" className="text-xs">
                      {region.state}
                    </Badge>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-foreground">₹{region.price}</p>
                    <p className="text-xs text-muted-foreground mb-1">/kg</p>
                    <div className={`flex items-center gap-1 justify-end ${getTrendColor(region.trend)}`}>
                      {getTrendIcon(region.trend)}
                      <span className="text-sm font-medium">
                        {region.percentChange > 0 ? "+" : ""}
                        {region.percentChange}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Price Analysis Summary */}
            {selectedCrop && (
              <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Price Analysis
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Highest Price:</span>
                    <span className="font-semibold">
                      ₹{selectedCrop.regionalPrices[0].price} ({selectedCrop.regionalPrices[0].location})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lowest Price:</span>
                    <span className="font-semibold">
                      ₹{selectedCrop.regionalPrices[selectedCrop.regionalPrices.length - 1].price} ({selectedCrop.regionalPrices[selectedCrop.regionalPrices.length - 1].location})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price Range:</span>
                    <span className="font-semibold">
                      ₹{selectedCrop.regionalPrices[0].price - selectedCrop.regionalPrices[selectedCrop.regionalPrices.length - 1].price}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">National Avg:</span>
                    <span className="font-bold text-base">₹{selectedCrop.currentPrice}/kg</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="pt-3 border-t flex-shrink-0">
            <p className="text-xs text-muted-foreground text-center mb-2">
              Prices updated daily from major APMCs & mandis
            </p>
            <Button 
              className="w-full h-10 text-sm" 
              onClick={() => setIsPriceModalOpen(false)}
            >
              Close
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
