"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import {
  User,
  MapPin,
  Phone,
  Wheat,
  Leaf,
  Calendar,
  Droplets,
  TestTube,
  Camera,
  CloudSun,
  TrendingUp,
  MapPinIcon,
  X,
  Upload,
  Save,
  Sparkles,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"

interface DataCollectionTabProps {
  onAuthClick?: () => void
}

interface FormData {
  // Tab 1: Farmer Info & Land Details
  farmerName: string
  farmerContact: string
  farmName: string
  farmSize: string
  farmUnit: string
  location: { lat: number; lon: number } | null
  address: string
  irrigationType: string
  
  // Tab 2: Crop Info
  cropType: string
  cropVariety: string
  sowingDate: string
  expectedHarvestDate: string
  fertilizerUsed: string
  pesticideUsed: string
  
  // Tab 3: Field Data
  soilType: string
  soilPH: string
  soilMoisture: string
  ndviReading: string
  observedIssues: string
  
  // Tab 4: External Sync (read-only/auto)
  weatherSync: boolean
  marketSync: boolean
  satelliteSync: boolean
}

export function DataCollectionTab({ onAuthClick }: DataCollectionTabProps) {
  const { isAuthenticated } = useAuth()
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; name: string }>>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    // Tab 1
    farmerName: "",
    farmerContact: "",
    farmName: "",
    farmSize: "",
    farmUnit: "acres",
    location: null,
    address: "",
    irrigationType: "",
    
    // Tab 2
    cropType: "",
    cropVariety: "",
    sowingDate: "",
    expectedHarvestDate: "",
    fertilizerUsed: "",
    pesticideUsed: "",
    
    // Tab 3
    soilType: "",
    soilPH: "",
    soilMoisture: "",
    ndviReading: "0.65",
    observedIssues: "",
    
    // Tab 4
    weatherSync: true,
    marketSync: true,
    satelliteSync: false,
  })

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAutoDetectLocation = () => {
    setIsDetectingLocation(true)
    toast.info("Detecting your location...")
    
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        location: { lat: 20.2961, lon: 85.8245 },
        address: "Bhubaneswar, Khordha, Odisha",
      }))
      setIsDetectingLocation(false)
      toast.success("Location detected successfully!")
    }, 2000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || uploadedImages.length >= 3) {
      if (uploadedImages.length >= 3) {
        toast.error("Maximum 3 images allowed")
      }
      return
    }

    Array.from(files).slice(0, 3 - uploadedImages.length).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }

      setUploadProgress(0)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 10
        })
      }, 100)

      const reader = new FileReader()
      reader.onloadend = () => {
        setTimeout(() => {
          const newImage = {
            id: Math.random().toString(36).substr(2, 9),
            url: reader.result as string,
            name: file.name,
          }
          setUploadedImages((prev) => [...prev, newImage])
          toast.success(`${file.name} uploaded successfully`)
          setUploadProgress(0)
        }, 1000)
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id))
    toast.info("Image removed")
  }

  const handleSyncData = () => {
    setIsSyncing(true)
    toast.info("Syncing external data...")
    
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        weatherSync: true,
        marketSync: true,
        satelliteSync: true,
      }))
      setIsSyncing(false)
      toast.success("All external data synced!")
    }, 2000)
  }

  const handleSave = () => {
    if (!formData.farmerName || !formData.farmSize) {
      toast.error("Please fill in required fields (Farmer Name, Farm Size)")
      return
    }
    
    localStorage.setItem("farmData", JSON.stringify(formData))
    toast.success("Farm data saved successfully!")
  }

  const handleGenerateRecommendations = () => {
    if (!formData.farmerName || !formData.farmSize || !formData.cropType) {
      toast.error("Please fill in basic information before generating recommendations")
      return
    }
    
    localStorage.setItem("farmData", JSON.stringify(formData))
    toast.success("Data saved! Generating crop recommendations...")
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("switchTab", { detail: "crop-recommendation" }))
    }, 1000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Data Collection</h2>
        <p className="text-muted-foreground">Complete farm profile for personalized crop recommendations</p>
      </div>

      {/* Tab 1: Farmer Info & Land Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Farmer Info & Land Details
          </CardTitle>
          <CardDescription>Basic information about you and your farm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="farmerName">
                Farmer Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="farmerName"
                placeholder="Enter your full name"
                value={formData.farmerName}
                onChange={(e) => handleInputChange("farmerName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="farmerContact">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="farmerContact"
                  placeholder="+91 98765 43210"
                  value={formData.farmerContact}
                  onChange={(e) => handleInputChange("farmerContact", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="farmName">Farm Name</Label>
              <Input
                id="farmName"
                placeholder="e.g., Green Valley Farm"
                value={formData.farmName}
                onChange={(e) => handleInputChange("farmName", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="farmSize">
                  Farm Size <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="farmSize"
                  type="number"
                  placeholder="5.2"
                  value={formData.farmSize}
                  onChange={(e) => handleInputChange("farmSize", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="farmUnit">Unit</Label>
                <Select 
                  value={formData.farmUnit} 
                  onValueChange={(value) => handleInputChange("farmUnit", value)}
                >
                  <SelectTrigger id="farmUnit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="hectares">Hectares</SelectItem>
                    <SelectItem value="bigha">Bigha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                GPS Location
                <Badge variant="secondary" className="text-xs">Auto</Badge>
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder={isDetectingLocation ? "Detecting..." : "Tap button to detect"}
                  value={formData.location ? `${formData.location.lat.toFixed(4)}, ${formData.location.lon.toFixed(4)}` : ""}
                  readOnly
                  className={isDetectingLocation ? "animate-pulse" : ""}
                />
                <Button 
                  variant="outline" 
                  onClick={handleAutoDetectLocation}
                  disabled={isDetectingLocation}
                >
                  {isDetectingLocation ? (
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MapPinIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isDetectingLocation ? "Detecting your GPS coordinates..." : "Precise location helps with weather and soil data"}
              </p>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Village, District, State"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="irrigationType">Irrigation Type</Label>
              <Select 
                value={formData.irrigationType} 
                onValueChange={(value) => handleInputChange("irrigationType", value)}
              >
                <SelectTrigger id="irrigationType">
                  <SelectValue placeholder="Select irrigation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drip">Drip Irrigation</SelectItem>
                  <SelectItem value="sprinkler">Sprinkler</SelectItem>
                  <SelectItem value="flood">Flood/Basin</SelectItem>
                  <SelectItem value="rainfed">Rainfed</SelectItem>
                  <SelectItem value="tubewell">Tubewell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab 2: Crop Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wheat className="h-5 w-5 text-primary" />
            Crop Information
          </CardTitle>
          <CardDescription>Details about your current or planned crop</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cropType">Crop Type</Label>
            <Select 
              value={formData.cropType} 
              onValueChange={(value) => handleInputChange("cropType", value)}
            >
              <SelectTrigger id="cropType">
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mustard">Mustard</SelectItem>
                <SelectItem value="soybean">Soybean</SelectItem>
                <SelectItem value="sunflower">Sunflower</SelectItem>
                <SelectItem value="groundnut">Groundnut</SelectItem>
                <SelectItem value="sesame">Sesame</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cropVariety">Crop Variety</Label>
            <Input
              id="cropVariety"
              placeholder="e.g., Pusa Bold, JS 335"
              value={formData.cropVariety}
              onChange={(e) => handleInputChange("cropVariety", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sowingDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Sowing Date
              </Label>
              <Input
                id="sowingDate"
                type="date"
                value={formData.sowingDate}
                onChange={(e) => handleInputChange("sowingDate", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="expectedHarvestDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Expected Harvest
              </Label>
              <Input
                id="expectedHarvestDate"
                type="date"
                value={formData.expectedHarvestDate}
                onChange={(e) => handleInputChange("expectedHarvestDate", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="fertilizerUsed">Fertilizer Details</Label>
            <Textarea
              id="fertilizerUsed"
              placeholder="e.g., DAP 50kg, Urea 30kg per acre"
              value={formData.fertilizerUsed}
              onChange={(e) => handleInputChange("fertilizerUsed", e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="pesticideUsed">Pesticide & Insecticide Details</Label>
            <Textarea
              id="pesticideUsed"
              placeholder="e.g., Chlorpyrifos 20 EC, 500ml per acre"
              value={formData.pesticideUsed}
              onChange={(e) => handleInputChange("pesticideUsed", e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tab 3: Field Data (Manual + Sensor) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-primary" />
            Field Data (Manual + Sensor)
          </CardTitle>
          <CardDescription>Soil health, observations, and field photos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="soilType">Soil Type</Label>
            <Select 
              value={formData.soilType} 
              onValueChange={(value) => handleInputChange("soilType", value)}
            >
              <SelectTrigger id="soilType">
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="loamy">Loamy</SelectItem>
                <SelectItem value="clayey">Clayey</SelectItem>
                <SelectItem value="alluvial">Alluvial</SelectItem>
                <SelectItem value="red">Red Soil</SelectItem>
                <SelectItem value="black">Black Soil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="soilPH">Soil pH</Label>
              <Input
                id="soilPH"
                type="number"
                step="0.1"
                placeholder="6.5"
                value={formData.soilPH}
                onChange={(e) => handleInputChange("soilPH", e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Range: 4.0 - 9.0</p>
            </div>

            <div>
              <Label htmlFor="soilMoisture" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Soil Moisture %
              </Label>
              <Input
                id="soilMoisture"
                type="number"
                placeholder="45"
                value={formData.soilMoisture}
                onChange={(e) => handleInputChange("soilMoisture", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ndviReading" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              NDVI Reading
              <Badge variant="secondary" className="text-xs">Auto</Badge>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="ndviReading"
                value={formData.ndviReading}
                readOnly
                className="font-mono"
              />
              <Badge 
                variant="outline" 
                className={
                  parseFloat(formData.ndviReading) > 0.6 
                    ? "bg-green-50 text-green-700 dark:bg-green-950" 
                    : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950"
                }
              >
                {parseFloat(formData.ndviReading) > 0.6 ? "Healthy" : "Monitor"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Updated from satellite imagery (last update: 2 days ago)
            </p>
          </div>

          <div>
            <Label htmlFor="observedIssues">Observed Issues</Label>
            <Textarea
              id="observedIssues"
              placeholder="Describe any pest attacks, diseases, yellowing leaves, etc."
              value={formData.observedIssues}
              onChange={(e) => handleInputChange("observedIssues", e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Camera className="h-4 w-4" />
              Field Photos ({uploadedImages.length}/3)
            </Label>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="h-4 w-4 animate-pulse text-blue-600" />
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-muted">
                      <Image
                        src={img.url}
                        alt={img.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(img.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {uploadedImages.length < 3 && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="field-images"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label htmlFor="field-images" className="cursor-pointer">
                  <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload field photos
                  </p>
                  <Button variant="outline" size="sm" type="button">
                    Choose Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Max 3 images, 5MB each
                  </p>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tab 4: External Sync (Auto) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudSun className="h-5 w-5 text-primary" />
            External Data Sync
            <Badge variant="outline" className="text-xs">Auto</Badge>
          </CardTitle>
          <CardDescription>Weather, market, and satellite data integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CloudSun className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Weather Data</p>
                  <p className="text-xs text-muted-foreground">IMD & OpenWeather API</p>
                </div>
              </div>
              <Badge variant={formData.weatherSync ? "default" : "secondary"}>
                {formData.weatherSync ? "Synced" : "Pending"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Market Prices</p>
                  <p className="text-xs text-muted-foreground">AGMARKNET Live Data</p>
                </div>
              </div>
              <Badge variant={formData.marketSync ? "default" : "secondary"}>
                {formData.marketSync ? "Synced" : "Pending"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Leaf className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">Satellite Imagery</p>
                  <p className="text-xs text-muted-foreground">Sentinel-2 NDVI</p>
                </div>
              </div>
              <Badge variant={formData.satelliteSync ? "default" : "secondary"}>
                {formData.satelliteSync ? "Synced" : "Pending"}
              </Badge>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSyncData}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <>
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                Syncing...
              </>
            ) : (
              <>
                <CloudSun className="h-4 w-4 mr-2" />
                Sync All External Data
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Data auto-syncs every 6 hours. Last sync: 2 hours ago
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 sticky bottom-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 -mx-6 -mb-6 border-t">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button 
          className="flex-1"
          onClick={handleGenerateRecommendations}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Get Recommendations
        </Button>
      </div>
    </div>
  )
}
