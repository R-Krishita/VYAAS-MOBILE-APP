"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { User, MapPin, Phone, Mail, Settings, HelpCircle, LogOut, Award, Globe, Moon, Sun } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "next-themes"
import { toast } from "sonner"

const translations = {
  en: {
    profile: "Profile",
    manageAccount: "Manage your account and preferences",
    farmerSince: "Farmer since 2015",
    verified: "Verified",
    farmDetails: "Farm Details",
    farmInfo: "Your registered farm information",
    totalArea: "Total Area",
    soilType: "Soil Type",
    primaryCrops: "Primary Crops",
    irrigation: "Irrigation",
    achievements: "Achievements",
    soilHealthChampion: "Soil Health Champion",
    soilHealthDesc: "Maintained 85%+ soil health for 6 months",
    smartFarmer: "Smart Farmer",
    smartFarmerDesc: "Used 10+ recommendations successfully",
    language: "Language",
    settings: "Settings",
    helpSupport: "Help & Support",
    signOut: "Sign Out",
  },
  hi: {
    profile: "प्रोफ़ाइल",
    manageAccount: "अपना खाता और प्राथमिकताएं प्रबंधित करें",
    farmerSince: "2015 से किसान",
    verified: "सत्यापित",
    farmDetails: "खेत का विवरण",
    farmInfo: "आपकी पंजीकृत खेत की जानकारी",
    totalArea: "कुल क्षेत्र",
    soilType: "मिट्टी का प्रकार",
    primaryCrops: "मुख्य फसलें",
    irrigation: "सिंचाई",
    achievements: "उपलब्धियां",
    soilHealthChampion: "मिट्टी स्वास्थ्य चैंपियन",
    soilHealthDesc: "6 महीने तक 85%+ मिट्टी स्वास्थ्य बनाए रखा",
    smartFarmer: "स्मार्ट किसान",
    smartFarmerDesc: "10+ सिफारिशों का सफलतापूर्वक उपयोग किया",
    language: "भाषा",
    settings: "सेटिंग्स",
    helpSupport: "सहायता और समर्थन",
    signOut: "साइन आउट",
  },
  or: {
    profile: "ପ୍ରୋଫାଇଲ୍",
    manageAccount: "ଆପଣଙ୍କ ଖାତା ଏବଂ ପସନ୍ଦ ପରିଚାଳନା କରନ୍ତୁ",
    farmerSince: "2015 ରୁ କୃଷକ",
    verified: "ଯାଞ୍ଚିତ",
    farmDetails: "ଚାଷ ବିବରଣୀ",
    farmInfo: "ଆପଣଙ୍କର ପଞ୍ଜୀକୃତ ଚାଷ ସୂଚନା",
    totalArea: "ମୋଟ କ୍ଷେତ୍ର",
    soilType: "ମାଟି ପ୍ରକାର",
    primaryCrops: "ମୁଖ୍ୟ ଫସଲ",
    irrigation: "ଜଳସେଚନ",
    achievements: "ସଫଳତା",
    soilHealthChampion: "ମାଟି ସ୍ୱାସ୍ଥ୍ୟ ଚାମ୍ପିଅନ୍",
    soilHealthDesc: "6 ମାସ ପାଇଁ 85%+ ମାଟି ସ୍ୱାସ୍ଥ୍ୟ ବଜାୟ ରଖିଛନ୍ତି",
    smartFarmer: "ସ୍ମାର୍ଟ କୃଷକ",
    smartFarmerDesc: "10+ ସୁପାରିଶ ସଫଳତାର ସହିତ ବ୍ୟବହାର କରିଛନ୍ତି",
    language: "ଭାଷା",
    settings: "ସେଟିଂସ୍",
    helpSupport: "ସହାୟତା ଏବଂ ସମର୍ଥନ",
    signOut: "ସାଇନ୍ ଆଉଟ୍",
  },
}

export function ProfileTab() {
  const { language, setLanguage, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t.profile}</h2>
        <p className="text-muted-foreground">{t.manageAccount}</p>
      </div>

      {/* User Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Rajesh Kumar</h3>
              <p className="text-sm text-muted-foreground">{t.farmerSince}</p>
              <Badge className="bg-green-100 text-green-800 mt-1">{t.verified}</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Village Rampur, District Meerut, UP</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>rajesh.kumar@email.com</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {t.language}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
              <SelectItem value="or">ଓଡ଼ିଆ (Odia)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Farm Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t.farmDetails}</CardTitle>
          <CardDescription>{t.farmInfo}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t.totalArea}</p>
              <p className="font-medium">5.2 hectares</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.soilType}</p>
              <p className="font-medium">Alluvial</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.primaryCrops}</p>
              <p className="font-medium">Wheat, Rice</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.irrigation}</p>
              <p className="font-medium">Tube well</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            {t.achievements}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{t.soilHealthChampion}</p>
                <p className="text-xs text-muted-foreground">{t.soilHealthDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{t.smartFarmer}</p>
                <p className="text-xs text-muted-foreground">{t.smartFarmerDesc}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <div>
                <Label htmlFor="dark-mode" className="text-sm font-medium cursor-pointer">
                  Dark Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  {theme === "dark" ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => {
                setTheme(checked ? "dark" : "light")
                toast.success(`${checked ? "Dark" : "Light"} mode activated`)
              }}
            />
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <Label className="text-sm font-medium">
                  {t.language}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred language
                </p>
              </div>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="or">ଓଡ଼ିଆ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Menu Options */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
          <HelpCircle className="h-4 w-4 mr-3" />
          {t.helpSupport}
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
          size="lg"
          onClick={() => {
            signOut()
            toast.info("Signed out successfully")
          }}
        >
          <LogOut className="h-4 w-4 mr-3" />
          {t.signOut}
        </Button>
      </div>
    </div>
  )
}
