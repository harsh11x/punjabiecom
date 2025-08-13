'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ResponsiveProductCard } from '@/components/responsive-product-card'

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
  const [loading, setLoading] = useState(initialProducts.length === 0)

  useEffect(() => {
    if (initialProducts.length === 0) {
      // Fetch products on client side if not available from server
      const fetchProducts = async () => {
        try {
          const response = await fetch('/api/products?limit=8&sortBy=rating&sortOrder=desc')
          if (response.ok) {
            const data = await response.json()
            setProducts(data.data || [])
          }
        } catch (error) {
          console.error('Error fetching products:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchProducts()
    }
  }, [initialProducts])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
      {products.length > 0 ? (
        products.map((product: Product) => (
          <ResponsiveProductCard key={product._id} product={product} />
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
