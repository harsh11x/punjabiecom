#!/bin/bash

# Fix Array Access Issues Script
echo "🔧 Fixing array access issues in all source files..."

# Find and replace all instances of unsafe array access
find . -name "*.tsx" -not -path "./punjabi-heritage-deployment-*" -not -path "./.next/*" -not -path "./node_modules/*" | while read file; do
    echo "Processing: $file"
    
    # Fix .images[0] to .images?.[0]
    sed -i '' 's/\.images\[0\]/\.images\?\.\[0\]/g' "$file"
    
    # Fix .sizes[0] to .sizes?.[0]
    sed -i '' 's/\.sizes\[0\]/\.sizes\?\.\[0\]/g' "$file"
    
    # Fix .colors[0] to .colors?.[0]
    sed -i '' 's/\.colors\[0\]/\.colors\?\.\[0\]/g' "$file"
done

echo "✅ Fixed array access issues in all source files"

# Also create a more robust product card component
cat > components/safe-product-card.tsx << 'EOF'
"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { useState } from "react"

interface Product {
  _id: string
  name: string
  punjabiName?: string
  price: number
  originalPrice: number
  images?: string[]
  rating: number
  reviews: number
  colors?: string[]
  sizes?: string[]
  stock: number
  badge?: string
  category?: string
  subcategory?: string
}

interface SafeProductCardProps {
  product: Product
}

export function SafeProductCard({ product }: SafeProductCardProps) {
  const [imageError, setImageError] = useState(false)
  
  // Safely get product data with fallbacks
  const safeProduct = {
    ...product,
    images: product.images || [],
    colors: product.colors || [],
    sizes: product.sizes || [],
    punjabiName: product.punjabiName || product.name
  }
  
  const primaryImage = safeProduct.images.length > 0 ? safeProduct.images[0] : '/placeholder.svg'
  const hasStock = safeProduct.stock > 0
  const hasVariants = safeProduct.sizes.length > 0 && safeProduct.colors.length > 0

  return (
    <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-2 border-amber-200 hover:border-amber-400 bg-gradient-to-b from-white to-amber-50 overflow-hidden">
      <CardContent className="p-3 lg:p-6">
        <div className="relative mb-4 lg:mb-6">
          <div className="absolute -inset-1 lg:-inset-2 bg-gradient-to-br from-amber-300 to-red-400 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <Image
            src={imageError ? '/placeholder.svg' : primaryImage}
            alt={safeProduct.name}
            width={350}
            height={350}
            className="relative w-full h-40 sm:h-48 lg:h-56 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 shadow-lg"
            onError={() => setImageError(true)}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-white/90 hover:bg-white text-red-600 shadow-lg border border-amber-200 w-8 h-8 lg:w-10 lg:h-10"
          >
            <Heart className="h-3 lg:h-5 w-3 lg:w-5" />
          </Button>
          {safeProduct.badge && (
            <Badge className="absolute top-2 lg:top-3 left-2 lg:left-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold px-2 lg:px-3 py-1 shadow-lg text-xs lg:text-sm">
              {safeProduct.badge}
            </Badge>
          )}
          {!hasStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="space-y-2 lg:space-y-3">
          <div>
            <h3 className="font-bold text-red-900 text-sm lg:text-lg leading-tight group-hover:text-red-700 transition-colors">
              {safeProduct.punjabiName}
            </h3>
            <p className="text-amber-800 text-xs lg:text-sm font-medium">
              {safeProduct.name}
            </p>
          </div>

          <div className="flex items-center space-x-1 lg:space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 lg:h-4 w-3 lg:w-4 ${
                    i < Math.floor(safeProduct.rating)
                      ? 'text-amber-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs lg:text-sm text-gray-600">
              ({safeProduct.reviews})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl font-bold text-red-900">
                  ₹{safeProduct.price.toLocaleString()}
                </span>
                {safeProduct.originalPrice > safeProduct.price && (
                  <span className="text-sm lg:text-base text-gray-500 line-through">
                    ₹{safeProduct.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {safeProduct.originalPrice > safeProduct.price && (
                <span className="text-xs lg:text-sm text-green-600 font-semibold">
                  Save ₹{(safeProduct.originalPrice - safeProduct.price).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {hasVariants && (
            <div className="flex flex-wrap gap-1">
              {safeProduct.sizes.slice(0, 3).map((size) => (
                <Badge key={size} variant="outline" className="text-xs border-amber-300 text-amber-800">
                  {size}
                </Badge>
              ))}
              {safeProduct.sizes.length > 3 && (
                <Badge variant="outline" className="text-xs border-amber-300 text-amber-800">
                  +{safeProduct.sizes.length - 3}
                </Badge>
              )}
            </div>
          )}

          <Button 
            className="w-full bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 text-white font-semibold text-sm lg:text-base py-2 lg:py-3 shadow-lg border border-amber-400"
            disabled={!hasStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {hasStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
EOF

echo "✅ Created SafeProductCard component"
echo "🎉 All fixes applied successfully!"