import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Data file paths
const DATA_DIR = path.resolve(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

function getProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    return []
  }
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading products:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') // Remove default limit to show all products
    
    // Get all products from JSON file
    const allProducts = getProducts()
    
    if (allProducts.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      })
    }
    
    // Filter active products only
    const activeProducts = allProducts.filter((p: any) => p.isActive !== false)
    
    // Get featured products with specific distribution:
    // 3 women's jutti, 3 men's jutti, 2 kid's jutti, 2 phulkari, then all remaining products
    const womenJutti = activeProducts
      .filter((p: any) => 
        p.category && p.category.toLowerCase().includes('women') || 
        p.category && p.category.toLowerCase().includes('ladies') ||
        p.category && p.category.toLowerCase().includes('bridal')
      )
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3)
    
    const menJutti = activeProducts
      .filter((p: any) => 
        p.category && p.category.toLowerCase().includes('men') || 
        p.category && p.category.toLowerCase().includes('gents') ||
        p.category && p.category.toLowerCase().includes('male')
      )
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3)
    
    const kidsJutti = activeProducts
      .filter((p: any) => 
        p.category && p.category.toLowerCase().includes('kids') || 
        p.category && p.category.toLowerCase().includes('children') ||
        p.category && p.category.toLowerCase().includes('baby') ||
        p.category && p.category.toLowerCase().includes('infant')
      )
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 2)
    
    const phulkari = activeProducts
      .filter((p: any) => 
        p.category && p.category.toLowerCase().includes('phulkari') || 
        p.category && p.category.toLowerCase().includes('dupatta') ||
        p.category && p.category.toLowerCase().includes('embroidery') ||
        p.category && p.category.toLowerCase().includes('textile')
      )
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 2)
    
    // Get all remaining products that don't fall into the above categories
    const featuredIds = [...womenJutti, ...menJutti, ...kidsJutti, ...phulkari].map(p => p.id)
    const remainingProducts = activeProducts
      .filter((p: any) => !featuredIds.includes(p.id))
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
    
    // Combine all products in the specified order
    const finalProducts = [
      ...womenJutti,
      ...menJutti,
      ...kidsJutti,
      ...phulkari,
      ...remainingProducts
    ]
    
    // Apply limit if specified, otherwise return all products
    const limitedProducts = limit ? finalProducts.slice(0, parseInt(limit)) : finalProducts
    
    // Transform products to match frontend interface
    const transformedProducts = limitedProducts.map((product: any) => ({
      _id: product.id || product._id || '',
      name: product.name || '',
      punjabiName: product.punjabiName || product.name || '',
      description: product.description || '',
      price: product.price || 0,
      originalPrice: product.originalPrice || product.price || 0,
      category: product.category || '',
      images: product.images || [],
      colors: product.colors || [],
      sizes: product.sizes || [],
      stock: product.stock || product.stockQuantity || 0,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      isActive: product.isActive !== false,
      badge: product.badge || ''
    }))
    
    // Set cache headers for better performance
    const response = NextResponse.json({
      success: true,
      data: transformedProducts,
      total: transformedProducts.length
    })
    
    // Cache for 1 minute on client, 5 minutes on CDN
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300')
    
    return response
    
  } catch (error) {
    console.error('Error fetching featured products:', error)
    
    // Return empty array instead of error for better user experience
    return NextResponse.json({
      success: true,
      data: [],
      total: 0
    })
  }
}
