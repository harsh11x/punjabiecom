'use client'

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ChevronRight, Star, ShoppingBag, Truck, Shield, HeadphonesIcon, Heart, Users, Award, Zap, Mail, ArrowRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'

// Dynamic imports with loading components
const ImageSlider = dynamic(() => import('@/components/ImageSlider'), {
  loading: () => <div className="w-full h-[500px] md:h-[600px] bg-gradient-to-r from-pink-100 via-red-100 to-orange-100 animate-pulse rounded-lg" />,
  ssr: false
})

const ProductCard = dynamic(() => import('@/components/ProductCard'), {
  loading: () => <ProductCardSkeleton />,
  ssr: false
})

// Loading skeleton for product cards
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}

interface Product {
  _id: string
  id: string
  name: string
  punjabiName?: string
  price: number
  originalPrice?: number
  category: string
  productType?: string
  rating?: number
  reviews?: number
  images: string[]
  colors?: string[]
  sizes?: string[]
  isFeatured?: boolean
  isNew?: boolean
  isActive?: boolean
}

const heroSlides = [
  {
    id: 1,
    image: '/hero/jutti-collection.jpg',
    title: 'ਅਸਲੀ ਪੰਜਾਬੀ ਵਿਰਾਸਤ',
    subtitle: 'Authentic Punjabi Heritage',
    description: 'Discover our exquisite collection of handcrafted Punjabi jutti and traditional fulkari, preserving centuries-old craftsmanship for the modern world',
    cta: 'Explore Collection',
    link: '/products'
  },
  {
    id: 2,
    image: '/hero/mens-jutti.jpg',
    title: 'ਹੱਥਾਂ ਨਾਲ ਬਣੇ ਜੁੱਤੇ',
    subtitle: 'Handcrafted Leather Jutti',
    description: 'Premium quality leather jutti crafted by master artisans using traditional techniques passed down through generations',
    cta: 'Shop Jutti',
    link: '/jutti'
  },
  {
    id: 3,
    image: '/hero/womens-jutti.jpg',
    title: 'ਫੁਲਕਾਰੀ ਦੀ ਕਲਾ',
    subtitle: 'Art of Fulkari Embroidery',
    description: 'Intricate hand-embroidered fulkari showcasing the vibrant culture and artistic heritage of Punjab',
    cta: 'Discover Fulkari',
    link: '/fulkari'
  }
]

const categories = [
  {
    id: 'men',
    name: "Men's Jutti",
    punjabiName: 'ਮਰਦਾਂ ਦੇ ਜੁੱਤੇ',
    description: 'Handcrafted leather jutti for men',
    image: '/categories/mens-jutti.jpg',
    count: '150+ items'
  },
  {
    id: 'women',
    name: "Women's Jutti",
    punjabiName: 'ਔਰਤਾਂ ਦੇ ਜੁੱਤੇ',
    description: 'Elegant embroidered jutti for women',
    image: '/categories/womens-jutti.jpg',
    count: '200+ items'
  },
  {
    id: 'kids',
    name: "Kids' Jutti",
    punjabiName: 'ਬੱਚਿਆਂ ਦੇ ਜੁੱਤੇ',
    description: 'Colorful and comfortable kids jutti',
    image: '/categories/kids-jutti.jpg',
    count: '75+ items'
  },
  {
    id: 'fulkari',
    name: 'Fulkari Collection',
    punjabiName: 'ਫੁਲਕਾਰੀ',
    description: 'Traditional embroidered artistry',
    image: '/categories/fulkari.jpg',
    count: '100+ items'
  }
]

const features = [
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'Free shipping on orders above ₹999',
    punjabiTitle: 'ਮੁਫ਼ਤ ਡਿਲੀਵਰੀ'
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure payment gateway',
    punjabiTitle: 'ਸੁਰੱਖਿਤ ਪੇਮੈਂਟ'
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Round the clock customer support',
    punjabiTitle: '੨੪/੭ ਸਹਾਇਤਾ'
  },
  {
    icon: Heart,
    title: 'Handcrafted Quality',
    description: 'Made with love by skilled artisans',
    punjabiTitle: 'ਹੱਥੀਂ ਬਣਾਏ'
  }
]

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Delhi',
    rating: 5,
    comment: 'Absolutely beautiful jutti! The quality and craftsmanship exceeded my expectations. Perfect for my wedding.',
    punjabiComment: 'ਬਹੁਤ ਸੋਹਣੇ ਜੁੱਤੇ! ਗੁਣਵੱਤਾ ਅਤੇ ਕਾਰੀਗਰੀ ਬਹੁਤ ਵਧੀਆ ਹੈ।'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Mumbai',
    rating: 5,
    comment: 'Traditional design with modern comfort. These jutti are perfect for both casual and formal occasions.',
    punjabiComment: 'ਪਰੰਪਰਾਗਤ ਡਿਜ਼ਾਈਨ ਅਤੇ ਆਧੁਨਿਕ ਆਰਾਮ।'
  },
  {
    id: 3,
    name: 'Simran Kaur',
    location: 'Chandigarh',
    rating: 5,
    comment: 'The fulkari embroidery is stunning! Each piece tells a story of our rich cultural heritage.',
    punjabiComment: 'ਫੁਲਕਾਰੀ ਦੀ ਕਢਾਈ ਬਹੁਤ ਸੁੰਦਰ ਹੈ!'
  }
]

