import type React from "react"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/context/user-context"
import { PilotPointsProvider } from "@/hooks/use-pilot-points"
import { Navbar } from "@/components/navbar"
import { LightingCursor } from "@/components/lighting-cursor"
import { Footer } from "@/components/footer"
import Script from "next/script"
import "@/app/globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Optimize font loading
})

export const metadata: Metadata = {
  title: "EduPilot - Your AI Study Companion",
  description: "An AI-powered educational app to help you study smarter",
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to API domains to improve performance */}
        <link rel="preconnect" href="https://openrouter.ai" />
        <link rel="dns-prefetch" href="https://openrouter.ai" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <PilotPointsProvider>
              <LightingCursor />
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </PilotPointsProvider>
          </UserProvider>
        </ThemeProvider>

        {/* Defer non-critical JavaScript */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX" strategy="lazyOnload" />
      </body>
    </html>
  )
}
