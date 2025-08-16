import { getAllProducts, getProductsByCategory } from '@/lib/product-manager'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function JuttiPage() {
  // Get all products and filter for juttis
  const allProducts = await getAllProducts()
  const juttiProducts = allProducts.filter(product => 
    product.category.toLowerCase().includes('jutti') || 
    product.name.toLowerCase().includes('jutti') ||
    product.tags?.some(tag => tag.toLowerCase().includes('jutti'))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">👡</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Traditional Punjabi Juttis
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our exquisite collection of handcrafted Punjabi juttis. Each pair tells a story 
              of traditional craftsmanship, comfort, and timeless style.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {juttiProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">👡</div>
            <h2 className="text-3xl font-bold mb-4">Jutti Collection Coming Soon</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're carefully curating an amazing collection of traditional Punjabi juttis. 
              Each pair will be handcrafted by skilled artisans using authentic techniques.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="font-semibold mb-2">Handcrafted Quality</h3>
                <p className="text-gray-600 text-sm">
                  Each jutti is meticulously crafted by skilled artisans using traditional techniques
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="font-semibold mb-2">Authentic Designs</h3>
                <p className="text-gray-600 text-sm">
                  Traditional patterns and motifs that celebrate Punjabi heritage and culture
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-3">💎</div>
                <h3 className="font-semibold mb-2">Premium Materials</h3>
                <p className="text-gray-600 text-sm">
                  Finest leather and materials sourced from trusted suppliers across Punjab
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
                  <h2 className="text-2xl font-bold">Jutti Collection</h2>
                  <p className="text-gray-600">
                    {juttiProducts.length} product{juttiProducts.length !== 1 ? 's' : ''} available
                  </p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Traditional Footwear
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {juttiProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}

        {/* About Juttis Section */}
        <div className="mt-16 bg-white rounded-lg p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">About Punjabi Juttis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold mb-4">A Heritage of Craftsmanship</h3>
                <p className="text-gray-600 mb-4">
                  Punjabi juttis are traditional leather shoes that have been worn in Punjab for centuries. 
                  These handcrafted shoes are known for their comfort, durability, and intricate designs.
                </p>
                <p className="text-gray-600 mb-4">
                  Each pair is made using traditional techniques passed down through generations, 
                  featuring beautiful embroidery, beadwork, and authentic Punjabi motifs.
                </p>
                <p className="text-gray-600">
                  Perfect for weddings, festivals, or adding a touch of traditional elegance to any outfit.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">👡</div>
                <h4 className="text-lg font-semibold mb-2">Traditional Comfort</h4>
                <p className="text-gray-600">
                  Experience the perfect blend of traditional style and modern comfort
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
