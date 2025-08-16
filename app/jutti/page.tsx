"use client"

import { Filter, Heart, ShoppingBag, Star, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CartIcon } from "@/components/cart/CartIcon"
import { AuthGuardedCart } from "@/components/AuthGuardedCart"
import { useState } from "react"

export default function JuttiPage() {
  const products = [
    {
      id: 1,
      name: "Royal Punjabi Jutti - Men",
      price: "₹2,499",
      originalPrice: "₹3,199",
      image: "/mens-punjabi-jutti-leather-brown-traditional.png",
      rating: 4.8,
      reviews: 124,
      category: "Men",
      colors: ["Brown", "Black", "Tan"],
    },
    {
      id: 2,
      name: "Bridal Gold Jutti - Women",
      price: "₹3,299",
      originalPrice: "₹4,199",
      image: "/womens-bridal-jutti-gold.png",
      rating: 4.9,
      reviews: 89,
      category: "Women",
      colors: ["Gold", "Red", "Pink"],
    },
    {
      id: 3,
      name: "Kids Colorful Jutti",
      price: "₹1,299",
      originalPrice: "₹1,699",
      image: "/colorful-kids-jutti.png",
      rating: 4.7,
      reviews: 156,
      category: "Kids",
      colors: ["Multi", "Blue", "Pink"],
    },
    {
      id: 4,
      name: "Traditional Khussa - Men",
      price: "₹2,799",
      originalPrice: "₹3,599",
      image: "/mens-traditional-khussa.png",
      rating: 4.6,
      reviews: 203,
      category: "Men",
      colors: ["Black", "Brown", "Maroon"],
    },
    {
      id: 5,
      name: "Embroidered Jutti - Women",
      price: "₹2,899",
      originalPrice: "₹3,699",
      image: "/womens-embroidered-jutti.png",
      rating: 4.8,
      reviews: 167,
      category: "Women",
      colors: ["Red", "Green", "Blue"],
    },
    {
      id: 6,
      name: "Casual Jutti - Men",
      price: "₹1,999",
      originalPrice: "₹2,599",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.5,
      reviews: 134,
      category: "Men",
      colors: ["Brown", "Tan", "Black"],
    },
  ]

  const [open, setOpen] = useState(false)

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
                <Link href="/jutti" className="text-amber-300 font-bold text-lg border-b-2 border-amber-400">
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
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-amber-100 hover:text-amber-300 hover:bg-red-700/50"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-red-900 text-white">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>Explore our site.</SheetDescription>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4 py-4">
                    <Link
                      href="/"
                      className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
                    >
                      ਘਰ • Home
                    </Link>
                    <Link href="/jutti" className="text-amber-300 font-bold text-lg border-b-2 border-amber-400">
                      ਜੁੱਤੀ • Jutti
                    </Link>
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
                </SheetContent>
              </Sheet>
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
              <h1 className="text-4xl lg:text-7xl font-bold drop-shadow-lg">ਜੁੱਤੀ ਸੰਗ੍ਰਹਿ</h1>
              <div className="w-10 h-1 bg-gradient-to-r from-white to-amber-400 hidden md:block"></div>
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-amber-200 mb-6">Handmade Leather Jutti Collection</h2>
            <p className="text-lg opacity-90 max-w-4xl mx-auto leading-relaxed">
              ਸਾਡੇ ਪਾਸ ਪਰੰਪਰਾਗਤ ਪੰਜਾਬੀ ਜੁੱਤੀ ਦਾ ਸ਼ਾਨਦਾਰ ਸੰਗ੍ਰਹਿ ਹੈ, ਜੋ ਸ਼ੁੱਧ ਚਮੜੇ ਨਾਲ ਹੱਥ ਨਾਲ ਬਣਾਈ ਗਈ ਹੈ।
              <br />
              <span className="italic text-amber-200">
                Discover our exquisite range of traditional Punjabi jutti, handcrafted with pure leather and adorned
                with authentic embroidery for men, women, and kids.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="md:flex flex-col md:flex-row gap-4 mb-8 p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-900">Filter by:</span>
            </div>

            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-2000">Under ₹2,000</SelectItem>
                <SelectItem value="2000-3000">₹2,000 - ₹3,000</SelectItem>
                <SelectItem value="above-3000">Above ₹3,000</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-red-200"
              >
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute top-2 left-2 bg-red-600 text-white">{product.category}</Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-red-900 group-hover:text-red-700 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {product.colors.map((color, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-red-800">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>

                    <AuthGuardedCart
                      product={{
                        _id: product.id.toString(),
                        name: product.name,
                        punjabiName: product.name, // Add punjabi name
                        price: parseFloat(product.price.replace('₹', '').replace(',', '')),
                        images: [product.image || '/placeholder.jpg'],
                        stock: 10, // Default stock
                        sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'], // Default sizes
                        colors: product.colors || ['Default']
                      }}
                      variant="add-to-cart"
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">👞</span>
              </div>
              <h3 className="text-xl font-semibold text-red-900">Pure Leather</h3>
              <p className="text-red-700">
                Made from 100% genuine leather, ensuring durability and comfort for everyday wear.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🧵</span>
              </div>
              <h3 className="text-xl font-semibold text-red-900">Hand Embroidered</h3>
              <p className="text-red-700">
                Each pair features intricate hand embroidery done by skilled artisans using traditional techniques.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📏</span>
              </div>
              <h3 className="text-xl font-semibold text-red-900">Perfect Fit</h3>
              <p className="text-red-700">
                Available in all sizes with detailed size guide to ensure the perfect fit for your feet.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
