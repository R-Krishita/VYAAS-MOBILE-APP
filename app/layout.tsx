import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { I18nProvider } from "@/components/i18n-provider"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Smart Ayurvedic Crop Advisor",
  description: "AI-powered farming guidance for better yields",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </I18nProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
