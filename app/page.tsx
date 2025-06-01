"use client"

import Link from "next/link"
import { MoonAnimation } from "@/components/moon-animation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1A2E] to-[#16213E] text-white">
      {/* Header */}
      <header className="fixed w-full z-20 bg-[#1A1A2E]/80 backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight hover:text-opacity-80 transition-all duration-300 drop-shadow-md">
            Cosmic Echoes
          </h1>
          <Link href="/results">
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              Discover Your Moon
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#1A1A2E]/80 z-10"></div>
          <div className="stars-container absolute inset-0"></div>
        </div>

        <div className="z-10 text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Discover the Moon on Your Special Day</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in-delay">
            Enter your date of birth to see the moon's phase and learn about the night sky on that day.
          </p>
          <Link href="/results">
            <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-6 text-lg rounded-full animate-pulse-slow shadow-glow">
              Find Your Moon
            </Button>
          </Link>
        </div>

        <div className="relative w-full max-w-md aspect-square mx-auto z-0">
          <MoonAnimation />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-[#16213E]/80">
        <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Cosmic Echoes</h2>
        <p className="text-lg text-center text-gray-300 mb-12">
            Enter your date of birth to see the moon's phase and learn about the night sky on that day. Discover the
            celestial conditions that welcomed you to this world.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              {
                name: "New Moon",
                emoji: "🌑",
                image: "https://tse2.mm.bing.net/th?id=OIP.eCSzQqyDdJMd7BSG2aaCKwHaHa&pid=Api&P=0&h=220",
              },
              {
                name: "Waxing Crescent",
                emoji: "🌒",
                image: "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQzNi0xLWdzZmNfMjAxNzEyMDhfYXJjaGl2ZV9lMDAwODY1LmpwZw.jpg",
              },
              {
                name: "First Quarter",
                emoji: "🌓",
                image: "https://images-assets.nasa.gov/image/PIA00302/PIA00302~thumb.jpg",
              },
              {
                name: "Waxing Gibbous",
                emoji: "🌔",
                image: "https://images-assets.nasa.gov/image/PIA00304/PIA00304~thumb.jpg",
              },
              {
                name: "Full Moon",
                emoji: "🌕",
                image: "https://images-assets.nasa.gov/image/PIA00302/PIA00302~thumb.jpg",
              },
              {
                name: "Waning Gibbous",
                emoji: "🌖",
                image: "https://images-assets.nasa.gov/image/PIA00304/PIA00304~thumb.jpg",
              },
              {
                name: "Last Quarter",
                emoji: "🌗",
                image: "https://images-assets.nasa.gov/image/PIA00302/PIA00302~thumb.jpg",
              },
              {
                name: "Waning Crescent",
                emoji: "🌘",
                image: "https://live.staticflickr.com/7084/6880158358_fddfdcfb8f_b.jpg",
              },
            ].map((phase, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-800 flex items-center justify-center mb-3 relative overflow-hidden shadow-glow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow">
                  <Image
                    src={phase.image || "/placeholder.svg"}
                    alt={phase.name}
                    width={80}
                    height={80}
                    className="object-cover rounded-full"
                    crossOrigin="anonymous"
                  />
                </div>
                <p className="text-sm text-center group-hover:text-white transition-colors duration-300">
                  {phase.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
        .shadow-glow-sm {
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.1);
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1.5s ease-out 0.5s forwards;
          opacity: 0;
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s infinite;
        }
        .underline-animation {
          position: relative;
        }
        .underline-animation::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: white;
          transition: width 0.3s;
        }
        .underline-animation:hover::after {
          width: 100%;
        }
        .stars-container {
          background-image: radial-gradient(2px 2px at 20px 30px, white, rgba(0, 0, 0, 0)),
                            radial-gradient(2px 2px at 40px 70px, white, rgba(0, 0, 0, 0)),
                            radial-gradient(2px 2px at 50px 160px, white, rgba(0, 0, 0, 0)),
                            radial-gradient(2px 2px at 90px 40px, white, rgba(0, 0, 0, 0)),
                            radial-gradient(2px 2px at 130px 80px, white, rgba(0, 0, 0, 0)),
                            radial-gradient(2px 2px at 160px 120px, white, rgba(0, 0, 0, 0));
          background-repeat: repeat;
          background-size: 200px 200px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSlow {
          0% { box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.1); }
          50% { box-shadow: 0 0 20px 8px rgba(255, 255, 255, 0.2); }
          100% { box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.1); }
        }
        .moon-phase-1 { background: #222; border-radius: 50%; width: 100%; height: 100%; }
        .moon-phase-2 { background: linear-gradient(90deg, #222 50%, #ddd 50%); border-radius: 50%; width: 100%; height: 100%; }
        .moon-phase-3 { background: linear-gradient(90deg, #222 0%, #ddd 0%); border-radius: 50%; width: 100%; height: 100%; }
        .moon-phase-4 { background: linear-gradient(270deg, #222 25%, #ddd 25%); border-radius: 50%; width: 100%; height: 100%; }
        .moon-phase-5 { background: #ddd; border-radius: 50%; width: 100%; height: 100%; }
        .moon-phase-6 { background: linear-gradient(90deg, #ddd 75%, #222 75%); border-radius: 50%; width: 100%; height: 100%; }
        .moon-phase-7 { background: linear-gradient(90deg, #ddd 50%, #222 50%); border-radius: 50%; width: 100%; height: 100%; }
        .moon-phase-8 { background: linear-gradient(270deg, #ddd 25%, #222 75%); border-radius: 50%; width: 100%; height: 100%; }
      `}</style>
    </div>
  )
}
