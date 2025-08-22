'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MobileNav } from '@/components/mobile-nav'
import { CartIcon } from '@/components/cart/CartIcon'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { OptimizedLink } from '@/components/performance/optimized-link'
import { Heart, Menu, X } from 'lucide-react'

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Safely get auth state with fallback
  let isAuthenticated = false
  try {
    const auth = useFirebaseAuth()
    isAuthenticated = auth?.isAuthenticated || false
  } catch (error) {
    console.warn('Firebase auth context not available:', error)
  }

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
              <OptimizedLink
                href="/"
                className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
              >
                ਘਰ • Home
              </OptimizedLink>
              <div className="relative group">
                <OptimizedLink
                  href="/jutti"
                  className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
                >
                  ਜੁੱਤੀ • Jutti
                </OptimizedLink>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <OptimizedLink href="/products" className="block px-4 py-3 text-red-800 hover:bg-amber-50 rounded-t-lg font-semibold border-b border-amber-100">
                    ਸਾਰੇ ਉਤਪਾਦ • All Products
                  </OptimizedLink>
                  <OptimizedLink href="/men" className="block px-4 py-3 text-red-800 hover:bg-amber-50">
                    ਮਰਦਾਂ ਲਈ • Men's Jutti
                  </OptimizedLink>
                  <OptimizedLink href="/women" className="block px-4 py-3 text-red-800 hover:bg-amber-50">
                    ਔਰਤਾਂ ਲਈ • Women's Jutti
                  </OptimizedLink>
                  <OptimizedLink href="/kids" className="block px-4 py-3 text-red-800 hover:bg-amber-50 rounded-b-lg">
                    ਬੱਚਿਆਂ ਲਈ • Kids' Jutti
                  </OptimizedLink>
                </div>
              </div>
              <OptimizedLink
                href="/fulkari"
                className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
              >
                ਫੁਲਕਾਰੀ • Fulkari
              </OptimizedLink>
              <OptimizedLink
                href="/products"
                className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
              >
                ਸਾਰੇ ਉਤਪਾਦ • All Products
              </OptimizedLink>
              <OptimizedLink
                href="/about"
                className="text-amber-100 hover:text-amber-300 font-semibold text-lg transition-colors"
              >
                ਸਾਡੇ ਬਾਰੇ • About
              </OptimizedLink>
            </nav>

            {/* Mobile & Desktop Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Login/Signup Buttons for Desktop */}
              {!isAuthenticated && (
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 border-amber-300 text-amber-100 hover:bg-amber-300 hover:text-red-900 font-semibold px-3 py-1.5 transition-all duration-200"
                    >
                      ਲਾਗਿਨ • Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-amber-400 to-red-500 hover:from-amber-500 hover:to-red-600 text-white font-semibold px-3 py-1.5 shadow-lg border-2 border-amber-300 transition-all duration-200"
                    >
                      ਸਾਈਨ ਅਪ • Sign Up
                    </Button>
                  </Link>
                </div>
              )}
              
              {/* User Profile Button for logged in users */}
              {isAuthenticated && (
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex text-amber-100 hover:text-amber-300 hover:bg-red-700/50 font-semibold"
                  >
                    ਪ੍ਰੋਫਾਈਲ • Profile
                  </Button>
                </Link>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-amber-100 hover:text-amber-300 hover:bg-red-700/50"
              >
                <Heart className="h-5 lg:h-6 w-5 lg:w-6" />
              </Button>
              <CartIcon className="text-amber-100 hover:text-amber-300" />
              
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
                <OptimizedLink
                  href="/"
                  className="text-amber-100 hover:text-amber-300 font-semibold py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ਘਰ • Home
                </OptimizedLink>
                <OptimizedLink
                  href="/products"
                  className="text-amber-100 hover:text-amber-300 font-semibold py-2 transition-colors border-b border-amber-600 pb-2 mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ਸਾਰੇ ਉਤਪਾਦ • All Products
                </OptimizedLink>
                <OptimizedLink
                  href="/jutti"
                  className="text-amber-100 hover:text-amber-300 font-semibold py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ਜੁੱਤੀ • Jutti
                </OptimizedLink>
                <OptimizedLink
                  href="/fulkari"
                  className="text-amber-100 hover:text-amber-300 font-semibold py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ਫੁਲਕਾਰੀ • Fulkari
                </OptimizedLink>
                <OptimizedLink
                  href="/products"
                  className="text-amber-100 hover:text-amber-300 font-semibold py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ਸਾਰੇ ਉਤਪਾਦ • All Products
                </OptimizedLink>
                <OptimizedLink
                  href="/about"
                  className="text-amber-100 hover:text-amber-300 font-semibold py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ਸਾਡੇ ਬਾਰੇ • About
                </OptimizedLink>
                
                {/* Mobile Login/Signup Buttons */}
                {!isAuthenticated && (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-amber-600 mt-4">
                    <OptimizedLink href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-2 border-amber-300 text-amber-100 hover:bg-amber-300 hover:text-red-900 font-semibold px-3 py-1.5 transition-all duration-200"
                      >
                        ਲਾਗਿਨ • Login
                      </Button>
                    </OptimizedLink>
                    <OptimizedLink href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-amber-400 to-red-500 hover:from-amber-500 hover:to-red-600 text-white font-semibold px-3 py-1.5 shadow-lg border-2 border-amber-300 transition-all duration-200"
                      >
                        ਸਾਈਨ ਅਪ • Sign Up
                      </Button>
                    </OptimizedLink>
                  </div>
                )}
                
                {/* Mobile Profile Button for logged in users */}
                {isAuthenticated && (
                  <div className="pt-4 border-t border-amber-600 mt-4">
                    <OptimizedLink href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-amber-100 hover:text-amber-300 hover:bg-red-700/50 font-semibold"
                      >
                        ਪ੍ਰੋਫਾਈਲ • Profile
                      </Button>
                    </OptimizedLink>
                  </div>
                )}
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
