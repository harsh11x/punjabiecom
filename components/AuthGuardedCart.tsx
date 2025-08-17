'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useFirebaseAuth } from '@/components/providers/SimpleAuthProvider'
import { useCart } from '@/contexts/CartContext'
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

    // Validate required selections
    if (!selectedSize && product.sizes.length > 0) {
      toast.error('Please select a size')
      return
    }

    if (!selectedColor && product.colors.length > 0) {
      toast.error('Please select a color')
      return
    }

    // Check stock availability
    if (product.stock < quantity) {
      toast.error('Not enough stock available')
      return
    }

    // Add to cart
    const cartItem = {
      id: `${product._id}-${selectedSize || 'One Size'}-${selectedColor || 'Default'}`,
      productId: product._id,
      name: product.name,
      punjabiName: product.punjabiName,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      size: selectedSize || 'One Size',
      color: selectedColor || 'Default',
      quantity,
      stock: product.stock
    }

    addItem(cartItem)

    if (variant === 'add-to-cart') {
      toast.success('Added to cart successfully!')
    } else {
      // For buy-now, redirect to checkout
      window.location.href = '/checkout'
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