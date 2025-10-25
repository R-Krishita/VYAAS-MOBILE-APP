"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from "lucide-react"
import { useTranslation } from "react-i18next"

interface WeatherDay {
  day: string
  temp: number
  condition: "sunny" | "cloudy" | "rainy" | "windy"
  rainfall: number
  humidity: number
}

const mockWeatherData: WeatherDay[] = [
  { day: "Mon", temp: 28, condition: "sunny", rainfall: 0, humidity: 65 },
  { day: "Tue", temp: 26, condition: "cloudy", rainfall: 2, humidity: 72 },
  { day: "Wed", temp: 24, condition: "rainy", rainfall: 15, humidity: 85 },
  { day: "Thu", temp: 25, condition: "rainy", rainfall: 8, humidity: 80 },
  { day: "Fri", temp: 27, condition: "cloudy", rainfall: 0, humidity: 70 },
  { day: "Sat", temp: 29, condition: "sunny", rainfall: 0, humidity: 62 },
  { day: "Sun", temp: 30, condition: "sunny", rainfall: 0, humidity: 58 },
]

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny":
      return <Sun className="h-6 w-6 text-yellow-500" />
    case "cloudy":
      return <Cloud className="h-6 w-6 text-gray-400" />
    case "rainy":
      return <CloudRain className="h-6 w-6 text-blue-500" />
    case "windy":
      return <Wind className="h-6 w-6 text-gray-500" />
    default:
      return <Sun className="h-6 w-6" />
  }
}

export function WeatherWidget() {
  const { t } = useTranslation()
  const today = mockWeatherData[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          7-Day Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Today's Highlight */}
        <div className="mb-4 p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-3xl font-bold">{today.temp}°C</p>
              <p className="text-sm capitalize">{today.condition}</p>
            </div>
            <div className="text-right">
              {getWeatherIcon(today.condition)}
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1 text-xs">
                  <Droplets className="h-3 w-3" />
                  <span>{today.humidity}%</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <CloudRain className="h-3 w-3" />
                  <span>{today.rainfall}mm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="grid grid-cols-7 gap-2">
          {mockWeatherData.map((day, index) => (
            <div
              key={index}
              className={`text-center p-2 rounded-lg ${
                index === 0 ? "bg-primary/20" : "bg-muted/50"
              }`}
            >
              <p className="text-xs font-medium mb-1">{day.day}</p>
              <div className="flex justify-center mb-1">
                {getWeatherIcon(day.condition)}
              </div>
              <p className="text-sm font-bold">{day.temp}°</p>
              {day.rainfall > 0 && (
                <p className="text-xs text-blue-600">{day.rainfall}mm</p>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-600" />
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-sm font-bold">{today.humidity}%</p>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <CloudRain className="h-4 w-4 mx-auto mb-1 text-purple-600" />
            <p className="text-xs text-muted-foreground">Rainfall</p>
            <p className="text-sm font-bold">{today.rainfall}mm</p>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <Wind className="h-4 w-4 mx-auto mb-1 text-orange-600" />
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="text-sm font-bold">12 km/h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
