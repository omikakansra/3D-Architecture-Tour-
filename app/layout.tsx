import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

// importing the google fonts
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// this metadata obj. is used by next.js for seo and browser info like the page title and description
export const metadata: Metadata = {
  title: "COSC3306 - Interactive 3D Architecture Tour", // title of our project
  description: "3D Architecture environment with Two Rooms, Furniture, Animations, and Camera Controls", // description
}

// main root component, setting the html structure and making sure the child components render properly
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
    // webpage lang: english
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

