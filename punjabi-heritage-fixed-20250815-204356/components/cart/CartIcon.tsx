'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

interface CartIconProps {
  className?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function CartIcon({ className, variant = 'ghost', size = 'icon' }: CartIconProps) {
  const [mounted, setMounted] = useState(false)
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Safely get cart state
  let cartState = null
  try {
    const { state } = useCart()
    cartState = state
  } catch (error) {
    console.warn('Cart context not available:', error)
  }

  useEffect(() => {
    if (mounted && cartState) {
      setItemCount(cartState.itemCount || 0)
    }
  }, [mounted, cartState])

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`relative ${className}`}
      >
        <ShoppingBag className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Link href="/cart">
      <Button
        variant={variant}
        size={size}
        className={`relative ${className}`}
      >
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white font-bold text-xs">
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
