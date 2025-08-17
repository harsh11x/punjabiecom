'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AuthGuardedCart } from '@/components/AuthGuardedCart'
import { useSocket } from '@/hooks/useSocket'
import { toast } from 'sonner'
import { 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus,
  Package
} from 'lucide-react'

interface Product {
  id: string
  name: string
  punjabiName: string
  description: string
  punjabiDescription: string
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
  badgeEn?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const socket = useSocket({
    onProductUpdate: (data: any) => {
      if (data.productId === product?.id) {
        // Update product stock in real-time
        setProduct(prev => prev ? { ...prev, stock: data.stock } : null)
        toast.info('Product stock updated')
      }
    }
  })

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      console.log(`🔍 Fetching product with ID: ${id}`)
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Product data received:', data.data?.name)
        setProduct(data.data)
        
        // Set default selections
        if (data.data.sizes && data.data.sizes.length > 0) {
          setSelectedSize(data.data.sizes[0])
        }
        if (data.data.colors && data.data.colors.length > 0) {
          setSelectedColor(data.data.colors[0])
        }
      } else {
        console.error('❌ Product not found, response:', response.status)
        toast.error('Product not found')
      }
    } catch (error) {
      console.error('❌ Error fetching product:', error)
      toast.error('Error loading product')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b-4 border-amber-600 bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-100">{product.name}</h1>
              <p className="text-amber-200">{product.punjabiName}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="text-amber-100 hover:text-amber-300 hover:bg-red-700/50"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-amber-100 hover:text-amber-300 hover:bg-red-700/50"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
              <Image
                src={product.images[selectedImage] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                  {product.badge}
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 right-4 bg-green-600 text-white">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-red-600">₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Badge>
                <Badge variant="outline">{product.category}</Badge>
              </div>
            </div>

            <Separator />

            {/* Product Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 mb-2">{product.description}</p>
              <p className="text-gray-600 text-sm italic">{product.punjabiDescription}</p>
            </div>

            <Separator />

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AuthGuardedCart
                  product={{...product, _id: product.id}}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  quantity={quantity}
                  variant="add-to-cart"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                />
                <AuthGuardedCart
                  product={{...product, _id: product.id}}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  quantity={quantity}
                  variant="buy-now"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                />
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Free Shipping</h4>
                  <p className="text-xs text-gray-600">On orders above ₹500</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Secure Payment</h4>
                  <p className="text-xs text-gray-600">100% secure transactions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <RotateCcw className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Easy Returns</h4>
                  <p className="text-xs text-gray-600">7-day return policy</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}