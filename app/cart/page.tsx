'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/components/providers/CartProvider'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  Package,
  CreditCard
} from 'lucide-react'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart()
  const { isAuthenticated } = useFirebaseAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)



  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      toast.success('Item removed from cart')
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
    toast.success('Item removed from cart')
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    // Redirect to checkout
    window.location.href = '/checkout'
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Cart cleared')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
        {/* Header */}
        <header className="border-b-4 border-amber-600 bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-8 w-8 text-amber-300" />
                <div>
                  <h1 className="text-2xl font-bold text-amber-100">Shopping Cart</h1>
                  <p className="text-amber-200">ਖਰੀਦਦਾਰੀ ਦੀ ਟੋਕਰੀ • Your selected items</p>
                </div>
              </div>
              <Link href="/">
                <Button variant="ghost" className="text-amber-100 hover:text-amber-300 hover:bg-red-800/50">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
          <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
        </header>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">ਤੁਹਾਡੀ ਟੋਕਰੀ ਖਾਲੀ ਹੈ • Add some beautiful items to get started</p>
            <div className="space-x-4">
              <Link href="/products">
                <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Browse Products
                </Button>
              </Link>
              <Link href="/men">
                <Button variant="outline">Men's Collection</Button>
              </Link>
              <Link href="/women">
                <Button variant="outline">Women's Collection</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b-4 border-amber-600 bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-8 w-8 text-amber-300" />
              <div>
                <h1 className="text-2xl font-bold text-amber-100">Shopping Cart</h1>
                <p className="text-amber-200">ਖਰੀਦਦਾਰੀ ਦੀ ਟੋਕਰੀ • Your selected items</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="ghost" className="text-amber-100 hover:text-amber-300 hover:bg-red-800/50">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
      </header>

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="border-2 border-amber-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        {item.size && (
                          <span>Size: {item.size}</span>
                        )}
                        {item.color && (
                          <span>Color: {item.color}</span>
                        )}
                      </div>
                      <p className="text-lg font-bold text-red-900">₹{item.price.toLocaleString()}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-amber-100 sticky top-32">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({totalItems})</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3"
                    size="lg"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                  
                  <Button
                    onClick={handleClearCart}
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
            handleCheckout()
          }}
        />
      )}
    </div>
  )
}