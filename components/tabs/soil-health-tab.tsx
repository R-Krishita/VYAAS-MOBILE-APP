"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Leaf, Droplets, Zap, TestTube } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface SoilHealthTabProps {
  onAuthClick?: () => void
}

export function SoilHealthTab({ onAuthClick }: SoilHealthTabProps) {
  const { isAuthenticated } = useAuth()

  const handleFeatureClick = () => {
    if (!isAuthenticated && onAuthClick) {
      onAuthClick()
    }
  }

  const soilMetrics = [
    { name: "pH Level", value: 6.8, optimal: "6.0-7.0", status: "good", icon: TestTube },
    { name: "Nitrogen", value: 85, optimal: "80-100%", status: "good", icon: Leaf },
    { name: "Phosphorus", value: 65, optimal: "60-80%", status: "good", icon: Zap },
    { name: "Moisture", value: 45, optimal: "40-60%", status: "good", icon: Droplets },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Soil Health</h2>
        <p className="text-muted-foreground">Monitor your soil conditions for optimal crop growth</p>
      </div>

      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Soil Health</CardTitle>
          <CardDescription>Based on recent soil analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">85%</div>
            <Badge className="bg-green-100 text-green-800">Excellent</Badge>
            <p className="text-sm text-muted-foreground mt-2">Last updated: 2 hours ago</p>
          </div>
        </CardContent>
      </Card>

      {/* Soil Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Detailed Metrics</h3>
        <div className="space-y-4">
          {soilMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{metric.name}</p>
                        <p className="text-sm text-muted-foreground">Optimal: {metric.optimal}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(metric.status)}>{metric.status}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Level</span>
                      <span>
                        {typeof metric.value === "number" && metric.name !== "pH Level"
                          ? `${metric.value}%`
                          : metric.value}
                      </span>
                    </div>
                    <Progress
                      value={
                        typeof metric.value === "number"
                          ? metric.name === "pH Level"
                            ? (metric.value / 14) * 100
                            : metric.value
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Actions to improve your soil health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Add organic compost</p>
                <p className="text-xs text-muted-foreground">Increase organic matter content by 2-3%</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Monitor irrigation</p>
                <p className="text-xs text-muted-foreground">Maintain consistent moisture levels</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Button className="w-full" size="lg" onClick={handleFeatureClick}>
        Schedule Soil Test
      </Button>
    </div>
  )
}
