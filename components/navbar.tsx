"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

interface NavbarProps {
  onAuthClick?: () => void
}

export function Navbar({ onAuthClick }: NavbarProps) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">Vyaas</h1>
      {!isAuthenticated && (
        <Button variant="secondary" size="sm" onClick={onAuthClick} className="bg-white text-primary hover:bg-gray-100">
          Login
        </Button>
      )}
    </div>
  )
}
