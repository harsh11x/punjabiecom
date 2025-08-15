'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ResponsiveProductCard } from '@/components/responsive-product-card'
import { ProductErrorBoundary } from '@/components/product-error-boundary'
import { isValidProduct } from '@/lib/product-utils'

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
  rating: number
  reviews: number
  isActive: boolean
  badge?: string
}

interface FeaturedProductsClientProps {
  initialProducts: Product[]
}

export function FeaturedProductsClient({ initialProducts }: FeaturedProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [shouldLoadProducts, setShouldLoadProducts] = useState(false)

  useEffect(() => {
    // Only load products after component is visible (lazy loading)
    const timer = setTimeout(() => {
      setShouldLoadProducts(true)
    }, 100) // Small delay to ensure page loads fast

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (shouldLoadProducts && initialProducts.length === 0) {
      setLoading(true)
      // Fetch products on client side if not available from server
      const fetchProducts = async () => {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
          
          const response = await fetch('/api/products/featured?limit=8', {
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)
          
          if (response.ok) {
            const data = await response.json()
            setProducts(data.data || [])
          }
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.error('Error fetching products:', error)
          }
          // Don't show error to user, just skip showing products
        } finally {
          setLoading(false)
        }
      }
      fetchProducts()
    }
  }, [initialProducts, shouldLoadProducts])

  // Show loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white/80 rounded-lg border border-amber-200 overflow-hidden animate-pulse">
            <div className="h-64 bg-gradient-to-r from-amber-100 to-red-100"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-amber-200 rounded"></div>
              <div className="h-3 bg-red-200 rounded w-3/4"></div>
              <div className="h-5 bg-amber-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
      {products.length > 0 ? (
        products
          .filter(isValidProduct)
          .map((product: Product) => (
            <ProductErrorBoundary key={product._id}>
              <ResponsiveProductCard product={product} />
            </ProductErrorBoundary>
          ))
      ) : (
        // No products message
        <div className="col-span-full text-center py-12">
          <div className="bg-white/80 rounded-lg p-8 shadow-lg border border-amber-200">
            <h3 className="text-2xl font-bold text-red-900 mb-4">ਕੋਈ ਉਤਪਾਦ ਨਹੀਂ ਮਿਲੇ</h3>
            <p className="text-amber-700 mb-6">No products available at the moment</p>
            <p className="text-sm text-gray-600">
              Our artisans are working on new collections. Check back soon!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
