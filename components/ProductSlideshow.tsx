'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface Product {
  _id: string
  name: string
  punjabiName: string
  description: string
  price: number
  originalPrice: number
  category: string
  images: string[]
  colors: string[]
  sizes: string[]
  stock: number
  rating?: number
  reviews?: number
  isActive: boolean
  badge?: string
}

interface ProductSlideshowProps {
  className?: string
  autoplayInterval?: number
}

export function ProductSlideshow({ 
  className = "", 
  autoplayInterval = 2000 
}: ProductSlideshowProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products?limit=20&featured=true')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        const fetchedProducts = data.data || []
        
        if (fetchedProducts.length === 0) {
          // Auto-seeding disabled - products should be managed through admin panel only
          // This prevents deleted products from automatically reappearing
          setProducts([])
        } else {
          setProducts(fetchedProducts)
        }
      } catch (err) {
        console.error('Error fetching products for slideshow:', err)
        setError('Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Auto-advance slideshow
  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      )
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [products.length, autoplayInterval, isAutoPlaying])

  // Manual navigation
  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === 0 ? products.length - 1 : currentIndex - 1)
    setTimeout(() => setIsAutoPlaying(true), 5000) // Resume autoplay after 5 seconds
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === products.length - 1 ? 0 : currentIndex + 1)
    setTimeout(() => setIsAutoPlaying(true), 5000) // Resume autoplay after 5 seconds
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-2xl lg:rounded-3xl opacity-20 blur-lg animate-pulse"></div>
        <div className="absolute -inset-1 lg:-inset-2 bg-gradient-to-br from-amber-300 to-red-500 rounded-xl lg:rounded-2xl animate-pulse"></div>
        <div className="relative bg-white p-1 lg:p-2 rounded-xl lg:rounded-2xl shadow-2xl">
          <div className="w-full h-[400px] lg:h-[500px] bg-gradient-to-br from-amber-100 to-red-100 rounded-lg lg:rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-red-500 rounded-full animate-spin"></div>
              <p className="text-red-800 font-semibold">ਉਤਪਾਦ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...</p>
              <p className="text-amber-700 text-sm italic">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || products.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-2xl lg:rounded-3xl opacity-20 blur-lg"></div>
        <div className="absolute -inset-1 lg:-inset-2 bg-gradient-to-br from-amber-300 to-red-500 rounded-xl lg:rounded-2xl"></div>
        <div className="relative bg-white p-1 lg:p-2 rounded-xl lg:rounded-2xl shadow-2xl">
          <Image
            src="/punjabi-jutti-shoes.png"
            alt="Traditional Punjabi Jutti"
            width={600}
            height={500}
            priority
            className="rounded-lg lg:rounded-xl shadow-lg w-full h-[400px] lg:h-[500px] object-cover"
          />
        </div>
      </div>
    )
  }

  const currentProduct = products[currentIndex]

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Decorative Frame */}
      <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-2xl lg:rounded-3xl opacity-20 blur-lg"></div>
      <div className="absolute -inset-1 lg:-inset-2 bg-gradient-to-br from-amber-300 to-red-500 rounded-xl lg:rounded-2xl"></div>
      
      <div className="relative bg-white p-1 lg:p-2 rounded-xl lg:rounded-2xl shadow-2xl overflow-hidden">
        {/* Product Image with Overlay */}
        <div className="relative h-[400px] lg:h-[500px] rounded-lg lg:rounded-xl overflow-hidden">
          <Image
            src={currentProduct.images[0] || '/placeholder.jpg'}
            alt={currentProduct.name}
            fill
            priority={currentIndex === 0}
            className="object-cover transition-all duration-700 ease-in-out transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Product Information Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 text-white">
            {/* Badge */}
            {currentProduct.badge && (
              <Badge className="mb-2 bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold">
                {currentProduct.badge}
              </Badge>
            )}
            
            {/* Product Names */}
            <div className="mb-3">
              <h3 className="text-xl lg:text-2xl font-bold mb-1 drop-shadow-lg">
                {currentProduct.punjabiName || currentProduct.name}
              </h3>
              <h4 className="text-lg lg:text-xl font-semibold text-amber-200">
                {currentProduct.name}
              </h4>
            </div>
            
            {/* Price */}
            <div className="mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl lg:text-3xl font-bold text-amber-300">
                  {formatPrice(currentProduct.price)}
                </span>
                {currentProduct.originalPrice > currentProduct.price && (
                  <span className="text-lg text-red-300 line-through">
                    {formatPrice(currentProduct.originalPrice)}
                  </span>
                )}
              </div>
              {currentProduct.originalPrice > currentProduct.price && (
                <div className="text-sm text-green-300 font-semibold">
                  {Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>
            
            {/* Category */}
            <div className="text-sm text-amber-200 capitalize">
              {currentProduct.category} • ਵਿਰਾਸਤ Heritage Collection
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="Previous product"
          >
            <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="Next product"
          >
            <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>
        
        {/* Progress Indicators */}
        <div className="absolute bottom-2 lg:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false)
                setCurrentIndex(index)
                setTimeout(() => setIsAutoPlaying(true), 5000)
              }}
              className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-amber-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Autoplay Indicator */}
        <div className="absolute top-2 lg:top-4 right-2 lg:right-4">
          <div className={`w-3 h-3 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}>
            <span className="sr-only">
              {isAutoPlaying ? 'Autoplay active' : 'Autoplay paused'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Product Counter */}
      <div className="absolute top-2 lg:top-4 left-2 lg:left-4 bg-black/50 text-white px-2 lg:px-3 py-1 lg:py-2 rounded-lg text-xs lg:text-sm font-semibold backdrop-blur-sm">
        {currentIndex + 1} / {products.length}
      </div>
    </div>
  )
}
