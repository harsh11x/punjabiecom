"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Star } from "lucide-react"

interface Product {
  id: number
  name: string
  punjabiName?: string
  price: string
  originalPrice: string
  image: string
  rating: number
  reviews: number
  colors: string[]
  badge: string
  badgeEn?: string
  category?: string
  type?: string
  ageGroup?: string
}

interface ResponsiveProductCardProps {
  product: Product
}

export function ResponsiveProductCard({ product }: ResponsiveProductCardProps) {
  return (
    <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-2 lg:border-3 border-amber-200 hover:border-amber-400 bg-gradient-to-b from-white to-amber-50 overflow-hidden">
      <CardContent className="p-3 lg:p-6">
        <div className="relative mb-4 lg:mb-6">
          <div className="absolute -inset-1 lg:-inset-2 bg-gradient-to-br from-amber-300 to-red-400 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <Image
            src={product.image || "/placeholder.svg"}
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
          <Badge className="absolute top-2 lg:top-3 left-2 lg:left-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold px-2 lg:px-3 py-1 shadow-lg text-xs lg:text-sm">
            {product.badge}
          </Badge>
          {product.category && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white text-xs">{product.category}</Badge>
          )}
          {product.type && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white text-xs">{product.type}</Badge>
          )}
          {product.ageGroup && (
            <Badge className="absolute bottom-2 lg:bottom-3 right-2 lg:right-3 bg-white/90 text-red-800 font-semibold px-2 py-1 text-xs">
              {product.ageGroup}
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
                    i < Math.floor(product.rating) ? "text-amber-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs lg:text-sm text-gray-600 font-medium">({product.reviews})</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {product.colors.map((color, index) => (
              <Badge key={index} variant="outline" className="text-xs border-amber-300 text-amber-700">
                {color}
              </Badge>
            ))}
          </div>

          <div className="flex items-center space-x-2 lg:space-x-3">
            <span className="text-lg lg:text-2xl font-bold text-red-800">{product.price}</span>
            <span className="text-sm lg:text-lg text-gray-500 line-through">{product.originalPrice}</span>
          </div>

          <Button className="w-full bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 text-white font-semibold py-2 lg:py-3 shadow-lg border-2 border-amber-300 text-xs lg:text-sm">
            <span className="mr-1 lg:mr-2">🛒</span>
            ਕਾਰਟ ਵਿੱਚ ਪਾਓ • Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
