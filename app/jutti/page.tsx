'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ResponsiveProductCard } from '@/components/responsive-product-card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'

interface Product {
  _id?: string
  id?: string
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

export default function JuttiPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [productsPerPage] = useState(12)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('🔄 Fetching all products for Jutti page...')
      
      // Fetch all products first
      const response = await fetch('/api/products?limit=1000')
        
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
        
      const data = await response.json()
      console.log('📦 Raw API response:', data)
      
      if (data.success) {
        const allProducts = data.data || []
        console.log(`📊 Total products received: ${allProducts.length}`)
        
        // Filter to show only jutti products
        const juttiProducts = allProducts.filter((product: Product) => {
          const isJutti = product.subcategory === 'jutti' || 
                         product.category === 'jutti' ||
                         (product.category === 'men' && product.subcategory === 'jutti') ||
                         (product.category === 'women' && product.subcategory === 'jutti') ||
                         (product.category === 'kids' && product.subcategory === 'jutti')
          
          console.log(`🔍 Product: ${product.name}, Category: ${product.category}, Subcategory: ${product.subcategory}, Is Jutti: ${isJutti}`)
          return isJutti
        })
        
        console.log(`✅ Found ${juttiProducts.length} jutti products from ${allProducts.length} total products`)
        setProducts(juttiProducts)
        setFilteredProducts(juttiProducts)
        
        // Calculate total pages
        const total = Math.ceil(juttiProducts.length / productsPerPage)
        setTotalPages(total)
        
        // Initialize displayed products with first page
        setDisplayedProducts(juttiProducts.slice(0, productsPerPage))
        console.log(`Showing page 1 of ${total} pages, ${productsPerPage} products per page`)
      } else {
        throw new Error(data.message || 'Failed to fetch products')
      }
    } catch (err) {
      console.error('❌ Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-red-900 font-medium">ਜੁੱਤੀ ਉਤਪਾਦ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...</p>
            <p className="text-amber-800">Loading Jutti Products...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-900 mb-4">Error Loading Products</h1>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 py-16 lg:py-24">
        <div className="absolute inset-0 bg-[url('/traditional-bagh-phulkari-embroidery.png')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-red-900 mb-6">
            <span className="block">ਪੰਜਾਬੀ ਜੁੱਤੀ</span>
            <span className="block text-3xl lg:text-5xl text-amber-800">Punjabi Jutti Collection</span>
          </h1>
          <p className="text-xl text-amber-800 max-w-3xl mx-auto leading-relaxed">
            Discover our exquisite collection of traditional Punjabi Jutti, handcrafted with love and heritage. 
            From men's classic designs to women's bridal elegance and kids' colorful styles.
          </p>
        </div>
        </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-red-900 mb-4">
            Our Jutti Collection
          </h2>
          <p className="text-lg text-amber-800">
            {displayedProducts.length} of {products.length} beautiful jutti designs to choose from
          </p>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-amber-600 text-6xl mb-4">👟</div>
            <h3 className="text-2xl font-semibold text-amber-800 mb-2">No Jutti Products Found</h3>
            <p className="text-amber-700 mb-6">We're currently updating our collection. Please check back soon!</p>
            <button 
              onClick={fetchProducts}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Refresh Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ResponsiveProductCard key={product._id || product.id} product={product} />
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
