"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { FaPlay, FaDiscord, FaTwitter, FaInstagram } from "react-icons/fa"
import { Button } from "@/components/ui/button"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Placeholder video URLs - replace with actual gaming videos
const HERO_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
]

const FEATURE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
]

interface LandingPageProps {
  onEnterApp: () => void
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const miniVideoRef = useRef<HTMLVideoElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [navVisible, setNavVisible] = useState(true)
  const [audioPlaying, setAudioPlaying] = useState(false)

  // Audio visualizer animation
  const audioVisualizerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    // Hero section animations
    gsap.fromTo(".hero-heading", 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
    )

    gsap.fromTo(".hero-cta", 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1 }
    )

    // About section scroll animation
    ScrollTrigger.create({
      trigger: ".about-section",
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(".about-title", 
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        )
        
        gsap.fromTo(".about-image", 
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.3 }
        )
      }
    })

    // Features section animations
    ScrollTrigger.create({
      trigger: ".features-section",
      start: "top 70%",
      onEnter: () => {
        gsap.fromTo(".feature-card", 
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.2 }
        )
      }
    })

    // Story section animations
    ScrollTrigger.create({
      trigger: ".story-section",
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(".story-content", 
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        )
      }
    })

    // Navigation scroll behavior
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (self.direction === -1) {
          setNavVisible(true)
        } else if (self.progress > 0.1) {
          setNavVisible(false)
        }
      }
    })

    // Audio visualizer animation
    if (audioVisualizerRef.current) {
      const bars = audioVisualizerRef.current.children
      gsap.to(bars, {
        scaleY: () => Math.random() * 2 + 0.5,
        duration: 0.3,
        repeat: -1,
        yoyo: true,
        stagger: 0.1,
        ease: "power2.inOut"
      })
    }

  }, { scope: containerRef })

  // Handle video cycling
  const cycleVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % HERO_VIDEOS.length
    setCurrentVideoIndex(nextIndex)
  }

  // Handle video loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Mouse move effect for story section
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    gsap.to(e.currentTarget.querySelector('.story-image'), {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-violet-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#dfdff0] overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        navVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="text-2xl font-bold text-white">
                ZENTRY
              </div>

              {/* Navigation Items */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
                <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
                <a href="#story" className="text-white/80 hover:text-white transition-colors">Story</a>
                <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
              </div>

              {/* Audio Visualizer */}
              <div 
                ref={audioVisualizerRef}
                className="flex items-end space-x-1 cursor-pointer"
                onClick={() => setAudioPlaying(!audioPlaying)}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-white rounded-full"
                    style={{ height: `${Math.random() * 20 + 10}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Video */}
        <video
          ref={heroVideoRef}
          key={currentVideoIndex}
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={HERO_VIDEOS[currentVideoIndex]} type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          {/* Mini Video Preview */}
          <div 
            className="mb-8 cursor-pointer transform hover:scale-110 transition-transform duration-300"
            onClick={cycleVideo}
          >
            <video
              ref={miniVideoRef}
              autoPlay
              muted
              loop
              className="w-32 h-32 rounded-full object-cover border-4 border-white/30"
            >
              <source src={HERO_VIDEOS[(currentVideoIndex + 1) % HERO_VIDEOS.length]} type="video/mp4" />
            </video>
          </div>

          {/* Hero Text */}
          <h1 className="hero-heading text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-wider">
            GAMING
          </h1>

          {/* CTA Button */}
          <div className="hero-cta">
            <Button
              onClick={onEnterApp}
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <FaPlay className="mr-3" />
              Watch Trailer
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="about-title text-4xl md:text-6xl font-bold text-black mb-6">
                Discover the world's largest shared adventure
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Enter a realm where reality and imagination converge. Experience the future of gaming 
                with our revolutionary metaverse platform that connects millions of players worldwide 
                in an ever-evolving digital universe.
              </p>
            </div>
            <div className="about-image">
              <img
                src="https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Gaming World"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-16">
            Explore Our Universe
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Radiant", desc: "Immersive VR experiences", video: FEATURE_VIDEOS[0] },
              { title: "Zigma", desc: "AI-powered companions", video: FEATURE_VIDEOS[1] },
              { title: "Nexus", desc: "Cross-platform connectivity", video: FEATURE_VIDEOS[2] },
              { title: "Azul", desc: "Infinite world generation", video: FEATURE_VIDEOS[3] },
              { title: "Quantum", desc: "Real-time physics engine", video: FEATURE_VIDEOS[4] },
              { title: "Ethereal", desc: "Blockchain integration", video: FEATURE_VIDEOS[0] }
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card group relative overflow-hidden rounded-2xl bg-gray-900 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ height: '300px' }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                >
                  <source src={feature.video} type="video/mp4" />
                </video>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 mb-4">{feature.desc}</p>
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white hover:text-black transition-all"
                  >
                    Coming Soon
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section py-20 px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="story-content"
            onMouseMove={handleMouseMove}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget.querySelector('.story-image'), {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out"
              })
            }}
          >
            <div className="story-image mb-12 perspective-1000">
              <img
                src="https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Story Entrance"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl transform-gpu"
              />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              The Story Begins
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Embark on an epic journey through realms unknown. Your adventure awaits 
              in a world where every choice shapes the destiny of countless others.
            </p>
            
            <Button
              onClick={onEnterApp}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 text-lg rounded-full font-bold transition-all duration-300 transform hover:scale-105"
            >
              Discover Prologue
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-[#dfdff0]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-black mb-8">
                Join the Adventure
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Ready to step into the future of gaming? Connect with millions of players 
                and begin your journey in our revolutionary metaverse.
              </p>
              <Button
                onClick={onEnterApp}
                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Enter the Game
              </Button>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Gaming Character"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white text-2xl font-bold mb-4 md:mb-0">
              ZENTRY
            </div>
            
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <FaDiscord className="text-white/60 hover:text-white cursor-pointer transition-colors" size={24} />
              <FaTwitter className="text-white/60 hover:text-white cursor-pointer transition-colors" size={24} />
              <FaInstagram className="text-white/60 hover:text-white cursor-pointer transition-colors" size={24} />
            </div>
            
            <div className="text-white/60 text-sm">
              © 2024 Zentry. All rights reserved.
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <div className="flex flex-wrap justify-center space-x-6 text-white/60 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}