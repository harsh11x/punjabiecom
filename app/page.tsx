'use client'

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ChevronRight, Star, ShoppingBag, Truck, Shield, HeadphonesIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Dynamic imports with loading components
const ImageSlider = dynamic(() => import('@/components/ImageSlider'), {
  loading: () => <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-r from-pink-100 to-yellow-100 animate-pulse rounded-lg" />,
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
    image: '/hero/punjabi-suits-collection.jpg',
    title: 'Authentic Punjabi Fashion',
    subtitle: 'ਪੰਜਾਬੀ ਫੈਸ਼ਨ',
    description: 'Discover our premium collection of traditional Punjabi suits and accessories',
    cta: 'Shop Collection',
    link: '/products?category=suits'
  },
  {
    id: 2,
    image: '/hero/wedding-collection.jpg',
    title: 'Wedding Collection',
    subtitle: 'ਵਿਆਹ ਦੇ ਸੂਟ',
    description: 'Elegant bridal wear and ceremonial outfits for your special moments',
    cta: 'View Bridal Wear',
    link: '/products?category=bridal'
  },
  {
    id: 3,
    image: '/hero/festival-wear.jpg',
    title: 'Festival Collection',
    subtitle: 'ਤਿਉਹਾਰੀ ਪਹਿਰਾਵਾ',
    description: 'Celebrate in style with our vibrant festival and party wear collection',
    cta: 'Shop Festival Wear',
    link: '/products?category=festival'
  }
]

const categories = [
  {
    id: 'suits',
    name: 'Punjabi Suits',
    punjabiName: 'ਪੰਜਾਬੀ ਸੂਟ',
    description: 'Traditional and modern Punjabi suits',
    image: '/categories/punjabi-suits.jpg',
    count: '200+ items'
  },
  {
    id: 'sarees',
    name: 'Sarees',
    punjabiName: 'ਸਾੜੀਆਂ',
    description: 'Elegant sarees for all occasions',
    image: '/categories/sarees.jpg',
    count: '150+ items'
  },
  {
    id: 'lehengas',
    name: 'Lehengas',
    punjabiName: 'ਲਹਿੰਗੇ',
    description: 'Designer lehengas and ghagras',
    image: '/categories/lehengas.jpg',
    count: '100+ items'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    punjabiName: 'ਗਹਿਣੇ',
    description: 'Traditional jewelry and accessories',
    image: '/categories/accessories.jpg',
    count: '300+ items'
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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Suspense fallback={<div className="w-full h-[400px] md:h-[500px] bg-gradient-to-r from-pink-100 to-yellow-100 animate-pulse" />}>
          <ImageSlider slides={heroSlides} />
        </Suspense>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਖਰੀਦਦਾਰੀ ਕਰੋ
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/products?category=${category.id}`}
                className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-yellow-100 flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-lg text-pink-600 font-medium mb-2">
                      {category.punjabiName}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      {category.description}
                    </p>
                    <Badge variant="secondary">
                      {category.count}
                    </Badge>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
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

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-16 w-16 flex items-center justify-center bg-pink-100 rounded-full mb-6">
                  <feature.icon className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-lg text-pink-600 font-medium mb-2">
                  {feature.punjabiTitle}
                </p>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-500 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Shopping Today
          </h2>
          <p className="text-xl text-pink-100 mb-2">
            ਅੱਜ ਹੀ ਖਰੀਦਦਾਰੀ ਸ਼ੁਰੂ ਕਰੋ
          </p>
          <p className="text-lg text-pink-100 mb-8 max-w-2xl mx-auto">
            Discover the finest collection of authentic Punjabi fashion and traditional wear. 
            Quality guaranteed, delivered to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-pink-50 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
