"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface CurrentMoonData {
  phase: string
  illumination: number
  imageUrl: string
}

export function RealTimeMoon() {
  const [currentMoon, setCurrentMoon] = useState<CurrentMoonData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentMoonPhase = async () => {
      try {
        // Get current moon phase from API
        const response = await fetch("https://api.farmsense.net/v1/moonphases/?d=1")
        const data = await response.json()

        if (data && data.length > 0) {
          const currentPhase = data[0]

          // Get NASA image for current phase
          const nasaApiKey = process.env.NEXT_PUBLIC_NASA_API_KEY
          let imageUrl = "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg" // fallback

          if (nasaApiKey) {
            try {
              const searchResponse = await fetch(
                `https://images-api.nasa.gov/search?q=moon%20${currentPhase.Phase}&media_type=image&page=1&page_size=5`,
              )
              const searchData = await searchResponse.json()

              if (searchData.collection?.items?.length > 0) {
                imageUrl = searchData.collection.items[0].links?.[0]?.href || imageUrl
              }
            } catch (error) {
              console.log("Using fallback image")
            }
          }

          setCurrentMoon({
            phase: currentPhase.Phase,
            illumination: currentPhase.Illumination,
            imageUrl: imageUrl,
          })
        }
      } catch (error) {
        console.error("Error fetching current moon phase:", error)
        // Fallback to default
        setCurrentMoon({
          phase: "Full Moon",
          illumination: 1,
          imageUrl: "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentMoonPhase()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-white/10 animate-pulse"></div>
      </div>
    )
  }

  if (!currentMoon) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">🌙</div>
          <p className="text-sm">Unable to load current moon</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Glow effects */}
        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse-glow"></div>
        <div className="absolute inset-4 rounded-full bg-white/10 blur-lg animate-pulse-glow-delayed"></div>

        {/* Current moon image */}
        <div className="relative w-full h-full rounded-full overflow-hidden animate-float">
          <Image
            src={currentMoon.imageUrl || "/placeholder.svg"}
            alt={`Current ${currentMoon.phase}`}
            fill
            className="object-cover transition-opacity duration-1000"
            crossOrigin="anonymous"
          />
        </div>

        {/* Phase info overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
          <p className="text-sm text-white font-medium text-center">
            Current: {currentMoon.phase}
            <br />
            <span className="text-xs text-gray-300">{(currentMoon.illumination * 100).toFixed(0)}% illuminated</span>
          </p>
        </div>

        {/* Additional glow overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/5 via-transparent to-transparent animate-pulse-slow"></div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes pulse-glow-delayed {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .animate-pulse-glow-delayed {
          animation: pulse-glow-delayed 4s ease-in-out infinite 1s;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}
