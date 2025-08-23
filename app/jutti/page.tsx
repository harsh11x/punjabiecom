'use client'

import { useState, useEffect } from 'react'
import { Filter, Heart, ShoppingBag, Star, Search, Package, Grid3X3, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthGuardedCart } from "@/components/AuthGuardedCart"
import { CartIcon } from "@/components/cart/CartIcon"
import { useSocket } from "@/hooks/useSocket"
import { toast } from 'sonner'

interface Product {
  _id?: string
  id: string
  name: string
  punjabiName?: string
  description?: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  colors: string[]
  sizes: string[]
  stock?: number
  stockQuantity?: number
  rating?: number
  reviews?: number
  isActive?: boolean
  inStock?: boolean
  badge?: string
  createdAt?: string
  updatedAt?: string
}

export default function JuttiPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, categoryFilter, sortBy, priceRange, currentPage])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        subcategory: 'jutti', // Only fetch jutti products
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(sortBy && { sort: sortBy }),
        ...(priceRange !== 'all' && { priceRange })
      })

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Jutti API Response:', data)
        setProducts(data.products || data.data || [])
        setTotalPages(data.pagination?.pages || 1)
      } else {
        console.error('API Error:', response.status, response.statusText)
        toast.error('Failed to fetch jutti products')
      }
    } catch (error) {
      console.error('Error fetching jutti products:', error)
      toast.error('Error loading jutti products')
      setProducts([])
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
    const isWishlisted = wishlist.includes(product.id)
    
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative aspect-square overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
            <span className="text-6xl">👟</span>
          </div>
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
          </Button>

          {/* Badge */}
          {product.badge && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white">
              {product.badge}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-red-900 mb-1 line-clamp-2">{product.name}</h3>
            {product.punjabiName && (
              <p className="text-sm text-amber-700 mb-2">{product.punjabiName}</p>
            )}
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{product.rating}</span>
                {product.reviews && (
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-red-600">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}'s Jutti
              </Badge>
              {product.stock && product.stock > 0 ? (
                <Badge className="bg-green-100 text-green-800 text-xs">In Stock</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 text-xs">Out of Stock</Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <AuthGuardedCart
              product={{
                _id: product.id,
                name: product.name,
                punjabiName: product.punjabiName || '',
                price: product.price,
                images: product.images || [],
                stock: product.stock || 0,
                sizes: product.sizes || [],
                colors: product.colors || []
              }}
              variant="add-to-cart"
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm"
            />
            <AuthGuardedCart
              product={{
                _id: product.id,
                name: product.name,
                punjabiName: product.punjabiName || '',
                price: product.price,
                images: product.images || [],
                stock: product.stock || 0,
                sizes: product.sizes || [],
                colors: product.colors || []
              }}
              variant="buy-now"
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white text-sm"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      {/* Enhanced Header */}
      <header className="border-b-4 border-amber-600 bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-lg">
                  <span className="text-white font-bold text-2xl drop-shadow-lg">ਪ</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                  <span className="text-red-800 text-xs font-bold">✦</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-100 drop-shadow-lg">ਪੰਜਾਬ ਹੈਰਿਟੇਜ</h1>
                <h2 className="text-xl font-semibold text-white">Punjab Heritage</h2>
                <p className="text-sm text-amber-200 font-medium">ਅਸਲੀ ਪੰਜਾਬੀ ਕਲਾ • Authentic Punjabi Crafts</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors">
                ਘਰ • Home
              </Link>
              <div className="relative group">
                <Link href="/jutti" className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors bg-red-700/50 px-4 py-2 rounded-lg">
                  ਜੁੱਤੀ • Jutti
                </Link>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link href="/men" className="block px-4 py-3 text-red-800 hover:bg-amber-50">
                    ਮਰਦਾਂ ਲਈ • Men's Jutti
                  </Link>
                  <Link href="/women" className="block px-4 py-3 text-red-800 hover:bg-amber-50">
                    ਔਰਤਾਂ ਲਈ • Women's Jutti
                  </Link>
                  <Link href="/kids" className="block px-4 py-3 text-red-800 hover:bg-amber-50">
                    ਬੱਚਿਆਂ ਲਈ • Kids' Jutti
                  </Link>
                </div>
              </div>
              <Link
                href="/fulkari"
                className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
              >
                ਫੁਲਕਾਰੀ • Fulkari
              </Link>
              <Link
                href="/about"
                className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
              >
                ਸਾਡੇ ਬਾਰੇ • About
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-amber-100 hover:text-amber-300 hover:bg-red-700/50">
                <Heart className="h-6 w-6" />
              </Button>
              <CartIcon className="text-amber-100 hover:text-amber-300 hover:bg-red-700/50" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="text-amber-100 hover:text-amber-300 hover:bg-red-700/50"
              >
                {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
      </header>

      {/* Enhanced Page Header */}
      <section className="py-16 bg-gradient-to-r from-red-800 via-red-700 to-amber-700 text-white relative overflow-hidden">
        {/* Traditional Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23fbbf24' fillOpacity='0.6'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-10 h-1 bg-gradient-to-r from-amber-400 to-white hidden md:block"></div>
              <h1 className="text-4xl lg:text-7xl font-bold drop-shadow-lg">ਪੰਜਾਬੀ ਜੁੱਤੀ</h1>
              <div className="w-10 h-1 bg-gradient-to-r from-white to-amber-400 hidden md:block"></div>
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-amber-200 mb-6">Complete Punjabi Jutti Collection</h2>
            <p className="text-lg opacity-90 max-w-4xl mx-auto leading-relaxed">
              ਸਾਡੀ ਸੁੰਦਰ ਜੁੱਤੀ ਸੰਗ੍ਰਹਿ ਵਿੱਚ ਮਰਦਾਂ, ਔਰਤਾਂ ਅਤੇ ਬੱਚਿਆਂ ਲਈ ਡਿਜ਼ਾਇਨ ਕੀਤੀ ਗਈ ਪਰੰਪਰਾਗਤ ਪੰਜਾਬੀ ਜੁੱਤੀ।
              <br />
              <span className="italic text-amber-200">
                Discover our complete collection of traditional Punjabi jutti designed for men, women, and children.
                Each piece is handcrafted with love and attention to detail, preserving our rich heritage.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="md:flex flex-col md:flex-row gap-4 mb-8 p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-900">Filter by:</span>
            </div>
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jutti products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="men">Men's Jutti</SelectItem>
                <SelectItem value="women">Women's Jutti</SelectItem>
                <SelectItem value="kids">Kids' Jutti</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
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
              <SelectTrigger className="w-full md:w-48">
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jutti products found</h3>
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
                disabled={currentPage === 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
