'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Slide {
  id: number
  image: string
  title: string
  subtitle: string
  description: string
  cta: string
  link: string
}

interface ImageSliderProps {
  slides: Slide[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

export default function ImageSlider({ 
  slides, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: ImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [slides.length, isTransitioning])

  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [slides.length, isTransitioning])

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [currentSlide, isTransitioning])

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return

    const interval = setInterval(nextSlide, autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, nextSlide, slides.length])

  if (!slides || slides.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-r from-pink-100 to-yellow-100 flex items-center justify-center">
        <p className="text-gray-500">No slides available</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-300 ease-in-out",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Background - Using gradient since images might not exist */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-200 via-yellow-200 to-orange-200" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            
            {/* Slide Content */}
            <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 text-yellow-200 drop-shadow-md">
                  {slide.subtitle}
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
                  {slide.description}
                </p>
                <Link href={slide.link}>
                  <Button 
                    size="lg"
                    className="bg-white text-pink-600 hover:bg-pink-50 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 font-semibold shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 md:p-3 rounded-full transition-all duration-200 disabled:opacity-50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 md:p-3 rounded-full transition-all duration-200 disabled:opacity-50"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={cn(
                "w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200",
                index === currentSlide
                  ? "bg-white scale-110"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {autoPlay && slides.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-20">
          <div 
            className="h-full bg-white transition-all ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
              transitionDuration: isTransitioning ? '0ms' : `${autoPlayInterval}ms`
            }}
          />
        </div>
      )}
    </div>
  )
}
