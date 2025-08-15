"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext"
import { useState } from "react"
import { AuthModal } from "@/components/auth/AuthModal"

interface Product {
  _id: string
  name: string
  punjabiName?: string
  price: number
  originalPrice: number
  images: string[]
  rating: number
  reviews: number
  colors: string[]
  sizes: string[]
  stock: number
  badge?: string
  category?: string
  subcategory?: string
}

interface ResponsiveProductCardProps {
  product: Product
}

export function ResponsiveProductCard({ product }: ResponsiveProductCardProps) {
  const { addItem } = useCart()
  const { isAuthenticated } = useFirebaseAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '')

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    if (!selectedSize || !selectedColor) {
      // Auto-select first available options if none selected
      const size = selectedSize || product.sizes[0]
      const color = selectedColor || product.colors[0]
      
      if (!size || !color) {
        alert('Please select size and color')
        return
      }
      
      setSelectedSize(size)
      setSelectedColor(color)
    }

    addItem({
      id: product._id, // Add the missing id property
      productId: product._id,
      name: product.name,
      punjabiName: product.punjabiName || product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
      size: selectedSize || product.sizes[0],
      color: selectedColor || product.colors[0],
      stock: product.stock
    })
  }

  return (
    <>
      <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-2 lg:border-3 border-amber-200 hover:border-amber-400 bg-gradient-to-b from-white to-amber-50 overflow-hidden">
        <CardContent className="p-3 lg:p-6">
          <div className="relative mb-4 lg:mb-6">
            <div className="absolute -inset-1 lg:-inset-2 bg-gradient-to-br from-amber-300 to-red-400 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              width={350}
              height={350}
              className="relative w-full h-40 sm:h-48 lg:h-56 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 shadow-lg"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-white/90 hover:bg-white text-red-600 shadow-lg border border-amber-200 w-8 h-8 lg:w-10 lg:h-10"
            >
              <Heart className="h-3 lg:h-5 w-3 lg:w-5" />
            </Button>
            {product.badge && (
              <Badge className="absolute top-2 lg:top-3 left-2 lg:left-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold px-2 lg:px-3 py-1 shadow-lg text-xs lg:text-sm">
                {product.badge}
              </Badge>
            )}
          </div>

          <div className="space-y-2 lg:space-y-4">
            <div>
              {product.punjabiName && (
                <h3 className="font-bold text-red-900 group-hover:text-red-700 transition-colors text-sm lg:text-lg mb-1">
                  {product.punjabiName}
                </h3>
              )}
              <h4 className="font-semibold text-amber-800 text-xs lg:text-base">{product.name}</h4>
            </div>

            <div className="flex items-center space-x-1 lg:space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 lg:h-4 w-3 lg:w-4 ${
                      i < Math.floor(product.rating || 0) ? "text-amber-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs lg:text-sm text-gray-600 font-medium">({product.reviews || 0})</span>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Size:</label>
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      size="sm"
                      variant={selectedSize === size ? "default" : "outline"}
                      className={`text-xs px-2 py-1 h-6 ${
                        selectedSize === size 
                          ? "bg-red-600 text-white" 
                          : "border-amber-300 text-amber-700 hover:bg-amber-50"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Color:</label>
                <div className="flex flex-wrap gap-1">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      size="sm"
                      variant={selectedColor === color ? "default" : "outline"}
                      className={`text-xs px-2 py-1 h-6 ${
                        selectedColor === color 
                          ? "bg-red-600 text-white" 
                          : "border-amber-300 text-amber-700 hover:bg-amber-50"
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 lg:space-x-3">
              <span className="text-lg lg:text-2xl font-bold text-red-800">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm lg:text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 text-white font-semibold py-2 lg:py-3 shadow-lg border-2 border-amber-300 text-xs lg:text-sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-1 lg:mr-2 h-4 w-4" />
              ਕਾਰਟ ਵਿੱਚ ਪਾਓ • Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>

      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </>
  )
}
