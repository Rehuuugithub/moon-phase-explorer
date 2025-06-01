"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function MoonAnimation() {
  const [currentPhase, setCurrentPhase] = useState(0) 

  // Array of real NASA moon phase images
  const moonPhases = [
    "https://tse2.mm.bing.net/th?id=OIP.eCSzQqyDdJMd7BSG2aaCKwHaHa&pid=Api&P=0&h=220", // New Moon
    "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQzNi0xLWdzZmNfMjAxNzEyMDhfYXJjaGl2ZV9lMDAwODY1LmpwZw.jpg", // Waxing Crescent
    "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg", // First Quarter
    "https://images-assets.nasa.gov/image/PIA20307/PIA20307~medium.jpg", // Waxing Gibbous
    "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg", // Full Moon
    "https://images-assets.nasa.gov/image/PIA00304/PIA00304~medium.jpg", // Waning Gibbous
    "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg", // Last Quarter
    "https://live.staticflickr.com/7084/6880158358_fddfdcfb8f_b.jpg", // Waning Crescent
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % moonPhases.length)
    }, 3000) // Change phase every 3 seconds

    return () => clearInterval(interval)
  }, [moonPhases.length])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse-glow"></div>
        <div className="absolute inset-4 rounded-full bg-white/10 blur-lg animate-pulse-glow-delayed"></div>

        {/* Moon image */}
        <div className="relative w-full h-full rounded-full overflow-hidden animate-float">
          <Image
            src={moonPhases[currentPhase] || "/placeholder.svg"}
            alt={`Moon phase ${currentPhase + 1}`}
            fill
            className="object-cover transition-opacity duration-1000"
            crossOrigin="anonymous"
          />
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
