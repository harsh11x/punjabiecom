'use client'

import { Product } from '@/lib/product-manager'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/components/providers/CartProvider'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isLiked, setIsLiked] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      })
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-sm">No Image</div>
              </div>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <Badge className="bg-orange-500 hover:bg-orange-600">
              Featured
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive">
              {discountPercentage}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart 
            className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Category */}
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category}
          </div>

          {/* Product Name */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-lg line-clamp-2 hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>

          {/* Rating (Mock) */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-3 w-3 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.5)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Sizes (if available) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 3).map((size) => (
                <Badge key={size} variant="outline" className="text-xs">
                  {size}
                </Badge>
              ))}
              {product.sizes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.sizes.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-2">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart}
            className="w-full"
          >
            {isAddingToCart ? (
              'Adding...'
            ) : !product.inStock ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
          
          <Link href={`/products/${product.id}`} className="block">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
