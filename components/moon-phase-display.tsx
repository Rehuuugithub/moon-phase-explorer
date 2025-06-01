"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface MoonPhaseDisplayProps {
  phase: string
  illumination: number
  phaseAngle: number
  date: string
}

export function MoonPhaseDisplay({ phase, illumination, phaseAngle, date }: MoonPhaseDisplayProps) {
  const [moonImageUrl, setMoonImageUrl] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMoonImage = async () => {
      setLoading(true)
      setError("")

      try {
        const selectedDate = new Date(date)
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
        const day = String(selectedDate.getDate()).padStart(2, "0")
        const formattedDate = `${year}-${month}-${day}`

        // Try NASA APOD API first
        const nasaApiKey = process.env.NEXT_PUBLIC_NASA_API_KEY
        if (nasaApiKey) {
          try {
            const apodResponse = await fetch(
              `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&date=${formattedDate}`,
            )
            const apodData = await apodResponse.json()

            // If it's a moon-related image, use it
            if (
              apodData.url &&
              (apodData.title?.toLowerCase().includes("moon") || apodData.explanation?.toLowerCase().includes("moon"))
            ) {
              setMoonImageUrl(apodData.url)
              setLoading(false)
              return
            }
          } catch (error) {
            console.log("APOD API didn't return moon image, trying alternative...")
          }
        }

        // Fallback to NASA's Lunar Reconnaissance Orbiter images
        // Using NASA's image and video library
        const searchQuery = `moon phase ${phase.toLowerCase()}`
        const nasaSearchResponse = await fetch(
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchQuery)}&media_type=image&page=1&page_size=10`,
        )
        const searchData = await nasaSearchResponse.json()

        if (searchData.collection?.items?.length > 0) {
          // Get a random moon image from the results
          const randomIndex = Math.floor(Math.random() * Math.min(5, searchData.collection.items.length))
          const selectedItem = searchData.collection.items[randomIndex]

          if (selectedItem.links?.[0]?.href) {
            setMoonImageUrl(selectedItem.links[0].href)
            setLoading(false)
            return
          }
        }

        // Final fallback to high-quality moon phase images
        const phaseImageMap: { [key: string]: string } = {
          "New Moon": "https://tse2.mm.bing.net/th?id=OIP.eCSzQqyDdJMd7BSG2aaCKwHaHa&pid=Api&P=0&h=220",
          "Waxing Crescent": "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQzNi0xLWdzZmNfMjAxNzEyMDhfYXJjaGl2ZV9lMDAwODY1LmpwZw.jpg",
          "First Quarter": "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg",
          "Waxing Gibbous": "https://images-assets.nasa.gov/image/PIA00304/PIA00304~medium.jpg",
          "Full Moon": "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg",
          "Waning Gibbous": "https://images-assets.nasa.gov/image/PIA00304/PIA00304~medium.jpg",
          "Last Quarter": "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg",
          "Waning Crescent": "https://live.staticflickr.com/7084/6880158358_fddfdcfb8f_b.jpg",
        }

        const imageUrl = phaseImageMap[phase] || phaseImageMap["Full Moon"]
        setMoonImageUrl(imageUrl)
      } catch (err) {
        console.error("Error fetching moon image:", err)
        setError("Failed to load moon image")
        // Ultimate fallback
        setMoonImageUrl("https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg")
      } finally {
        setLoading(false)
      }
    }

    if (date && phase) {
      fetchMoonImage()
    }
  }, [date, phase])

  if (loading) {
    return (
      <div className="relative w-full aspect-square max-w-[300px] flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-white/10 animate-pulse flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative w-full aspect-square max-w-[300px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">🌙</div>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-square max-w-[300px]">
      {/* Glow effects */}
      <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse-glow"></div>
      <div className="absolute inset-4 rounded-full bg-white/10 blur-lg animate-pulse-glow-delayed"></div>

      {/* Moon image container */}
      <div className="relative w-full h-full rounded-full overflow-hidden animate-gentle-float">
        <Image
          src={moonImageUrl || "/placeholder.svg"}
          alt={`${phase} on ${date}`}
          fill
          className="object-cover transition-all duration-500 hover:scale-105"
          crossOrigin="anonymous"
        />

        {/* Overlay for additional glow */}
        <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent"></div>
      </div>

      {/* Download button */}
      {moonImageUrl && (
        <div className="flex justify-center mt-4">
          <a
            href={moonImageUrl}
            download={`moon-${date}.jpg`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-glow"
          >
            Download Image
          </a>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }
        @keyframes pulse-glow-delayed {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-pulse-glow-delayed {
          animation: pulse-glow-delayed 3s ease-in-out infinite 1.5s;
        }
        .animate-gentle-float {
          animation: gentle-float 4s ease-in-out infinite;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}
