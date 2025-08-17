'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/components/providers/CartProvider'
import { useFirebaseAuth } from '@/components/providers/FirebaseAuthProvider'
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
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart, isLoading } = useCart()
  const { isAuthenticated } = useFirebaseAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      toast.success('Item removed from cart')
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-900 font-medium">Loading cart...</p>
        </div>
      </div>
    )
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
                <p className="text-amber-200">ਖਰੀਦਦਾਰੀ ਦੀ ਟੋਕਰੀ • {state.itemCount} items</p>
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Cart Items ({state.itemCount})</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            {items.map((item) => {
              const itemKey = `${item.id}-${item.size || ''}-${item.color || ''}`
              return (
              <Card key={itemKey} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{item.punjabiName}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline" className="text-xs">Size: {item.size}</Badge>
                        <Badge variant="outline" className="text-xs">Color: {item.color}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(itemKey, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(itemKey, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg text-red-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">₹{item.price.toLocaleString()} each</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveItem(itemKey)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({state.itemCount} items)</span>
                    <span className="font-medium">₹{state.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">Included</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold text-red-600">₹{state.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-lg py-3"
                  size="lg"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </Button>

                <div className="mt-4 text-center">
                  <Link href="/products">
                    <Button variant="ghost" className="text-red-600 hover:text-red-700">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
        onSuccess={() => {
          setShowAuthModal(false)
          handleCheckout()
        }}
      />
    </div>
  )
}