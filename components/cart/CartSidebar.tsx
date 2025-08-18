'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/components/providers/CartProvider'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  CreditCard,
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface CartSidebarProps {
  children: React.ReactNode
}

export function CartSidebar({ children }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, totalItems } = useCart()
  const { isAuthenticated } = useFirebaseAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
    
    setIsOpen(false)
    window.location.href = '/checkout'
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Shopping Cart ({totalItems})</span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <Package className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some items to get started</p>
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-600 truncate">{item.punjabiName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {item.size}
                          </Badge>
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {item.color}
                          </Badge>
                        </div>
                        <p className="font-bold text-sm text-red-600 mt-1">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity - 1)}
                          >
                            <Minus className="h-2 w-2" />
                          </Button>
                          <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-2 w-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total ({state.itemCount} items)</span>
                    <span className="font-bold text-lg text-red-600">₹{state.total.toLocaleString()}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Checkout
                    </Button>
                    
                    <Link href="/cart">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        View Full Cart
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
        onSuccess={() => {
          setShowAuthModal(false)
          handleCheckout()
        }}
      />
    </>
  )
}