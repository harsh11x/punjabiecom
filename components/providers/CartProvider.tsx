'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useFirebaseAuth } from '@/components/providers/FirebaseAuthProvider'
import { toast } from 'sonner'

// Cart Item Interface
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

// Cart Context Interface
interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isLoading: boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useFirebaseAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart when user changes
  useEffect(() => {
    loadCart()
  }, [user, isAuthenticated])

  const loadCart = async () => {
    try {
      setIsLoading(true)
      
      if (isAuthenticated && user) {
        // Load cart from server for authenticated users
        console.log('Loading cart for authenticated user:', user.email)
        const response = await fetch('/api/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.uid,
            'x-user-email': user.email || '',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setItems(data.items || [])
          console.log('Cart loaded from server:', data.items?.length || 0, 'items')
        } else {
          console.log('No server cart found, using localStorage')
          loadFromLocalStorage()
        }
      } else {
        // Load from localStorage for guest users
        console.log('Loading cart from localStorage for guest user')
        loadFromLocalStorage()
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      loadFromLocalStorage()
    } finally {
      setIsLoading(false)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('punjabi-heritage-cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
        console.log('Cart loaded from localStorage:', parsedCart.length, 'items')
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      setItems([])
    }
  }

  const saveCart = async (newItems: CartItem[]) => {
    try {
      // Always save to localStorage
      localStorage.setItem('punjabi-heritage-cart', JSON.stringify(newItems))
      
      // Also save to server if user is authenticated
      if (isAuthenticated && user) {
        console.log('Saving cart to server for user:', user.email)
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.uid,
            'x-user-email': user.email || '',
          },
          body: JSON.stringify({ items: newItems }),
        })
        
        if (response.ok) {
          console.log('Cart saved to server successfully')
        } else {
          console.log('Failed to save cart to server, but localStorage updated')
        }
      }
    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = item.quantity || 1
    const itemKey = `${item.id}-${item.size || ''}-${item.color || ''}`
    
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        cartItem => `${cartItem.id}-${cartItem.size || ''}-${cartItem.color || ''}` === itemKey
      )
      
      let newItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...prevItems]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        }
      } else {
        // Add new item
        newItems = [...prevItems, { ...item, quantity }]
      }
      
      saveCart(newItems)
      toast.success(`${item.name} added to cart`)
      return newItems
    })
  }

  const removeItem = (id: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id)
      saveCart(newItems)
      toast.success('Item removed from cart')
      return newItems
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    
    setItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      saveCart(newItems)
      return newItems
    })
  }

  const clearCart = async () => {
    setItems([])
    localStorage.removeItem('punjabi-heritage-cart')
    
    if (isAuthenticated && user) {
      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.uid,
            'x-user-email': user.email || '',
          },
        })
        console.log('Cart cleared from server')
      } catch (error) {
        console.error('Error clearing cart from server:', error)
      }
    }
    
    toast.success('Cart cleared')
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const value = {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
