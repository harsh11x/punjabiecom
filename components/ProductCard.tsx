'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

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

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)

  const productId = product._id || product.id
  const productLink = `/products/${productId}`
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.name)
  }

  return (
    <Card className={cn("group overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300", className)}>
      <CardContent className="p-0">
        <div className="relative">
          <Link href={productLink}>
            <div className="relative aspect-square overflow-hidden">
              {!imageError ? (
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">👕</div>
                    <p className="text-xs text-gray-500">Product Image</p>
                  </div>
                </div>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">
                    New
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs">
                    Featured
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label="Add to wishlist"
              >
                <Heart 
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                  )} 
                />
              </button>

              {/* Quick Add to Cart */}
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <Button 
                  size="sm" 
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 shadow-md"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </Link>

          {/* Product Info */}
          <div className="p-4">
            <Link href={productLink} className="block">
              <div className="mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {product.name}
                </h3>
                {product.punjabiName && (
                  <p className="text-sm text-pink-600 font-medium">
                    {product.punjabiName}
                  </p>
                )}
              </div>

              {/* Category */}
              <p className="text-xs text-gray-500 mb-2 capitalize">
                {product.productType || product.category}
              </p>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3 w-3",
                          i < Math.floor(product.rating!)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    ({product.reviews || 0})
                  </span>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs text-gray-600">Colors:</span>
                  <div className="flex gap-1">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full border border-gray-300 bg-gradient-to-r from-pink-200 to-yellow-200"
                        title={color}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice!.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-600">
                    Sizes: {product.sizes.join(', ')}
                  </span>
                </div>
              )}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
