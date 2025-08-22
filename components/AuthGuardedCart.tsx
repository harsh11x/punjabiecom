'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { useCart } from '@/components/providers/CartProvider'
import { AuthModal } from '@/components/auth/AuthModal'
import { ShoppingCart, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface AuthGuardedCartProps {
  product: {
    _id: string
    name: string
    punjabiName: string
    price: number
    images: string[]
    stock: number
    sizes: string[]
    colors: string[]
  }
  selectedSize?: string
  selectedColor?: string
  quantity?: number
  variant?: 'add-to-cart' | 'buy-now'
  className?: string
}

export function AuthGuardedCart({
  product,
  selectedSize,
  selectedColor,
  quantity = 1,
  variant = 'add-to-cart',
  className
}: AuthGuardedCartProps) {
  const { isAuthenticated, user } = useFirebaseAuth()
  const { addItem } = useCart()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  const handleCartAction = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setAuthMode('login')
      setShowAuthModal(true)
      return
    }

    // Validate required selections - Skip size validation for phulkari products
    const isPhulkariProduct = (product as any).category === 'phulkari' || (product as any).category === 'fulkari'
    
    if (!selectedSize && (product as any).sizes && (product as any).sizes.length > 0 && !isPhulkariProduct) {
      toast.error('Please select a size')
      return
    }

    if (!selectedColor && (product as any).colors && (product as any).colors.length > 0) {
      toast.error('Please select a color')
      return
    }

    // Check stock availability
    if ((product as any).stockQuantity && (product as any).stockQuantity < quantity) {
      toast.error('Not enough stock available')
      return
    }

    // Add to cart
    const finalSize = isPhulkariProduct ? 'One Size' : (selectedSize || 'One Size')
    const finalColor = selectedColor || 'Default'
    
    const cartItem = {
      id: (product as any).id || (product as any)._id || `product-${Date.now()}`,
      name: (product as any).name,
      price: (product as any).price,
      image: (product as any).images?.[0] || '/placeholder.jpg',
      size: finalSize,
      color: finalColor,
      quantity
    }

    console.log('🛒 Adding item to cart:', cartItem)
    
    try {
      addItem(cartItem)
      
      if (variant === 'add-to-cart') {
        toast.success('Added to cart successfully!')
      } else {
        // For buy-now, redirect to checkout
        window.location.href = '/checkout'
      }
    } catch (error) {
      console.error('❌ Error adding to cart:', error)
      toast.error('Failed to add to cart')
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // After successful authentication, perform the cart action
    setTimeout(() => {
      handleCartAction()
    }, 100)
  }

  return (
    <>
      <Button
        onClick={handleCartAction}
        className={className}
        size="lg"
      >
        {variant === 'add-to-cart' ? (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Buy Now
          </>
        )}
      </Button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  )
}