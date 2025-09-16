"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  MapPin,
  Home,
  Mountain,
  TestTube,
  Droplets,
  Wheat,
  DollarSign,
  Camera,
  ChevronDown,
  ChevronUp,
  MapPinIcon,
  Leaf,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

interface DataCollectionTabProps {
  onAuthClick?: () => void
}

interface FormData {
  farmName: string
  location: { lat: number; lon: number } | null
  address: string
  landSize: string
  landUnit: string
  slope: string
  drainage: string
  soilType: string
  soilPH: string
  organicCarbon: string
  nitrogen: string
  phosphorus: string
  potassium: string
  soilMoisture: string
  waterSource: string
  waterPH: string
  irrigationType: string
  lastCrop: string
  budget: string
  notes: string
}

export function DataCollectionTab({ onAuthClick }: DataCollectionTabProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    farm: true,
    land: false,
    soil: false,
    water: false,
    crop: false,
    economics: false,
    media: false,
  })

  const [formData, setFormData] = useState<FormData>({
    farmName: "",
    location: null,
    address: "",
    landSize: "",
    landUnit: "acres",
    slope: "",
    drainage: "",
    soilType: "",
    soilPH: "",
    organicCarbon: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    soilMoisture: "",
    waterSource: "",
    waterPH: "",
    irrigationType: "",
    lastCrop: "",
    budget: "",
    notes: "",
  })

  const handleFeatureClick = () => {
    if (!isAuthenticated && onAuthClick) {
      onAuthClick()
    }
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAutoDetectLocation = () => {
    // Simulate auto-detection
    setFormData((prev) => ({
      ...prev,
      location: { lat: 20.2961, lon: 85.8245 },
      address: "Bhubaneswar, Khordha, Odisha",
    }))
  }

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("farmData", JSON.stringify(formData))
    alert("Farm data saved successfully!")
  }

  const handleRecommendCrops = () => {
    // Save data first
    localStorage.setItem("farmData", JSON.stringify(formData))
    // Simulate API call and redirect
    setTimeout(() => {
      // This would trigger the parent to switch to crop recommendation tab
      window.dispatchEvent(new CustomEvent("switchTab", { detail: "crop-recommendation" }))
    }, 1000)
  }

  const sections = [
    {
      id: "farm",
      title: "Farm Information",
      icon: Home,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="farmName" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Farm Name
            </Label>
            <Input
              id="farmName"
              placeholder="Enter your farm name"
              value={formData.farmName}
              onChange={(e) => handleInputChange("farmName", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">Give your farm a memorable name</p>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
              <Badge variant="secondary" className="text-xs">
                Auto
              </Badge>
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Location will be auto-detected"
                value={formData.location ? `${formData.location.lat}, ${formData.location.lon}` : ""}
                readOnly
              />
              <Button variant="outline" onClick={handleAutoDetectLocation}>
                <MapPinIcon className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">GPS coordinates for precise location</p>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Village, District"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">Your farm's complete address</p>
          </div>
        </div>
      ),
    },
    {
      id: "land",
      title: "Land Details",
      icon: Mountain,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <Mountain className="h-4 w-4" />
              Land Size
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter size"
                value={formData.landSize}
                onChange={(e) => handleInputChange("landSize", e.target.value)}
                type="number"
              />
              <Select value={formData.landUnit} onValueChange={(value) => handleInputChange("landUnit", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acres">Acres</SelectItem>
                  <SelectItem value="hectares">Hectares</SelectItem>
                  <SelectItem value="bigha">Bigha</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total cultivable area</p>
          </div>

          <div>
            <Label htmlFor="slope">Slope & Drainage</Label>
            <Select value={formData.slope} onValueChange={(value) => handleInputChange("slope", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select slope type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat (0-2%)</SelectItem>
                <SelectItem value="gentle">Gentle (2-5%)</SelectItem>
                <SelectItem value="moderate">Moderate (5-10%)</SelectItem>
                <SelectItem value="steep">Steep (&gt;10%)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Land slope affects water drainage</p>
          </div>
        </div>
      ),
    },
    {
      id: "soil",
      title: "Soil Details",
      icon: TestTube,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Soil Type
            </Label>
            <Select value={formData.soilType} onValueChange={(value) => handleInputChange("soilType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sand">Sand</SelectItem>
                <SelectItem value="loam">Loam</SelectItem>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="sandy-loam">Sandy-Loam</SelectItem>
                <SelectItem value="clay-loam">Clay-Loam</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Primary soil composition</p>
          </div>

          <div>
            <Label htmlFor="soilPH">Soil pH (0-14)</Label>
            <Input
              id="soilPH"
              placeholder="6.5"
              value={formData.soilPH}
              onChange={(e) => handleInputChange("soilPH", e.target.value)}
              type="number"
              min="0"
              max="14"
              step="0.1"
            />
            <p className="text-xs text-muted-foreground mt-1">Soil acidity/alkalinity level</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organicCarbon">Organic Carbon (%)</Label>
              <Input
                id="organicCarbon"
                placeholder="1.2"
                value={formData.organicCarbon}
                onChange={(e) => handleInputChange("organicCarbon", e.target.value)}
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="soilMoisture">Soil Moisture (%)</Label>
              <Input
                id="soilMoisture"
                placeholder="45"
                value={formData.soilMoisture}
                onChange={(e) => handleInputChange("soilMoisture", e.target.value)}
                type="number"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nitrogen">Nitrogen (N)</Label>
              <Input
                id="nitrogen"
                placeholder="85"
                value={formData.nitrogen}
                onChange={(e) => handleInputChange("nitrogen", e.target.value)}
                type="number"
              />
            </div>
            <div>
              <Label htmlFor="phosphorus">Phosphorus (P)</Label>
              <Input
                id="phosphorus"
                placeholder="65"
                value={formData.phosphorus}
                onChange={(e) => handleInputChange("phosphorus", e.target.value)}
                type="number"
              />
            </div>
            <div>
              <Label htmlFor="potassium">Potassium (K)</Label>
              <Input
                id="potassium"
                placeholder="75"
                value={formData.potassium}
                onChange={(e) => handleInputChange("potassium", e.target.value)}
                type="number"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Optional: Leave blank if unknown</p>
        </div>
      ),
    },
    {
      id: "water",
      title: "Water Details",
      icon: Droplets,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Water Source
            </Label>
            <Select value={formData.waterSource} onValueChange={(value) => handleInputChange("waterSource", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select water source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="canal">Canal</SelectItem>
                <SelectItem value="well">Well</SelectItem>
                <SelectItem value="borewell">Borewell</SelectItem>
                <SelectItem value="rainfed">Rainfed</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Primary source of irrigation</p>
          </div>

          <div>
            <Label htmlFor="waterPH">Water pH (Optional)</Label>
            <Input
              id="waterPH"
              placeholder="7.0"
              value={formData.waterPH}
              onChange={(e) => handleInputChange("waterPH", e.target.value)}
              type="number"
              min="0"
              max="14"
              step="0.1"
            />
            <p className="text-xs text-muted-foreground mt-1">Water quality measurement</p>
          </div>

          <div>
            <Label htmlFor="irrigationType">Irrigation Type</Label>
            <Select
              value={formData.irrigationType}
              onValueChange={(value) => handleInputChange("irrigationType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select irrigation method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drip">Drip Irrigation</SelectItem>
                <SelectItem value="sprinkler">Sprinkler</SelectItem>
                <SelectItem value="flood">Flood Irrigation</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Method of water application</p>
          </div>
        </div>
      ),
    },
    {
      id: "crop",
      title: "Crop History",
      icon: Wheat,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <Wheat className="h-4 w-4" />
              Last Crop Grown
            </Label>
            <Input
              placeholder="e.g., Rice, Wheat, Maize"
              value={formData.lastCrop}
              onChange={(e) => handleInputChange("lastCrop", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">Previous season's main crop</p>
          </div>
        </div>
      ),
    },
    {
      id: "economics",
      title: "Economics",
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget / Investment Capacity
            </Label>
            <Input
              placeholder="₹50,000"
              value={formData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">Available budget for this season</p>
          </div>

          <div>
            <Label htmlFor="notes">Notes / Constraints</Label>
            <Textarea
              id="notes"
              placeholder="Any specific requirements, constraints, or additional information..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">Additional details about your farming needs</p>
          </div>
        </div>
      ),
    },
    {
      id: "media",
      title: "Media (Optional)",
      icon: Camera,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Field Images
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Upload 1-2 images of your field</p>
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Photos help provide better recommendations</p>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Data Collection</h2>
        <p className="text-muted-foreground">Collect farm & land inputs to power crop recommendations</p>
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon
          const isOpen = openSections[section.id]

          return (
            <Card key={section.id}>
              <Collapsible open={isOpen} onOpenChange={() => toggleSection(section.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        {section.title}
                      </div>
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">{section.content}</CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full" size="lg" onClick={handleSave}>
          Save Data
        </Button>
        <Button className="w-full bg-primary hover:bg-primary/90" size="lg" onClick={handleRecommendCrops}>
          <Leaf className="h-4 w-4 mr-2" />
          Recommend Best Crops
        </Button>
      </div>
    </div>
  )
}
