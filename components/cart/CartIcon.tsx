'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { CartSidebar } from './CartSidebar'
import { ShoppingBag } from 'lucide-react'

interface CartIconProps {
  className?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function CartIcon({ className, variant = 'ghost', size = 'icon' }: CartIconProps) {
  const { state } = useCart()

  return (
    <CartSidebar>
      <Button
        variant={variant}
        size={size}
        className={`relative ${className}`}
      >
        <ShoppingBag className="h-5 w-5" />
        {state.itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white font-bold text-xs">
            {state.itemCount > 99 ? '99+' : state.itemCount}
          </Badge>
        )}
      </Button>
    </CartSidebar>
  )
}