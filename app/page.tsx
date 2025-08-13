import { ArrowRight, Heart, Star, Truck, Award, Users, ShoppingCart as CartIcon, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveProductCard } from "@/components/responsive-product-card"
import { Header } from "@/components/header"
import { FeaturedProductsClient } from "@/components/featured-products-client"

interface Product {
  _id: string
  name: string
  punjabiName: string
  description: string
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
}

// Fetch products at build time for better performance
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    // Use fallback approach since server-side fetch might fail during build
    return []
  } catch (error) {
    console.error('Error fetching featured products:', error)
  }
  return []
}

export default async function HomePage() {
  // Fetch products on server side for faster initial load
  const initialProducts = await getFeaturedProducts()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fillOpacity='0.6'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 lg:space-y-10 order-2 lg:order-1">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3">
                  <div className="w-8 lg:w-12 h-1 bg-gradient-to-r from-amber-500 to-red-600"></div>
                  <Badge variant="default" className="bg-gradient-to-r from-amber-100 to-orange-100 text-red-900 hover:from-amber-200 hover:to-orange-200 px-3 lg:px-4 py-1 lg:py-2 text-sm lg:text-lg font-semibold border-2 border-amber-400">
                    ਪੰਜਾਬੀ ਵਿਰਾਸਤ • Punjabi Heritage
                  </Badge>
                  <div className="w-8 lg:w-12 h-1 bg-gradient-to-r from-red-600 to-amber-500"></div>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold leading-tight text-center lg:text-left">
                  <span className="text-red-900 drop-shadow-lg">ਅਸਲੀ</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
                    Handcrafted
                  </span>
                  <br />
                  <span className="text-red-900 drop-shadow-lg">ਪੰਜਾਬੀ</span>
                  <br />
                  <span className="text-amber-700">Treasures</span>
                </h1>

                <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 lg:p-6 rounded-2xl border-l-4 border-amber-500 shadow-lg">
                  <p className="text-lg lg:text-xl text-red-800 leading-relaxed font-medium text-center lg:text-left">
                    ਸਾਡੇ ਕੋਲ ਪੰਜਾਬ ਦੀ ਸਭ ਤੋਂ ਵਧੀਆ ਹੱਥ ਨਾਲ ਬਣੀ ਜੁੱਤੀ ਅਤੇ ਫੁਲਕਾਰੀ ਦਾ ਸੰਗ੍ਰਹਿ ਹੈ।
                    <br />
                    <span className="text-amber-800 italic">
                      Discover the finest collection of traditional handmade leather jutti and exquisite phulkari,
                      crafted by master artisans preserving centuries-old Punjabi heritage.
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-800 hover:via-red-700 hover:to-amber-700 text-white text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 shadow-xl border-2 border-amber-400"
                >
                  <Link href="/products">
                    <span className="mr-2">🛍️</span>
                    ਖਰੀਦਦਾਰੀ ਕਰੋ • Shop Collection
                    <ArrowRight className="ml-2 lg:ml-3 h-5 lg:h-6 w-5 lg:w-6" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-3 border-amber-600 text-red-800 hover:bg-gradient-to-r hover:from-amber-50 hover:to-red-50 bg-white text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 shadow-xl font-semibold"
                >
                  <Link href="/our-story">
                    <span className="mr-2">📖</span>
                    ਸਾਡੀ ਕਹਾਣੀ • Our Story
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-6 lg:pt-8">
                <div className="flex items-center justify-center lg:justify-start space-x-3 bg-white/80 p-3 lg:p-4 rounded-xl shadow-lg border border-amber-200">
                  <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
                    <Truck className="h-5 lg:h-6 w-5 lg:w-6 text-white" />
                  </div>
                  <div className="text-center lg:text-left">
                    <span className="text-xs lg:text-sm font-bold text-red-900">ਮੁਫਤ ਡਿਲੀਵਰੀ</span>
                    <br />
                    <span className="text-xs text-amber-700">Free Shipping</span>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:justify-start space-x-3 bg-white/80 p-3 lg:p-4 rounded-xl shadow-lg border border-amber-200">
                  <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 lg:h-6 w-5 lg:w-6 text-white" />
                  </div>
                  <div className="text-center lg:text-left">
                    <span className="text-xs lg:text-sm font-bold text-red-900">5000+ ਖੁਸ਼ ਗਾਹਕ</span>
                    <br />
                    <span className="text-xs text-amber-700">Happy Customers</span>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:justify-start space-x-3 bg-white/80 p-3 lg:p-4 rounded-xl shadow-lg border border-amber-200">
                  <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
                    <Award className="h-5 lg:h-6 w-5 lg:w-6 text-white" />
                  </div>
                  <div className="text-center lg:text-left">
                    <span className="text-xs lg:text-sm font-bold text-red-900">ਪ੍ਰਮਾਣਿਤ ਗੁਣਵੱਤਾ</span>
                    <br />
                    <span className="text-xs text-amber-700">Certified Quality</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative z-10">
                {/* Decorative Frame */}
                <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-2xl lg:rounded-3xl opacity-20 blur-lg"></div>
                <div className="absolute -inset-1 lg:-inset-2 bg-gradient-to-br from-amber-300 to-red-500 rounded-xl lg:rounded-2xl"></div>
                <div className="relative bg-white p-1 lg:p-2 rounded-xl lg:rounded-2xl shadow-2xl">
                <Image
                  src="/punjabi-jutti-shoes.png"
                  alt="Traditional Punjabi Jutti"
                  width={600}
                  height={700}
                  priority
                  className="rounded-lg lg:rounded-xl shadow-lg w-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                </div>
              </div>

              {/* Floating Decorative Elements - Hidden on mobile */}
              <div className="hidden lg:block absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-amber-400 to-red-500 rounded-full opacity-30 animate-pulse"></div>
              <div className="hidden lg:block absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-red-400 to-amber-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-25 animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Separator */}
      <div className="py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">✦</span>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-white via-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <div className="flex items-center justify-center space-x-2 lg:space-x-4 mb-4 lg:mb-6">
              <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-amber-500 to-red-600"></div>
              <h2 className="text-3xl lg:text-4xl xl:text-6xl font-bold text-red-900">ਸਾਡੇ ਸੰਗ੍ਰਹਿ</h2>
              <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-red-600 to-amber-500"></div>
            </div>
            <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-800 mb-4 lg:mb-6">
              Our Heritage Collections
            </h3>
            <p className="text-lg lg:text-xl text-red-700 max-w-3xl mx-auto leading-relaxed px-4">
              ਹਰ ਟੁਕੜਾ ਪਰੰਪਰਾ, ਕਾਰੀਗਰੀ ਅਤੇ ਪੰਜਾਬ ਦੇ ਜੀਵੰਤ ਸੱਭਿਆਚਾਰ ਦੀ ਕਹਾਣੀ ਕਹਿੰਦਾ ਹੈ।
              <br />
              <span className="italic text-amber-700">
                Each piece tells a story of tradition, craftsmanship, and the vibrant culture of Punjab
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <Card className="group cursor-pointer overflow-hidden border-4 border-amber-200 hover:border-amber-400 transition-all duration-500 shadow-2xl bg-gradient-to-br from-white to-amber-50">
              <CardContent className="p-0">
                <div className="relative">
                <Image
                  src="/colorful-punjabi-jutti.png"
                  alt="Traditional Jutti Collection"
                  width={700}
                  height={500}
                  priority
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Traditional Corner Decorations */}
                  <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-amber-400"></div>
                  <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-amber-400"></div>

                  <div className="absolute bottom-8 left-8 text-white">
                    <div className="mb-4">
                      <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">ਹੱਥ ਨਾਲ ਬਣੀ ਚਮੜੇ ਦੀ ਜੁੱਤੀ</h3>
                      <h4 className="text-2xl font-semibold text-amber-200">Handmade Leather Jutti</h4>
                      <p className="text-lg opacity-90 mb-6 text-amber-100">
                        ਮਰਦਾਂ, ਔਰਤਾਂ ਅਤੇ ਬੱਚਿਆਂ ਲਈ • For Men, Women & Kids
                      </p>
                    </div>
                    <Link href="/men">
                      <Button className="bg-gradient-to-r from-amber-500 to-red-600 text-white hover:from-amber-600 hover:to-red-700 text-lg px-6 py-3 shadow-xl border-2 border-amber-300">
                        <span className="mr-2">👞</span>
                        ਜੁੱਤੀ ਸੰਗ੍ਰਹਿ ਦੇਖੋ
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer overflow-hidden border-4 border-amber-200 hover:border-amber-400 transition-all duration-500 shadow-2xl bg-gradient-to-br from-white to-amber-50">
              <CardContent className="p-0">
                <div className="relative">
                <Image
                  src="/punjabi-phulkari-dupatta.png"
                  alt="Traditional Phulkari Collection"
                  width={700}
                  height={500}
                  priority
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Traditional Corner Decorations */}
                  <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-amber-400"></div>
                  <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-amber-400"></div>

                  <div className="absolute bottom-8 left-8 text-white">
                    <div className="mb-4">
                      <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">ਹੱਥ ਨਾਲ ਬਣੀ ਫੁਲਕਾਰੀ</h3>
                      <h4 className="text-2xl font-semibold text-amber-200">Handcrafted Phulkari</h4>
                      <p className="text-lg opacity-90 mb-6 text-amber-100">
                        ਪਰੰਪਰਾਗਤ ਕਢਾਈ ਦੀ ਕਲਾ • Traditional Embroidered Art
                      </p>
                    </div>
                    <Button className="bg-gradient-to-r from-amber-500 to-red-600 text-white hover:from-amber-600 hover:to-red-700 text-lg px-6 py-3 shadow-xl border-2 border-amber-300">
                      <span className="mr-2">🌸</span>
                      ਫੁਲਕਾਰੀ ਸੰਗ੍ਰਹਿ ਦੇਖੋ
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-white via-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <div className="flex items-center justify-center space-x-2 lg:space-x-4 mb-4 lg:mb-6">
              <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-amber-500 to-red-600"></div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-bold text-red-900">
                ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਖਰੀਦਦਾਰੀ
              </h2>
              <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-red-600 to-amber-500"></div>
            </div>
            <h3 className="text-xl lg:text-2xl xl:text-4xl font-bold text-amber-800 mb-4 lg:mb-6">Shop by Category</h3>
            <p className="text-lg lg:text-xl text-red-700 leading-relaxed">ਹਰ ਉਮਰ ਅਤੇ ਲਿੰਗ ਲਈ ਵਿਸ਼ੇਸ਼ ਸੰਗ੍ਰਹਿ</p>
            <p className="text-base lg:text-lg text-amber-700 italic">Special collections for every age and gender</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Link href="/men" className="group">
              <Card className="cursor-pointer overflow-hidden border-4 border-amber-200 hover:border-amber-400 transition-all duration-500 shadow-2xl bg-gradient-to-br from-white to-amber-50 h-full">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src="/mens-punjabi-jutti-leather-brown-traditional.png"
                      alt="Men's Jutti Collection"
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-amber-400"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-amber-400"></div>

                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">ਮਰਦਾਂ ਦੀ ਜੁੱਤੀ</h3>
                      <h4 className="text-xl font-semibold text-amber-200 mb-4">Men's Collection</h4>
                      <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold px-4 py-2">
                        50+ ਉਤਪਾਦ • Products
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/women" className="group">
              <Card className="cursor-pointer overflow-hidden border-4 border-amber-200 hover:border-amber-400 transition-all duration-500 shadow-2xl bg-gradient-to-br from-white to-amber-50 h-full">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src="/womens-bridal-jutti-gold.png"
                      alt="Women's Jutti Collection"
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-amber-400"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-amber-400"></div>

                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">ਔਰਤਾਂ ਦੀ ਜੁੱਤੀ</h3>
                      <h4 className="text-xl font-semibold text-amber-200 mb-4">Women's Collection</h4>
                      <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold px-4 py-2">
                        75+ ਉਤਪਾਦ • Products
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/kids" className="group">
              <Card className="cursor-pointer overflow-hidden border-4 border-amber-200 hover:border-amber-400 transition-all duration-500 shadow-2xl bg-gradient-to-br from-white to-amber-50 h-full">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src="/colorful-kids-jutti.png"
                      alt="Kids' Jutti Collection"
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-amber-400"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-amber-400"></div>

                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">ਬੱਚਿਆਂ ਦੀ ਜੁੱਤੀ</h3>
                      <h4 className="text-xl font-semibold text-amber-200 mb-4">Kids' Collection</h4>
                      <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold px-4 py-2">
                        30+ ਉਤਪਾਦ • Products
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-red-50 via-orange-50 to-amber-50 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fillOpacity='0.6'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12 lg:mb-16">
            <div className="flex items-center justify-center space-x-2 lg:space-x-4 mb-4 lg:mb-6">
              <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-amber-500 to-red-600"></div>
              <h2 className="text-3xl lg:text-4xl xl:text-6xl font-bold text-red-900">ਖਾਸ ਉਤਪਾਦ</h2>
              <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-red-600 to-amber-500"></div>
            </div>
            <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-800 mb-4 lg:mb-6">
              Featured Products
            </h3>
            <p className="text-lg lg:text-xl text-red-700 leading-relaxed">ਸਾਡੇ ਕਾਰੀਗਰ ਸੰਗ੍ਰਹਿ ਤੋਂ ਹੱਥ ਨਾਲ ਚੁਣੇ ਗਏ ਖਜ਼ਾਨੇ</p>
            <p className="text-base lg:text-lg text-amber-700 italic">
              Handpicked treasures from our artisan collection
            </p>
          </div>

          <FeaturedProductsClient initialProducts={initialProducts} />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <div className="flex items-center justify-center space-x-2 lg:space-x-4 mb-4 lg:mb-6">
              <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-amber-500 to-red-600"></div>
              <h2 className="text-3xl lg:text-4xl xl:text-6xl font-bold text-red-900">ਸਾਨੂੰ ਕਿਉਂ ਚੁਣੋ?</h2>
              <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-red-600 to-amber-500"></div>
            </div>
            <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-800 mb-4 lg:mb-6">
              Why Choose Punjab Heritage?
            </h3>
            <p className="text-lg lg:text-xl text-red-700 leading-relaxed">ਸਾਡੀ ਵਿਰਾਸਤ ਅਤੇ ਗੁਣਵੱਤਾ ਦੀ ਗਾਰੰਟੀ</p>
            <p className="text-base lg:text-lg text-amber-700 italic">
              Our heritage and quality guarantee
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-10 lg:h-12 w-10 lg:w-12 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-amber-400 to-red-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-red-900 mb-4">ਹੱਥ ਨਾਲ ਬਣਾਈ ਗਈ</h3>
              <h4 className="text-lg lg:text-xl font-semibold text-amber-800 mb-4">Handcrafted Excellence</h4>
              <p className="text-red-700 leading-relaxed">
                ਹਰੇਕ ਟੁਕੜਾ ਸਾਡੇ ਮਾਹਿਰ ਕਾਰੀਗਰਾਂ ਦੁਆਰਾ ਪਰੰਪਰਾਗਤ ਤਕਨੀਕਾਂ ਨਾਲ ਹੱਥ ਨਾਲ ਬਣਾਇਆ ਗਿਆ ਹੈ।
                <br />
                <span className="text-amber-700 italic">
                  Each piece is handcrafted by our master artisans using traditional techniques.
                </span>
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-10 lg:h-12 w-10 lg:w-12 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-amber-400 to-red-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-red-900 mb-4">ਪ੍ਰੀਮੀਅਮ ਗੁਣਵੱਤਾ</h3>
              <h4 className="text-lg lg:text-xl font-semibold text-amber-800 mb-4">Premium Quality</h4>
              <p className="text-red-700 leading-relaxed">
                ਸਾਡੇ ਉਤਪਾਦ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮੱਗਰੀ ਅਤੇ ਗੁਣਵੱਤਾ ਦੇ ਮਾਪਦੰਡਾਂ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹਨ।
                <br />
                <span className="text-amber-700 italic">
                  Our products meet the highest standards of materials and craftsmanship.
                </span>
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 lg:h-12 w-10 lg:w-12 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-amber-400 to-red-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-red-900 mb-4">ਪਰੰਪਰਾ ਦੀ ਸੰਭਾਲ</h3>
              <h4 className="text-lg lg:text-xl font-semibold text-amber-800 mb-4">Heritage Preservation</h4>
              <p className="text-red-700 leading-relaxed">
                ਅਸੀਂ ਸਦੀਆਂ ਪੁਰਾਣੀ ਪੰਜਾਬੀ ਵਿਰਾਸਤ ਅਤੇ ਸੱਭਿਆਚਾਰ ਨੂੰ ਜ਼ਿੰਦਾ ਰੱਖਣ ਲਈ ਕੰਮ ਕਰਦੇ ਹਾਂ।
                <br />
                <span className="text-amber-700 italic">
                  We work to preserve centuries-old Punjabi heritage and culture.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
