import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

// Initialize fonts
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// Page metadata for SEO
export const metadata: Metadata = {
  title: "COSC3306 - Interactive 3D Architecture Tour",
  description: "3D Architecture environment with Two Rooms, Furniture, Animations, and Camera Controls",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
