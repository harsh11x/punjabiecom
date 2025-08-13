'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Heart, Star, Truck, Award, Users, ShoppingCart as CartIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileNav } from "@/components/mobile-nav"
import { ShoppingCart } from "@/components/shopping-cart"
import { AuthGuardedCart } from "@/components/AuthGuardedCart"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"

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

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=8&sortBy=rating&sortOrder=desc')
      if (response.ok) {
        const data = await response.json()
        setFeaturedProducts(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b-4 border-amber-600 bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="relative">
                <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-full flex items-center justify-center border-2 lg:border-4 border-amber-300 shadow-lg">
                  <span className="text-white font-bold text-lg lg:text-2xl drop-shadow-lg">ਪ</span>
                </div>
                <div className="absolute -top-1 -right-1 w-5 lg:w-6 h-5 lg:h-6 bg-amber-400 rounded-full flex items-center justify-center">
                  <span className="text-red-800 text-xs font-bold">✦</span>
                </div>
              </div>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold text-amber-100 drop-shadow-lg">ਪੰਜਾਬ ਹੈਰਿਟੇਜ</h1>
                <h2 className="text-base lg:text-xl font-semibold text-white">Punjab Heritage</h2>
                <p className="text-xs lg:text-sm text-amber-200 font-medium hidden sm:block">
                  ਅਸਲੀ ਪੰਜਾਬੀ ਕਲਾ • Authentic Punjabi Crafts
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors border-b-2 border-amber-400"
              >
                ਘਰ • Home
              </Link>
              <div className="relative group">
                <Link
                  href="/jutti"
                  className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
                >
                  ਜੁੱਤੀ • Jutti
                </Link>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link href="/men" className="block px-4 py-3 text-red-800 hover:bg-amber-50 rounded-t-lg">
                    ਮਰਦਾਂ ਲਈ • Men's Jutti
                  </Link>
                  <Link href="/women" className="block px-4 py-3 text-red-800 hover:bg-amber-50">
                    ਔਰਤਾਂ ਲਈ • Women's Jutti
                  </Link>
                  <Link href="/kids" className="block px-4 py-3 text-red-800 hover:bg-amber-50 rounded-b-lg">
                    ਬੱਚਿਆਂ ਲਈ • Kids' Jutti
                  </Link>
                </div>
              </div>
              <Link
                href="/phulkari"
                className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
              >
                ਫੁਲਕਾਰੀ • Phulkari
              </Link>
              <Link
                href="/about"
                className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
              >
                ਸਾਡੇ ਬਾਰੇ • About
              </Link>
            </nav>

            {/* Mobile & Desktop Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-amber-100 hover:text-amber-300 hover:bg-red-700/50"
              >
                <Heart className="h-5 lg:h-6 w-5 lg:w-6" />
              </Button>
              <ShoppingCart />
              <MobileNav />
            </div>
          </div>
        </div>

        {/* Traditional Border Pattern */}
        <div className="h-1 lg:h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 lg:py-24 overflow-hidden">
        {/* Traditional Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23dc2626' fillOpacity='0.4'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 lg:space-y-10 order-2 lg:order-1">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3">
                  <div className="w-8 lg:w-12 h-1 bg-gradient-to-r from-amber-500 to-red-600"></div>
                  <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-red-900 hover:from-amber-200 hover:to-orange-200 px-3 lg:px-4 py-1 lg:py-2 text-sm lg:text-lg font-semibold border-2 border-amber-400">
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
                  size="lg"
                  className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-800 hover:via-red-700 hover:to-amber-700 text-white text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 shadow-xl border-2 border-amber-400"
                >
                  <span className="mr-2">🛍️</span>
                  ਖਰੀਦਦਾਰੀ ਕਰੋ • Shop Collection
                  <ArrowRight className="ml-2 lg:ml-3 h-5 lg:h-6 w-5 lg:w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-3 border-amber-600 text-red-800 hover:bg-gradient-to-r hover:from-amber-50 hover:to-red-50 bg-white text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 shadow-xl font-semibold"
                >
                  <span className="mr-2">📖</span>
                  ਸਾਡੀ ਕਹਾਣੀ • Our Story
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
                    className="rounded-lg lg:rounded-xl shadow-lg w-full"
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
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
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
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
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
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-amber-400"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-amber-400"></div>

                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">ਮਰਦਾਂ ਦੀ ਜੁੱਤੀ</h3>
                      <h4 className="text-xl font-semibold text-amber-200 mb-4">Men's Collection</h4>
                      <Badge className="bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold px-4 py-2">
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
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-amber-400"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-amber-400"></div>

                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">ਔਰਤਾਂ ਦੀ ਜੁੱਤੀ</h3>
                      <h4 className="text-xl font-semibold text-amber-200 mb-4">Women's Collection</h4>
                      <Badge className="bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold px-4 py-2">
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
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-amber-400"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-amber-400"></div>

                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">ਬੱਚਿਆਂ ਦੀ ਜੁੱਤੀ</h3>
                      <h4 className="text-xl font-semibold text-amber-200 mb-4">Kids' Collection</h4>
                      <Badge className="bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold px-4 py-2">
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
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fillOpacity='0.6'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
            {[
              {
                name: "Royal Punjabi Jutti - Men",
                punjabiName: "ਸ਼ਾਹੀ ਪੰਜਾਬੀ ਜੁੱਤੀ - ਮਰਦ",
                price: "₹2,499",
                originalPrice: "₹3,199",
                image: "/mens-punjabi-jutti-leather-brown-traditional.png",
                rating: 4.8,
                reviews: 124,
                badge: "ਸਭ ਤੋਂ ਵਧੀਆ",
                badgeEn: "Best Seller",
              },
              {
                name: "Bridal Phulkari Dupatta",
                punjabiName: "ਦੁਲਹਨ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ",
                price: "₹4,999",
                originalPrice: "₹6,499",
                image: "/bridal-phulkari-dupatta.png",
                rating: 4.9,
                reviews: 89,
                badge: "ਨਵਾਂ",
                badgeEn: "New",
              },
              {
                name: "Kids Colorful Jutti",
                punjabiName: "ਬੱਚਿਆਂ ਦੀ ਰੰਗੀਨ ਜੁੱਤੀ",
                price: "₹1,299",
                originalPrice: "₹1,699",
                image: "/colorful-kids-jutti.png",
                rating: 4.7,
                reviews: 156,
                badge: "ਪਸੰਦੀਦਾ",
                badgeEn: "Popular",
              },
              {
                name: "Traditional Bagh Phulkari",
                punjabiName: "ਪਰੰਪਰਾਗਤ ਬਾਗ਼ ਫੁਲਕਾਰੀ",
                price: "₹3,799",
                originalPrice: "₹4,999",
                image: "/traditional-bagh-phulkari-embroidery.png",
                rating: 4.8,
                reviews: 203,
                badge: "ਵਿਸ਼ੇਸ਼",
                badgeEn: "Special",
              },
            ].map((product, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-3 border-amber-200 hover:border-amber-400 bg-gradient-to-b from-white to-amber-50 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    <div className="absolute -inset-2 bg-gradient-to-br from-amber-300 to-red-400 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={350}
                      height={350}
                      className="relative w-full h-56 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 shadow-lg"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-600 shadow-lg border border-amber-200"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold px-3 py-1 shadow-lg">
                      {product.badge}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-red-900 group-hover:text-red-700 transition-colors text-lg mb-1">
                        {product.punjabiName}
                      </h3>
                      <h4 className="font-semibold text-amber-800 text-base">{product.name}</h4>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "text-amber-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">({product.reviews})</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-red-800">{product.price}</span>
                      <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 text-white font-semibold py-3 shadow-lg border-2 border-amber-300">
                      <span className="mr-2">🛒</span>
                      ਕਾਰਟ ਵਿੱਚ ਪਾਓ • Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-white via-amber-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-red-600"></div>
              <h2 className="text-4xl lg:text-6xl font-bold text-red-900">ਸਾਨੂੰ ਕਿਉਂ ਚੁਣੋ?</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-amber-500"></div>
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-amber-800">Why Choose Punjab Heritage?</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center space-y-6 bg-gradient-to-b from-white to-amber-50 p-8 rounded-2xl shadow-xl border-2 border-amber-200">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-4xl">🏺</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-900 mb-2">ਅਸਲੀ ਕਾਰੀਗਰੀ</h3>
                <h4 className="text-xl font-semibold text-amber-800 mb-4">Authentic Craftsmanship</h4>
              </div>
              <p className="text-red-700 leading-relaxed text-lg">
                ਹਰ ਟੁਕੜਾ ਹੁਨਰਮੰਦ ਕਾਰੀਗਰਾਂ ਦੁਆਰਾ ਪਰੰਪਰਾਗਤ ਤਕਨੀਕਾਂ ਨਾਲ ਹੱਥ ਨਾਲ ਬਣਾਇਆ ਗਿਆ ਹੈ।
                <br />
                <span className="italic text-amber-700">
                  Each piece is handcrafted by skilled artisans using traditional techniques passed down through
                  generations.
                </span>
              </p>
            </div>

            <div className="text-center space-y-6 bg-gradient-to-b from-white to-amber-50 p-8 rounded-2xl shadow-xl border-2 border-amber-200">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-4xl">🌟</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-900 mb-2">ਉੱਚ ਗੁਣਵੱਤਾ</h3>
                <h4 className="text-xl font-semibold text-amber-800 mb-4">Premium Quality</h4>
              </div>
              <p className="text-red-700 leading-relaxed text-lg">
                ਅਸੀਂ ਸਿਰਫ਼ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮੱਗਰੀ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹਾਂ - ਜੁੱਤੀ ਲਈ ਸ਼ੁੱਧ ਚਮੜਾ ਅਤੇ ਫੁਲਕਾਰੀ ਲਈ ਪ੍ਰੀਮੀਅਮ ਕੱਪੜਾ।
                <br />
                <span className="italic text-amber-700">
                  We use only the finest materials - pure leather for jutti and premium fabrics for phulkari embroidery.
                </span>
              </p>
            </div>

            <div className="text-center space-y-6 bg-gradient-to-b from-white to-amber-50 p-8 rounded-2xl shadow-xl border-2 border-amber-200">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-4xl">🚚</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-900 mb-2">ਵਿਸ਼ਵਵਿਆਪੀ ਸ਼ਿਪਿੰਗ</h3>
                <h4 className="text-xl font-semibold text-amber-800 mb-4">Worldwide Shipping</h4>
              </div>
              <p className="text-red-700 leading-relaxed text-lg">
                ਅਸੀਂ ਸੁਰੱਖਿਤ ਪੈਕੇਜਿੰਗ ਨਾਲ ਦੁਨੀਆ ਭਰ ਵਿੱਚ ਕਿਤੇ ਵੀ ਅਸਲੀ ਪੰਜਾਬੀ ਵਿਰਾਸਤ ਪਹੁੰਚਾਉਂਦੇ ਹਾਂ।
                <br />
                <span className="italic text-amber-700">
                  We deliver authentic Punjabi heritage to your doorstep anywhere in the world with secure packaging.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-red-900 via-red-800 to-amber-900 text-white py-16 relative overflow-hidden">
        {/* Traditional Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23fbbf24' fillOpacity='0.4'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center border-4 border-amber-300">
                  <span className="text-white font-bold text-2xl">ਪ</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-amber-200">ਪੰਜਾਬ ਹੈਰਿਟੇਜ</span>
                  <br />
                  <span className="text-xl font-semibold">Punjab Heritage</span>
                </div>
              </div>
              <p className="text-amber-200 leading-relaxed text-lg">
                ਪੰਜਾਬ ਦੀ ਅਮੀਰ ਸੱਭਿਆਚਾਰਕ ਵਿਰਾਸਤ ਨੂੰ ਸੰਭਾਲਣਾ ਅਤੇ ਸਾਂਝਾ ਕਰਨਾ।
                <br />
                <span className="italic text-amber-300">
                  Preserving and sharing the rich cultural heritage of Punjab through authentic handcrafted products.
                </span>
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-xl text-amber-200">ਤੇਜ਼ ਲਿੰਕ • Quick Links</h4>
              <div className="space-y-3">
                <Link href="/" className="block text-amber-100 hover:text-amber-300 transition-colors text-lg">
                  ਘਰ • Home
                </Link>
                <Link href="/jutti" className="block text-amber-100 hover:text-amber-300 transition-colors text-lg">
                  ਜੁੱਤੀ ਸੰਗ੍ਰਹਿ • Jutti Collection
                </Link>
                <Link href="/phulkari" className="block text-amber-100 hover:text-amber-300 transition-colors text-lg">
                  ਫੁਲਕਾਰੀ ਸੰਗ੍ਰਹਿ • Phulkari Collection
                </Link>
                <Link href="/about" className="block text-amber-100 hover:text-amber-300 transition-colors text-lg">
                  ਸਾਡੇ ਬਾਰੇ • About Us
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-xl text-amber-200">ਗਾਹਕ ਸੇਵਾ • Customer Care</h4>
              <div className="space-y-3">
                <Link href="/contact" className="block text-amber-100 hover:text-amber-300 transition-colors text-lg">
                  ਸੰਪਰਕ • Contact Us
                </Link>
                <Link href="/shipping" className="block text-amber-100 hover:text-amber-300 transition-colors text-lg">
                  ਸ਼ਿਪਿੰਗ ਜਾਣਕਾਰੀ • Shipping Info
                </Link>
                <Link href="/returns" className="block text-amber-100 hover:text-amber-300 transition-colors text-lg">
                  ਵਾਪਸੀ • Returns
                </Link>
                <Link
                  href="/size-guide"
                  className="block text-amber-100 hover:text-amber-300 transition-colors text-lg"
                >
                  ਸਾਈਜ਼ ਗਾਈਡ • Size Guide
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-xl text-amber-200">ਸਾਡੇ ਨਾਲ ਜੁੜੋ • Connect With Us</h4>
              <p className="text-amber-200 mb-6 text-lg leading-relaxed">
                ਨਵੇਂ ਸੰਗ੍ਰਹਿ ਅਤੇ ਸੱਭਿਆਚਾਰਕ ਕਹਾਣੀਆਂ ਲਈ ਸਾਡਾ ਪਿੱਛਾ ਕਰੋ।
                <br />
                <span className="italic text-amber-300">
                  Follow us for the latest collections and cultural stories.
                </span>
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-200 hover:text-amber-400 hover:bg-red-800/50 w-12 h-12 text-2xl"
                >
                  📘
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-200 hover:text-amber-400 hover:bg-red-800/50 w-12 h-12 text-2xl"
                >
                  📷
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-200 hover:text-amber-400 hover:bg-red-800/50 w-12 h-12 text-2xl"
                >
                  📱
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-amber-600 mt-12 pt-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✦</span>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </div>
            <div className="text-center text-amber-200 text-lg">
              <p className="mb-2">© 2024 ਪੰਜਾਬ ਹੈਰਿਟੇਜ • Punjab Heritage. ਸਾਰੇ ਅਧਿਕਾਰ ਸੁਰੱਖਿਤ • All rights reserved.</p>
              <p className="text-amber-300">
                ਪੰਜਾਬੀ ਸੱਭਿਆਚਾਰ ਨੂੰ ਸੰਭਾਲਣ ਲਈ ❤️ ਨਾਲ ਬਣਾਇਆ ਗਿਆ • Made with ❤️ for preserving Punjabi culture.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
