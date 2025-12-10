"use client"
// client component as page depends on browser only features.
/*
 * we're using dynamic import to make sure the 3d scene is only loaded on client side.
 * sinec three.js depends on browser api that dont work on server side
 */

import dynamic from "next/dynamic"

// import scene3d and ssr turned off
// makes sure three.js logic runs only in the browser not on server
const Scene3D = dynamic(() => import("@/components/scene-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">Loading 3D Scene...</div>
  ),
})

/*
Home - Main page component
Renders the full-screen 3D architecture visualization
 */
export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <Scene3D />
    </main>
  )
}
