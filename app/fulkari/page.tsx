import { getAllProducts } from '@/lib/product-manager'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function FulkariPage() {
  // Get all products and filter for phulkari/fulkari items
  const allProducts = await getAllProducts()
  const fulkariProducts = allProducts.filter(product => 
    product.category.toLowerCase().includes('phulkari') || 
    product.category.toLowerCase().includes('fulkari') ||
    product.name.toLowerCase().includes('phulkari') ||
    product.name.toLowerCase().includes('fulkari') ||
    product.tags?.some(tag => 
      tag.toLowerCase().includes('phulkari') || 
      tag.toLowerCase().includes('fulkari')
    )
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🧵</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Phulkari Embroidery Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the vibrant world of Phulkari - traditional Punjabi embroidery that brings 
              flowers to life through intricate threadwork and stunning patterns.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {fulkariProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🧵</div>
            <h2 className="text-3xl font-bold mb-4">Phulkari Collection Coming Soon</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're curating an exquisite collection of authentic Phulkari embroidered items. 
              Each piece will showcase the traditional art of Punjabi needlework.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-3">🌸</div>
                <h3 className="font-semibold mb-2">Traditional Patterns</h3>
                <p className="text-gray-600 text-sm">
                  Authentic Phulkari designs featuring floral motifs and geometric patterns
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-3">✋</div>
                <h3 className="font-semibold mb-2">Hand Embroidered</h3>
                <p className="text-gray-600 text-sm">
                  Each piece is lovingly hand-embroidered by skilled artisans using traditional techniques
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="font-semibold mb-2">Vibrant Colors</h3>
                <p className="text-gray-600 text-sm">
                  Rich, vibrant threads that create stunning visual displays of color and pattern
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/products">
                <Button size="lg" className="mr-4">
                  Browse All Products
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Phulkari Collection</h2>
                  <p className="text-gray-600">
                    {fulkariProducts.length} product{fulkariProducts.length !== 1 ? 's' : ''} available
                  </p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Traditional Embroidery
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {fulkariProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}

        {/* About Phulkari Section */}
        <div className="mt-16 bg-white rounded-lg p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">About Phulkari Embroidery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold mb-4">The Art of Phulkari</h3>
                <p className="text-gray-600 mb-4">
                  Phulkari, meaning "flower work," is a traditional embroidery technique from Punjab. 
                  This ancient art form uses vibrant silk threads to create intricate floral and geometric patterns.
                </p>
                <p className="text-gray-600 mb-4">
                  Traditionally created by women for special occasions, Phulkari represents love, 
                  celebration, and the rich cultural heritage of Punjab.
                </p>
                <p className="text-gray-600">
                  Each piece tells a story through its patterns, colors, and the skilled hands that created it.
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">🌺</div>
                <h4 className="text-lg font-semibold mb-2">Floral Artistry</h4>
                <p className="text-gray-600">
                  Where traditional needlework meets timeless beauty and cultural expression
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Types of Phulkari */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="text-4xl mb-3">👗</div>
            <h3 className="font-semibold mb-2">Dupattas</h3>
            <p className="text-gray-600 text-sm">
              Traditional Phulkari dupattas for special occasions
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="text-4xl mb-3">👘</div>
            <h3 className="font-semibold mb-2">Suits</h3>
            <p className="text-gray-600 text-sm">
              Complete Punjabi suits with Phulkari embroidery
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="text-4xl mb-3">🧣</div>
            <h3 className="font-semibold mb-2">Shawls</h3>
            <p className="text-gray-600 text-sm">
              Elegant Phulkari shawls for warmth and style
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="text-4xl mb-3">🎒</div>
            <h3 className="font-semibold mb-2">Accessories</h3>
            <p className="text-gray-600 text-sm">
              Bags, cushions, and home decor with Phulkari work
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
