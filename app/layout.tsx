import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/context/user-context"
import { PilotPointsProvider } from "@/hooks/use-pilot-points"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { LightingCursor } from "@/components/lighting-cursor"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EduPilot - AI-Powered Study Assistant",
  description:
    "Transform your learning experience with AI-powered study tools, mind maps, flashcards, and personalized learning analytics.",
  keywords: ["education", "AI", "study", "learning", "flashcards", "mind maps", "quiz", "analytics"],
  authors: [{ name: "EduPilot Team" }],
  creator: "EduPilot",
  publisher: "EduPilot",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "EduPilot - AI-Powered Study Assistant",
    description:
      "Transform your learning experience with AI-powered study tools, mind maps, flashcards, and personalized learning analytics.",
    url: "/",
    siteName: "EduPilot",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "EduPilot - AI-Powered Study Assistant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduPilot - AI-Powered Study Assistant",
    description:
      "Transform your learning experience with AI-powered study tools, mind maps, flashcards, and personalized learning analytics.",
    images: ["/placeholder.jpg"],
    creator: "@edupilot",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <PilotPointsProvider>
              <div className="relative min-h-screen">
                <AnimatedBackground />
                <LightingCursor />
                <div className="relative z-10">
                  <Navbar />
                  <main className="min-h-[calc(100vh-8rem)]">{children}</main>
                  <Footer />
                </div>
              </div>
              <Toaster />
            </PilotPointsProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
