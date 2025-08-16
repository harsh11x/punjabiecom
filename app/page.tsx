import { getAllProducts, getFeaturedProducts } from '@/lib/product-manager'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  const [allProducts, featuredProducts] = await Promise.all([
    getAllProducts(),
    getFeaturedProducts()
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-red-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-orange-600">Punjabi Heritage</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Authentic Traditional Products • Handcrafted with Love • Delivered Worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="text-lg px-8 py-3">
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Collections
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the beauty of Punjab through our carefully curated collection of traditional products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">👡</div>
                <h3 className="text-2xl font-semibold mb-3">Traditional Juttis</h3>
                <p className="text-gray-600 mb-4">
                  Handcrafted leather footwear with intricate embroidery and traditional designs
                </p>
                <Link href="/products?category=juttis">
                  <Button variant="outline" className="group-hover:bg-orange-600 group-hover:text-white">
                    Explore Juttis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🧵</div>
                <h3 className="text-2xl font-semibold mb-3">Phulkari Work</h3>
                <p className="text-gray-600 mb-4">
                  Beautiful embroidered dupattas, suits, and accessories with traditional Phulkari patterns
                </p>
                <Link href="/products?category=phulkari">
                  <Button variant="outline" className="group-hover:bg-orange-600 group-hover:text-white">
                    Explore Phulkari
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">👗</div>
                <h3 className="text-2xl font-semibold mb-3">Traditional Wear</h3>
                <p className="text-gray-600 mb-4">
                  Authentic Punjabi suits, kurtas, and accessories for men and women
                </p>
                <Link href="/products?category=clothing">
                  <Button variant="outline" className="group-hover:bg-orange-600 group-hover:text-white">
                    Explore Clothing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              {featuredProducts.length > 0 
                ? "Handpicked favorites from our collection"
                : "New products will be featured here soon"
              }
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">🌟</div>
              <h3 className="text-2xl font-semibold mb-4">Featured Products Coming Soon</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Our team is carefully selecting the best products to feature here. 
                Check back soon for amazing deals!
              </p>
              <Link href="/products">
                <Button>
                  View All Products
                </Button>
              </Link>
            </div>
          )}

          {featuredProducts.length > 8 && (
            <div className="text-center mt-8">
              <Link href="/products">
                <Button size="lg">
                  View All Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Preserving Punjab's Rich Heritage
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At Punjabi Heritage Store, we're passionate about preserving and sharing the beautiful 
                traditions of Punjab. Each product in our collection tells a story of craftsmanship, 
                culture, and heritage passed down through generations.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                From intricate Phulkari embroidery to handcrafted Juttis, every item is carefully 
                selected to bring you authentic pieces that celebrate Punjabi culture.
              </p>
              <Link href="/about">
                <Button size="lg">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 text-center">
                <div className="text-8xl mb-4">🏛️</div>
                <h3 className="text-2xl font-semibold mb-4">Heritage & Tradition</h3>
                <p className="text-gray-600">
                  Connecting you with authentic Punjabi craftsmanship and cultural treasures
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{allProducts.length}+</div>
              <div className="text-orange-100">Products Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-orange-100">Authentic Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-orange-100">Customer Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">🌍</div>
              <div className="text-orange-100">Worldwide Shipping</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
