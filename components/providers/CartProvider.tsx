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

  // Load cart when component mounts or user changes
  useEffect(() => {
    loadCart()
  }, [user?.uid]) // Only depend on user ID to avoid infinite loops

  const loadCart = async () => {
    try {
      setIsLoading(true)
      console.log('🛒 Loading cart...')
      
      // Always try localStorage first
      const savedCart = localStorage.getItem('punjabi-heritage-cart')
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setItems(parsedCart)
        } catch (parseError) {
          console.error('Error parsing cart from localStorage:', parseError)
          setItems([])
        }
      } else {
        setItems([])
      }
      
      // If user is authenticated, try to sync with server (but don't block)
      if (isAuthenticated && user?.uid) {
        try {
          console.log('🔄 Syncing cart with server for user:', user.email)
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
            if (data.items && data.items.length > 0) {
              setItems(data.items)
              // Also update localStorage
              localStorage.setItem('punjabi-heritage-cart', JSON.stringify(data.items))
            }
          }
        } catch (serverError) {
          console.log('⚠️ Server sync failed, using localStorage:', serverError)
          // Continue with localStorage cart - don't show error to user
        }
      }
    } catch (error) {
      console.error('❌ Error loading cart:', error)
      // Fallback to empty cart
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  const saveCart = async (newItems: CartItem[]) => {
    try {
      // Always save to localStorage immediately
      localStorage.setItem('punjabi-heritage-cart', JSON.stringify(newItems))
      console.log('✅ Cart saved to localStorage')
      
      // Try to save to server if user is authenticated (but don't block)
      if (isAuthenticated && user?.uid) {
        try {
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
            console.log('✅ Cart synced to server')
          } else {
            console.log('⚠️ Server sync failed, but localStorage updated')
          }
        } catch (serverError) {
          console.log('⚠️ Server sync error, but localStorage updated:', serverError)
          // Don't show error to user - localStorage is working
        }
      }
    } catch (error) {
      console.error('❌ Error saving cart:', error)
      // Show error only if localStorage fails
      toast.error('Failed to save cart')
    }
  }

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = item.quantity || 1
    
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id)
      
      let newItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...prevItems]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        }
        toast.success(`Updated ${item.name} quantity in cart`)
      } else {
        // Add new item
        newItems = [...prevItems, { ...item, quantity }]
        toast.success(`${item.name} added to cart`)
      }
      
      saveCart(newItems)
      return newItems
    })
  }

  const removeItem = (id: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id)
      saveCart(newItems)
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
    try {
      setItems([])
      localStorage.removeItem('punjabi-heritage-cart')
      
      // Try to clear server cart if user is authenticated
      if (isAuthenticated && user?.uid) {
        try {
          await fetch('/api/cart', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': user.uid,
              'x-user-email': user.email || '',
            },
          })
          console.log('✅ Cart cleared from server')
        } catch (serverError) {
          console.log('⚠️ Server clear failed, but localStorage cleared:', serverError)
        }
      }
      
      toast.success('Cart cleared')
    } catch (error) {
      console.error('❌ Error clearing cart:', error)
      toast.error('Failed to clear cart')
    }
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
