"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { ArrowLeft } from "lucide-react"

interface AuthPageProps {
  onAuthSuccess: () => void
  onBack: () => void
}

export function AuthPage({ onAuthSuccess, onBack }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup" | "otp">("login")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    otp: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.phone) {
      setMode("otp")
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.firstName && formData.lastName && formData.address && formData.phone) {
      setMode("otp")
    }
  }

  const handleOtpVerification = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.otp.length === 6) {
      onAuthSuccess()
    }
  }

  const handleOtpChange = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      handleInputChange("otp", value)
    }
  }

  const handleBackClick = () => {
    if (mode === "otp") {
      setMode("login")
    } else {
      onBack()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Navbar showAuthButton={false} />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={handleBackClick} className="p-0 h-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {mode === "login" && (
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to your Vyaas account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Continue
                </Button>
                <div className="text-center">
                  <Button type="button" variant="link" onClick={() => setMode("signup")} className="text-sm">
                    Don't have an account? Sign up
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {mode === "signup" && (
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Join Vyaas to start smart farming</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Your address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
                <div className="text-center">
                  <Button type="button" variant="link" onClick={() => setMode("login")} className="text-sm">
                    Already have an account? Sign in
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {mode === "otp" && (
          <Card>
            <CardHeader>
              <CardTitle>Verify Phone</CardTitle>
              <CardDescription>Enter the 6-digit code sent to {formData.phone}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpVerification} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={formData.otp}
                    onChange={(e) => handleOtpChange(e.target.value)}
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={formData.otp.length !== 6}>
                  Verify
                </Button>
                <div className="text-center">
                  <Button type="button" variant="link" className="text-sm">
                    Resend code
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
