'use client'

import { Product } from '@/lib/product-manager'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/components/providers/CartProvider'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isLiked, setIsLiked] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  // Hover slideshow state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const slideshowRef = useRef<NodeJS.Timeout | null>(null)
  
  const images = product.images || []
  const hasMultipleImages = images.length > 1
  
  // Start slideshow on hover
  const startSlideshow = () => {
    if (!hasMultipleImages) return
    
    setIsHovering(true)
    slideshowRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 2000) // Change image every 2 seconds
  }
  
  // Stop slideshow when not hovering
  const stopSlideshow = () => {
    setIsHovering(false)
    if (slideshowRef.current) {
      clearInterval(slideshowRef.current)
      slideshowRef.current = null
    }
    setCurrentImageIndex(0) // Reset to first image
  }
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (slideshowRef.current) {
        clearInterval(slideshowRef.current)
      }
    }
  }, [])

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
    <Card 
      className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
      onMouseEnter={startSlideshow}
      onMouseLeave={stopSlideshow}
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={hasMultipleImages ? images[currentImageIndex] : product.images[0]}
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

        {/* Category Badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium capitalize">
            {product.category === 'fulkari' ? 'Fulkari' : 
             product.category === 'men' ? 'Men' : 
             product.category === 'women' ? 'Women' : 
             product.category === 'kids' ? 'Kids' : 
             product.category}
          </Badge>
        </div>
        
        {/* Other Badges */}
        <div className="absolute top-2 left-20 flex flex-col gap-1">
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
        
        {/* Image Counter (only show if multiple images) */}
        {hasMultipleImages && (
          <div className="absolute top-2 right-12 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
        
        {/* Slideshow Indicator Dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}

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
