"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Leaf, Star, TrendingUp, Coins, Clock, BarChart3, X, TrendingDown } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"

interface CropRecommendationTabProps {
  onAuthClick?: () => void
  onNavigateToMarket?: (cropIds: string[]) => void
}

interface CropData {
  id: string
  name: string
  image: string
  suitability: number
  reasons: string[]
  growthDuration: number
  yieldPerAcre: number
  profitPerAcre: number
}

export function CropRecommendationTab({ onAuthClick, onNavigateToMarket }: CropRecommendationTabProps) {
  const { isAuthenticated } = useAuth()
  const [farmData, setFarmData] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<CropData[]>([])
  const [selectedCropForMarket, setSelectedCropForMarket] = useState<CropData | null>(null)

  useEffect(() => {
    const savedData = localStorage.getItem("farmData")
    if (savedData) {
      const data = JSON.parse(savedData)
      setFarmData(data)
      generateRecommendations(data)
    } else {
      generateRecommendations({})
    }
  }, [])

  const generateRecommendations = (data: any) => {
    const oilseedCrops = [
      {
        id: "mustard",
        name: "Mustard",
        image: "/placeholder.svg", // Generic placeholder for mustard plant
        baseYield: [800, 1200],
        baseProfit: [60000, 80000],
        growthDuration: [110, 130],
        suitableFor: ["Loam", "Sandy Loam"],
        reasons: ["Cool climate crop", "Good market price", "Disease resistant"],
      },
      {
        id: "soybean",
        name: "Soybean",
        image: "/placeholder.svg", // Generic placeholder for soybean plant
        baseYield: [1500, 2000],
        baseProfit: [70000, 90000],
        growthDuration: [100, 120],
        suitableFor: ["Clay", "Loam"],
        reasons: ["High protein content", "Nitrogen fixation", "Versatile use"],
      },
      {
        id: "sunflower",
        name: "Sunflower",
        image: "/placeholder.svg", // Generic placeholder for sunflower plant
        baseYield: [1000, 1500],
        baseProfit: [55000, 75000],
        growthDuration: [90, 100],
        suitableFor: ["Sandy", "Loam"],
        reasons: ["Drought tolerant", "Attracts pollinators", "High oil yield"],
      },
    ]

    let selectedCrops: any[] = []

    if (data.soilType === "Loam") {
      selectedCrops = oilseedCrops.filter((crop) => ["mustard", "soybean", "sunflower"].includes(crop.id))
    } else if (data.soilType === "Clay") {
      selectedCrops = oilseedCrops.filter((crop) => ["soybean"].includes(crop.id))
    } else {
      selectedCrops = oilseedCrops.sort(() => Math.random() - 0.5).slice(0, 3)
    }

    if (selectedCrops.length < 3) {
      const remaining = oilseedCrops.filter((crop) => !selectedCrops.find((selected) => selected.id === crop.id))
      selectedCrops = [...selectedCrops, ...remaining].slice(0, 3)
    }

    const cropRecommendations: CropData[] = selectedCrops.map((crop) => ({
      id: crop.id,
      name: crop.name,
      image: crop.image,
      suitability: Math.floor(Math.random() * 26) + 70,
      reasons: crop.reasons,
      growthDuration:
        Math.floor(Math.random() * (crop.growthDuration[1] - crop.growthDuration[0] + 1)) + crop.growthDuration[0],
      yieldPerAcre: Math.floor(Math.random() * (crop.baseYield[1] - crop.baseYield[0] + 1)) + crop.baseYield[0],
      profitPerAcre: Math.floor(Math.random() * (crop.baseProfit[1] - crop.baseProfit[0] + 1)) + crop.baseProfit[0],
    }))

    setRecommendations(cropRecommendations)
  }

  const handleFeatureClick = () => {
    if (!isAuthenticated && onAuthClick) {
      onAuthClick()
    }
  }

  const handleMarketInsights = (crop: CropData) => {
    if (!isAuthenticated && onAuthClick) {
      onAuthClick()
      return
    }
    setSelectedCropForMarket(crop)
  }

  const handleCompareAll = () => {
    if (!isAuthenticated && onAuthClick) {
      onAuthClick()
      return
    }
    if (onNavigateToMarket) {
      onNavigateToMarket(recommendations.map((crop) => crop.id))
    }
  }

  const generateMarketData = (crop: CropData) => {
    const currentPrice = Math.floor(Math.random() * (250 - 120) + 120)
    const trend = Math.random() > 0.5 ? "up" : "down"
    const trendPercentage = Math.floor(Math.random() * 20) + 5

    return {
      currentPrice,
      trend,
      trendPercentage,
      demandLevel: Math.random() > 0.5 ? "High" : "Medium",
      seasonalFactor: Math.random() > 0.5 ? "Peak Season" : "Off Season",
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">Top 3 Crops for Your Farm</h2>
        <p className="text-muted-foreground">Based on your soil & field data</p>
      </div>

      {/* Farm Data Summary */}
      {farmData && (
        <div className="px-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Leaf className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">
                    {farmData.farmName || "Your Farm"} - {farmData.landSize || "N/A"} acres
                  </p>
                  <p className="text-sm text-green-600">
                    {farmData.soilType || "Mixed"} soil • pH {farmData.soilPH || "6.5"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="px-4 space-y-4">
        {recommendations.map((crop, index) => (
          <Card key={crop.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={crop.image || "/placeholder.svg"}
                    alt={crop.name}
                    className="w-16 h-16 rounded-lg object-cover bg-green-100"
                  />
                  <div>
                    <CardTitle className="text-lg">{crop.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{crop.suitability}% Match</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">Rank #{index + 1}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Reasons */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Why this crop?</p>
                <div className="flex flex-wrap gap-1">
                  {crop.reasons.map((reason, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Crop Details Grid */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Clock className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Growth Period</p>
                  <p className="text-sm font-medium">{crop.growthDuration} days</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Yield/Acre</p>
                  <p className="text-sm font-medium">{crop.yieldPerAcre} kg</p>
                </div>
              </div>

              {/* Profit Estimate */}
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <Coins className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Estimated Profit/Acre</p>
                <p className="text-xl font-bold text-green-700">₹{crop.profitPerAcre.toLocaleString()}</p>
              </div>

              {/* Market Insights Button */}
              <Button className="w-full" onClick={() => handleMarketInsights(crop)}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Market Insights
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer CTA for comparing all crops */}
      <div className="px-4 pb-6">
        <Button className="w-full h-12 text-lg font-semibold" size="lg" onClick={handleCompareAll}>
          <BarChart3 className="h-5 w-5 mr-2" />
          Compare These Crops
        </Button>
      </div>

      {/* Individual Crop Market Insights Modal */}
      <Dialog open={!!selectedCropForMarket} onOpenChange={() => setSelectedCropForMarket(null)}>
        <DialogContent className="w-[95vw] max-w-[380px] max-h-[85vh] mx-auto overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{selectedCropForMarket?.name} Market Info</DialogTitle>
          </DialogHeader>
          {selectedCropForMarket && (
            <div className="space-y-4">
              {(() => {
                const marketData = generateMarketData(selectedCropForMarket)
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">Current Price</p>
                          <p className="text-xl font-bold">₹{marketData.currentPrice}/kg</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">Price Trend</p>
                          <div
                            className={`flex items-center justify-center gap-1 ${
                              marketData.trend === "up" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {marketData.trend === "up" ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            <span className="font-bold">{marketData.trendPercentage}%</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">Market Analysis</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Demand Level:</span>
                            <span className="font-medium">{marketData.demandLevel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Season:</span>
                            <span className="font-medium">{marketData.seasonalFactor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Profit Estimate:</span>
                            <span className="font-bold text-green-600">
                              ₹{selectedCropForMarket.profitPerAcre.toLocaleString()}/acre
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
