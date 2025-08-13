'use client'

import { useState, useEffect } from 'react'
import { Filter, Heart, ShoppingBag, Star, Search, Users, Package, Grid3X3, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthGuardedCart } from "@/components/AuthGuardedCart"
import { useSocket } from "@/hooks/useSocket"
import { toast } from 'sonner'

interface Product {
  _id: string
  name: string
  punjabiName: string
  description: string
  price: number
  originalPrice: number
  category: string
  subcategory?: string
  images: string[]
  colors: string[]
  sizes: string[]
  stock: number
  rating: number
  reviews: number
  isActive: boolean
  badge?: string
}

export default function WomenPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [subcategoryFilter, setSubcategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [wishlist, setWishlist] = useState<string[]>([])

  const socket = useSocket({
    onProductUpdate: () => {
      fetchProducts()
    }
  })

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, subcategoryFilter, sortBy, priceRange, currentPage])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        category: 'women', // Only fetch women's products
        ...(searchTerm && { search: searchTerm }),
        ...(subcategoryFilter !== 'all' && { subcategory: subcategoryFilter }),
        ...(sortBy && { sort: sortBy }),
        ...(priceRange !== 'all' && { priceRange })
      })

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data || [])
        setTotalPages(data.pagination?.pages || 1)
      } else {
        toast.error('Failed to fetch women\'s products')
      }
    } catch (error) {
      console.error('Error fetching women\'s products:', error)
      toast.error('Error loading women\'s products')
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    const isWishlisted = wishlist.includes(product._id)

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative aspect-square">
          <Link href={`/products/${product._id}`}>
            <Image
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover cursor-pointer group-hover:scale-105 transition-transform"
            />
          </Link>
          {product.badge && (
            <Badge className="absolute top-2 left-2 bg-pink-600 text-white text-xs">
              {product.badge}
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-green-600 text-white text-xs">
              {discountPercentage}% OFF
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleWishlist(product._id)}
            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>
        
        <CardContent className="p-4">
          <Link href={`/products/${product._id}`}>
            <h3 className="font-semibold text-lg text-gray-900 hover:text-pink-600 cursor-pointer mb-1 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm mb-2 line-clamp-1">{product.punjabiName}</p>
          
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviews})</span>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-bold text-pink-600">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <div className="flex items-center justify-between mb-3">
            <Badge variant={product.stock > 0 ? "default" : "destructive"} className="text-xs">
              {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
            </Badge>
            <Badge variant="outline" className="text-xs bg-pink-50 text-pink-700">Women's</Badge>
          </div>

          <div className="space-y-2">
            <AuthGuardedCart
              product={product}
              variant="add-to-cart"
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-sm"
            />
            <AuthGuardedCart
              product={product}
              variant="buy-now"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white text-sm"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-purple-50">
      {/* Header */}
      <header className="border-b-4 border-pink-600 bg-gradient-to-r from-purple-900 via-pink-900 to-rose-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-pink-300" />
              <div>
                <h1 className="text-2xl font-bold text-pink-100">Women's Collection</h1>
                <p className="text-pink-200">ਔਰਤਾਂ ਦਾ ਸੰਗ੍ਰਹਿ • Elegant Punjabi wear for women</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="text-pink-100 hover:text-pink-300 hover:bg-pink-800/50"
              >
                {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500"></div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search women's products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              <SelectItem value="jutti">Jutti</SelectItem>
              <SelectItem value="suit">Suit</SelectItem>
              <SelectItem value="dupatta">Dupatta</SelectItem>
              <SelectItem value="jewelry">Jewelry</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="bridal">Bridal Wear</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-500">Under ₹500</SelectItem>
              <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
              <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
              <SelectItem value="2000-5000">₹2,000 - ₹5,000</SelectItem>
              <SelectItem value="5000+">Above ₹5,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No women's products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}