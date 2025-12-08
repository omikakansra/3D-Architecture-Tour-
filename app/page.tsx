"use client"

/**
 * Home Page - Entry point for the 3D Architecture Tour application
 * COSC3306 Final Course Project
 *
 * Uses dynamic import to load the 3D scene component client-side only,
 * as Three.js requires browser APIs not available during server-side rendering.
 */

import dynamic from "next/dynamic"

// Dynamically import Scene3D with SSR disabled
// This prevents Three.js from running on the server
const Scene3D = dynamic(() => import("@/components/scene-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">Loading 3D Scene...</div>
  ),
})

/**
 * Home - Main page component
 * Renders the full-screen 3D architecture visualization
 */
export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <Scene3D />
    </main>
  )
}
