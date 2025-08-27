'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Search, Filter, Grid, List, SlidersHorizontal, Star, Heart, ShoppingCart, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  sizes: string[]
  colors: string[]
  inStock: boolean
  stock: number
  isActive: boolean
  stockQuantity: number
  featured: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  punjabiName?: string
  rating?: number
  reviews?: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [productsPerPage] = useState(12) // Show 12 products per page

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Request ALL products by setting a high limit
        const response = await fetch('/api/products?limit=1000')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        console.log('Products API response:', data)
        console.log('API returned:', data.data?.length, 'products')
        
        if (data.success && data.data) {
          const activeProducts = data.data.filter((product: Product) => 
            product.isActive !== false && (product.inStock || product.stock > 0)
          )
          console.log(`Found ${activeProducts.length} active products after filtering`)
          
          setProducts(activeProducts)
          setFilteredProducts(activeProducts)
          
          // Calculate total pages
          const total = Math.ceil(activeProducts.length / productsPerPage)
          setTotalPages(total)
          
          // Initialize displayed products with first page
          setDisplayedProducts(activeProducts.slice(0, productsPerPage))
          console.log(`Showing page 1 of ${total} pages, ${productsPerPage} products per page`)
        } else {
          console.warn('No products data in response:', data)
          setProducts([])
          setFilteredProducts([])
          setDisplayedProducts([])
          setTotalPages(1)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products')
        setProducts([])
        setFilteredProducts([])
        setDisplayedProducts([])
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [productsPerPage])

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.punjabiName && product.punjabiName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredProducts(filtered)
    // Reset pagination when filters change
    setCurrentPage(1)
    const total = Math.ceil(filtered.length / productsPerPage)
    setTotalPages(total)
    setDisplayedProducts(filtered.slice(0, productsPerPage))
  }, [products, searchTerm, selectedCategory, sortBy, productsPerPage])

  // Pagination function
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    
    setCurrentPage(page)
    const startIndex = (page - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex))
  }

  // Update displayed products when current page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex))
  }, [currentPage, filteredProducts, productsPerPage])

  // Get unique categories
  const categories = ['all', ...new Set(products.map(product => product.category))]

  // Enhanced Product Card Component
  const EnhancedProductCard = ({ product }: { product: Product }) => {
    const discountPercentage = product.originalPrice && product.originalPrice > product.price 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

    return (
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-amber-200 hover:border-amber-400 bg-gradient-to-b from-white to-amber-50">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <Link href={`/products/${product.id}`}>
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={product.images?.[0] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Overlay with traditional pattern */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold px-3 py-1 shadow-lg">
              {product.category === 'fulkari' ? 'Fulkari' : 
               product.category === 'men' ? 'Men' : 
               product.category === 'women' ? 'Women' : 
               product.category === 'kids' ? 'Kids' : 
               product.category}
            </Badge>
          </div>

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold px-3 py-1 shadow-lg">
                Featured
              </Badge>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-16 z-10">
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-3 py-1 shadow-lg">
                {discountPercentage}% OFF
              </Badge>
            </div>
          )}

          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-red-600 shadow-lg border border-amber-200 w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {/* Content Section */}
        <CardContent className="p-4 space-y-3">
          {/* Product Names */}
          <div className="space-y-1">
            {product.punjabiName && (
              <h3 className="font-bold text-red-900 group-hover:text-red-700 transition-colors text-sm">
                {product.punjabiName}
              </h3>
            )}
            <h4 className="font-semibold text-amber-800 text-base line-clamp-2 group-hover:text-amber-700 transition-colors">
              {product.name}
            </h4>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating || 0) ? "text-amber-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">({product.reviews || 0})</span>
          </div>

          {/* Size and Color Preview */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              {product.sizes && product.sizes.length > 0 && (
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                  {product.sizes.length} sizes
                </span>
              )}
              {product.colors && product.colors.length > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {product.colors.length} colors
                </span>
              )}
            </div>
            <Badge variant={product.stock > 0 ? "default" : "destructive"} className="text-xs">
              {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
            </Badge>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold text-red-800">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button 
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-2"
              disabled={!product.inStock || product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Link href={`/products/${product.id}`} className="block">
              <Button 
                variant="outline" 
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 font-medium py-2"
              >
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-amber-600" />
              <p className="text-gray-600 text-lg">Loading our traditional collection...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Traditional Page Header */}
        <div className="text-center mb-12">
          <div className="relative">
            {/* Traditional decorative elements */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              ਸਾਡੇ ਉਤਪਾਦ
          </h1>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          </div>
          <h2 className="text-3xl font-semibold text-amber-800 mb-4">
            Our Products
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Discover our authentic collection of handcrafted Punjabi heritage items, 
            from traditional juttis to exquisite phulkari work. Each piece tells a story of our rich cultural heritage.
          </p>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm border-2 border-amber-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full lg:max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                <Input
                  placeholder="Search for traditional products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-52 h-12 border-amber-300 focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Choose Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : 
                       category === 'fulkari' ? 'Fulkari' :
                       category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-52 h-12 border-amber-300 focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border-2 border-amber-300 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none h-12 px-4 bg-amber-600 hover:bg-amber-700"
                >
                  <Grid className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none h-12 px-4 bg-amber-600 hover:bg-amber-700"
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Results Count and Active Filters */}
            <div className="flex flex-col lg:flex-row items-center justify-between mt-6 pt-6 border-t border-amber-200">
              <p className="text-lg text-gray-700 font-medium">
                Showing <span className="text-amber-600 font-bold">{displayedProducts.length}</span> of <span className="text-amber-600 font-bold">{filteredProducts.length}</span> traditional products
                {totalPages > 1 && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
                {totalPages === 1 && displayedProducts.length > 0 && (
                  <span className="text-sm text-green-600 ml-2">
                    (All products on this page!)
                  </span>
                )}
              </p>
              
              {/* Active Filters */}
              <div className="flex items-center gap-3 mt-4 lg:mt-0">
                {searchTerm && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300 px-3 py-1">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 hover:text-amber-900 font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300 px-3 py-1">
                    Category: {selectedCategory === 'fulkari' ? 'Fulkari' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-2 hover:text-amber-900 font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid/List with Pagination */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <Search className="h-24 w-24 mx-auto mb-6" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No traditional products found</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Try adjusting your search or filter criteria to discover our heritage collection
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50 px-6 py-3 text-lg"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <>
          <div className={
            viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "space-y-6"
          }>
              {displayedProducts.map((product) => (
              <div key={product.id} className={viewMode === 'list' ? 'w-full' : ''}>
                  <EnhancedProductCard product={product} />
              </div>
            ))}
          </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 min-w-[40px] ${
                        currentPage === page 
                          ? "bg-amber-600 text-white hover:bg-amber-700" 
                          : "border-amber-300 text-amber-700 hover:bg-amber-50"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Next
                </Button>
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <div className="text-center mt-4 text-gray-600">
                <p className="text-sm">
                  Showing page {currentPage} of {totalPages} • 
                  {displayedProducts.length} of {filteredProducts.length} products
                </p>
              </div>
            )}
          </>
        )}




      </div>

      <Footer />
    </div>
  )
}
