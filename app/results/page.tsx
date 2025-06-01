"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoonPhaseDisplay } from "@/components/moon-phase-display"
import { Loader2 } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface MoonData {
  phase: string
  illumination: number
  age: number
  phaseAngle: number
}

interface WeatherData {
  temperature: number
  conditions: string
  cloudCover: number
}

// Add this helper function before the component
function calculateMoonPhase(date: Date): number {
  // More accurate moon phase calculation
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  // Julian day calculation
  const a = Math.floor((14 - month) / 12)
  const y = year - a
  const m = month + 12 * a - 3

  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045

  // Days since known new moon (January 6, 2000)
  const daysSinceNewMoon = jd - 2451549.5

  // Moon cycle is approximately 29.53059 days
  return daysSinceNewMoon % 29.53059
}

export default function ResultsPage() {
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [moonData, setMoonData] = useState<MoonData | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const isMobile = useMobile()

  const handleSubmit = async () => {
    if (!date) {
      setError("Please enter your date of birth")
      return
    }

    const selectedDate = new Date(date)
    const today = new Date()
    if (selectedDate > today) {
      setError("Date cannot be in the future")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Use real moon phase API
      const year = selectedDate.getFullYear()
      const month = selectedDate.getMonth() + 1
      const day = selectedDate.getDate()

      // Try FarmSense Moon Phase API (free)
      try {
        const moonResponse = await fetch(
          `https://api.farmsense.net/v1/moonphases/?d=${selectedDate.getTime()}`, // Using timestamp
        )
        const moonApiData = await moonResponse.json()

        if (moonApiData && moonApiData.length > 0) {
          // Find the closest date to our selected date
          const targetTime = selectedDate.getTime()
          const closestPhase = moonApiData.reduce((prev: any, curr: any) => {
            return Math.abs(curr.Timestamp - targetTime) < Math.abs(prev.Timestamp - targetTime) ? curr : prev
          })

          setMoonData({
            phase: closestPhase.Phase || "Full Moon",
            illumination: closestPhase.Illumination || 1,
            age: Math.abs((targetTime - closestPhase.Timestamp) / (1000 * 60 * 60 * 24)),
            phaseAngle: (closestPhase.Illumination || 1) * 360,
          })
        } else {
          throw new Error("No moon data available")
        }
      } catch (moonError) {
        console.log("Moon API failed, using calculation fallback...")

        // Fallback to calculation
        const daysSinceNewMoon = calculateMoonPhase(selectedDate)
        const phaseIndex = Math.floor((daysSinceNewMoon / 29.53059) * 8) % 8
        const illumination = Math.abs(Math.cos((daysSinceNewMoon / 29.53059) * Math.PI * 2))

        const moonPhases = [
          "New Moon",
          "Waxing Crescent",
          "First Quarter",
          "Waxing Gibbous",
          "Full Moon",
          "Waning Gibbous",
          "Last Quarter",
          "Waning Crescent",
        ]

        setMoonData({
          phase: moonPhases[phaseIndex],
          illumination: illumination,
          age: daysSinceNewMoon,
          phaseAngle: (daysSinceNewMoon / 29.53059) * 360,
        })
      }

      // Try Visual Crossing Weather API for historical weather
      try {
        const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`

        // Note: You would need to add NEXT_PUBLIC_WEATHER_API_KEY for this to work
        // For now, we'll simulate the data
        const weatherConditions = ["Clear", "Partly Cloudy", "Cloudy", "Rain", "Snow"]
        const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

        setWeatherData({
          temperature: Math.floor(Math.random() * 30) + 5,
          conditions: randomCondition,
          cloudCover: Math.floor(Math.random() * 100),
        })
      } catch (weatherError) {
        console.log("Weather API failed, using simulated data...")

        const weatherConditions = ["Clear", "Partly Cloudy", "Cloudy", "Rain", "Snow"]
        const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

        setWeatherData({
          temperature: Math.floor(Math.random() * 30) + 5,
          conditions: randomCondition,
          cloudCover: Math.floor(Math.random() * 100),
        })
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1A2E] to-[#16213E] text-white">
      {/* Header */}
      <header className="fixed w-full z-10">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight hover:text-opacity-80 transition-all duration-300">
            Cosmic Echoes
          </h1>
          <Link href="/">
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              Back to Home
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Discover Your Birth Moon</h2>

          {/* Input Section */}
          <Card className="bg-[#1A1A2E]/60 border-white/10 shadow-glow mb-8">
            <CardHeader>
              <CardTitle>Enter Your Date of Birth</CardTitle>
              <CardDescription className="text-gray-400">
                Select the date to see the moon phase and weather on that day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-[#16213E] border-white/10 text-white"
                  max={new Date().toISOString().split("T")[0]}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Show My Moon"
                  )}
                </Button>
              </div>
              {error && <p className="text-red-400 mt-2">{error}</p>}
            </CardContent>
          </Card>

          {/* Results Section */}
          {moonData && weatherData && (
            <div className="animate-fade-in">
              <Card className="bg-[#1A1A2E]/60 border-white/10 shadow-glow mb-8 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-center p-6 bg-[#16213E]/50">
                    <MoonPhaseDisplay
                      phase={moonData.phase}
                      illumination={moonData.illumination}
                      phaseAngle={moonData.phaseAngle}
                      date={date}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4">{moonData.phase}</h3>
                    <p className="text-gray-300 mb-6">
                      On{" "}
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      , the moon was in its {moonData.phase.toLowerCase()} phase.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-1">Moon Details</h4>
                        <p className="text-sm text-gray-400">
                          Moon Age: {moonData.age.toFixed(1)} days
                          <br />
                          Illumination: {(moonData.illumination * 100).toFixed(0)}%
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-1">Weather Conditions</h4>
                        <p className="text-sm text-gray-400">
                          Temperature: {weatherData.temperature}°C
                          <br />
                          Conditions: {weatherData.conditions}
                          <br />
                          Cloud Cover: {weatherData.cloudCover}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="text-center">
                <p className="text-gray-400 mb-4">Want to explore another date?</p>
                <Button
                  onClick={() => {
                    setMoonData(null)
                    setWeatherData(null)
                  }}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/10"
                >
                  Try Another Date
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#1A1A2E]">
        <div className="container mx-auto text-center text-sm text-gray-400">
          <p>
            Cosmic Echoes • Data simulated for demonstration purposes • Created by
            <a
              href="https://www.instagram.com/raihan.cpp?igsh=MXc1ZmExcjUwMnFoeg=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white underline-animation ml-1"
            >
              Raihan
            </a>
          </p>
          <p>
            Data provided by{' '}
            <a href="#" className="text-gray-300 hover:text-white underline-animation">
              Astronomy API
            </a>{' '}
            and{' '}
            <a href="#" className="text-gray-300 hover:text-white underline-animation">
              Weather API
            </a>
          </p>
        </div>
      </footer>

      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.1);
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
