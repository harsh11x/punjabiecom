'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MobileNav } from '@/components/mobile-nav'
import { ShoppingCart } from '@/components/shopping-cart'
import { AuthGuardedCart } from '@/components/AuthGuardedCart'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { Heart, Menu, X } from 'lucide-react'

export function Header() {
  const { isAuthenticated } = useFirebaseAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="border-b-4 border-amber-600 bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Link href="/" className="flex items-center space-x-3 lg:space-x-4">
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
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
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
                href="/products"
                className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
              >
                ਸਾਰੇ ਉਤਪਾਦ • All Products
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
              <AuthGuardedCart />
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-amber-100 hover:text-amber-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-amber-600">
              <nav className="flex flex-col space-y-2 pt-4">
                <Link
                  href="/"
                  className="text-amber-100 hover:text-amber-300 font-semibold py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ਘਰ • Home
                </Link>
                <Link
                  href="/jutti"
                  className="text-amber-100 hover:text-amber-300 font-semibold py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ਜੁੱਤੀ • Jutti
                </Link>
                <Link
                  href="/phulkari"
                  className="text-amber-100 hover:text-amber-300 font-semibold py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ਫੁਲਕਾਰੀ • Phulkari
                </Link>
                <Link
                  href="/products"
                  className="text-amber-100 hover:text-amber-300 font-semibold py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ਸਾਰੇ ਉਤਪਾਦ • All Products
                </Link>
                <Link
                  href="/about"
                  className="text-amber-100 hover:text-amber-300 font-semibold py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ਸਾਡੇ ਬਾਰੇ • About
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </>
  )
}