const stats = [
  {
    icon: Users,
    value: '50K+',
    label: 'Happy Customers',
    punjabiLabel: 'ਖੁਸ਼ ਗ੍ਰਾਹਕ'
  },
  {
    icon: Award,
    value: '1000+',
    label: 'Products Sold',
    punjabiLabel: 'ਉਤਪਾਦ ਵੇਚੇ'
  },
  {
    icon: Zap,
    value: '15+',
    label: 'Years Experience',
    punjabiLabel: 'ਸਾਲ ਦਾ ਤਜਰਬਾ'
  },
  {
    icon: Heart,
    value: '99%',
    label: 'Customer Satisfaction',
    punjabiLabel: 'ਗ੍ਰਾਹਕ ਸੰਤੁਸ਼ਟੀ'
  }
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch featured products
        const featuredResponse = await fetch('/api/products?limit=8&sortBy=rating&sortOrder=desc', {
          cache: 'no-store'
        })
        
        if (!featuredResponse.ok) {
          throw new Error(`Featured products API error: ${featuredResponse.status}`)
        }
        
        const featuredData = await featuredResponse.json()
        
        // Fetch new arrivals
        const newArrivalsResponse = await fetch('/api/products?limit=8&sortBy=createdAt&sortOrder=desc', {
          cache: 'no-store'
        })
        
        if (!newArrivalsResponse.ok) {
          throw new Error(`New arrivals API error: ${newArrivalsResponse.status}`)
        }
        
        const newArrivalsData = await newArrivalsResponse.json()

        if (featuredData.success && featuredData.data) {
          setFeaturedProducts(featuredData.data)
        }
        
        if (newArrivalsData.success && newArrivalsData.data) {
          setNewArrivals(newArrivalsData.data)
        }

      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const ErrorFallback = ({ error, retry }: { error: string; retry?: () => void }) => (
    <div className="text-center py-8">
      <p className="text-red-600 mb-4">Error: {error}</p>
      {retry && (
        <Button onClick={retry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-orange-700">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/50 to-transparent" />
        <Suspense fallback={<div className="w-full h-[500px] md:h-[600px] bg-gradient-to-r from-pink-100 via-red-100 to-orange-100 animate-pulse" />}>
          <ImageSlider slides={heroSlides} />
        </Suspense>
        
        {/* Floating Stats */}
        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center text-white">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-yellow-300" />
                  </div>
                  <div className="text-lg md:text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs md:text-sm opacity-90">{stat.label}</div>
                  <div className="text-xs text-yellow-300 font-medium">{stat.punjabiLabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਖਰੀਦਦਾਰੀ
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              Shop by Category
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link 
                key={category.id} 
                href={`/${category.id}`}
                className="group relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-red-100 via-pink-100 to-orange-100 relative">
                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-8 h-8 border-2 border-red-400 rounded-full" />
                    <div className="absolute top-8 right-6 w-6 h-6 bg-orange-400 rounded-full" />
                    <div className="absolute bottom-8 left-6 w-4 h-4 bg-yellow-400 transform rotate-45" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col justify-center items-center h-full p-8 text-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">👞</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                      {category.punjabiName}
                    </h3>
                    <p className="text-lg text-red-600 font-semibold mb-3">
                      {category.name}
                    </p>
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    <div className="mt-auto">
                      <Badge className="bg-white/20 text-gray-800 hover:bg-white/30 backdrop-blur-sm">
                        {category.count}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Arrow on Hover */}
                  <div className="absolute bottom-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                ਫ਼ੀਚਰਡ ਪ੍ਰੋਡਕਟਸ
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hidden sm:flex items-center gap-2">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {error ? (
            <ErrorFallback 
              error={error} 
              retry={() => window.location.reload()} 
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                // Show skeletons while loading
                Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={`featured-skeleton-${index}`} />
                ))
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <Suspense key={product._id || product.id} fallback={<ProductCardSkeleton />}>
                    <ProductCard product={product} />
                  </Suspense>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No featured products available</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/products">
              <Button variant="outline" className="flex items-center gap-2 mx-auto">
                View All Products
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                New Arrivals
              </h2>
              <p className="text-xl text-gray-600">
                ਨਵੇਂ ਉਤਪਾਦ
              </p>
            </div>
            <Link href="/products?sortBy=newest">
              <Button variant="outline" className="hidden sm:flex items-center gap-2">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {error ? (
            <ErrorFallback 
              error={error} 
              retry={() => window.location.reload()} 
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                // Show skeletons while loading
                Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={`new-skeleton-${index}`} />
                ))
              ) : newArrivals.length > 0 ? (
                newArrivals.map((product) => (
                  <Suspense key={product._id || product.id} fallback={<ProductCardSkeleton />}>
                    <ProductCard product={product} />
                  </Suspense>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No new arrivals available</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/products?sortBy=newest">
              <Button variant="outline" className="flex items-center gap-2 mx-auto">
                View All New Arrivals
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
              <Quote className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ਸਾਡੇ ਗ੍ਰਾਹਕ ਕੀ ਕਹਿੰਦੇ ਹਨ
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              What Our Customers Say
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="group relative bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <div className="mb-6">
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      "{testimonial.comment}"
                    </p>
                    <p className="text-red-600 font-medium text-sm">
                      "{testimonial.punjabiComment}"
                    </p>
                  </div>
                  
                  {/* Customer Info */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-gray-600 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-900 via-red-800 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/10 rounded-full" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-20 w-4 h-4 bg-yellow-400 rounded-full" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                ਸਾਡੀ ਵਿਰਾਸਤ
              </h2>
              <p className="text-2xl text-yellow-200 font-semibold mb-6">
                Our Heritage Story
              </p>
              <p className="text-lg text-gray-100 mb-6 leading-relaxed">
                For over 15 years, Punjab Heritage has been preserving the rich cultural traditions of Punjab through our handcrafted jutti and exquisite fulkari embroidery. Each piece tells a story of generations-old craftsmanship, passed down through skilled artisans who pour their heart and soul into every creation.
              </p>
              <p className="text-base text-gray-200 mb-8">
                ਅਸੀਂ ਪੰਜਾਬ ਦੀ ਸਮਰਿੱਧ ਸੱਭਿਆਚਾਰਕ ਵਿਰਾਸਤ ਨੂੰ ਸੁਰੱਖਿਤ ਰੱਖਣ ਅਤੇ ਅਗਲੀਆਂ ਪੀੜ੍ਹੀਆਂ ਤੱਕ ਪਹੁੰਚਾਉਣ ਲਈ ਵਚਨਬੱਧ ਹਾਂ।
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about">
                  <Button size="lg" className="bg-white text-red-800 hover:bg-gray-100">
                    Learn More About Us
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-800">
                    View Our Collection
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-3xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🧵</div>
                  <p className="text-xl font-semibold mb-2">ਹਸਤਕਲਾ</p>
                  <p className="text-lg text-yellow-200">Traditional Craftsmanship</p>
                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-300">1000+</p>
                      <p className="text-sm">ਖੁਸ਼ ਗ੍ਰਾਹਕ</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-300">15+</p>
                      <p className="text-sm">ਸਾਲ ਤਜਰਬਾ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ਸਾਡੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ
            </h2>
            <p className="text-xl text-gray-600">
              Why Choose Punjab Heritage?
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 text-center">
                  <div className="mx-auto h-20 w-20 flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {feature.punjabiTitle}
                  </h3>
                  <p className="text-lg text-red-600 font-semibold mb-3">
                    {feature.title}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ਸਾਡੇ ਨਾਲ ਜੁੜੇ ਰਹੋ
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Stay Connected with Punjab Heritage
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and cultural stories behind our handcrafted treasures.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 h-12 text-base border-2 border-red-200 focus:border-red-500"
              />
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 px-8 h-12"
              >
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              ਅਸੀਂ ਤੁਹਾਡੀ ਪ੍ਰਾਈਵੇਸੀ ਦਾ ਸਤਿਕਾਰ ਕਰਦੇ ਹਾਂ। ਕਦੇ ਵੀ ਸਪੈਮ ਨਹੀਂ!
            </p>
          </div>
          
          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Join 10,000+ happy customers</p>
            <div className="flex justify-center items-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="text-sm">99% Satisfaction Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Secure & Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span className="text-sm">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-800 via-red-700 to-amber-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ਪੰਜਾਬ ਹੈਰਿਟੇਜ ਤੋਂ ਖਰੀਦਾਰੀ ਕਰੋ
          </h2>
          <p className="text-xl text-amber-200 mb-2">
            Shop From Punjab Heritage
          </p>
          <p className="text-lg text-amber-100 mb-8 max-w-2xl mx-auto">
            Discover the finest collection of authentic handcrafted Punjabi jutti and traditional fulkari embroidery. 
            Quality guaranteed, heritage preserved, delivered to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jutti">
              <Button size="lg" className="bg-white text-red-800 hover:bg-amber-50 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Shop Jutti Collection
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-800">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
