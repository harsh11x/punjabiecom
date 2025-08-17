'use client'

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { useFirebaseAuth } from '@/components/providers/SimpleAuthProvider'
import { useSocket } from '@/hooks/useSocket'
import { toast } from 'sonner'

export interface CartItem {
  id: string
  productId: string
  name: string
  punjabiName: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
  stock: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  loading: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CART_ERROR'; payload: string }

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false
}

function cartReducer(state: CartState, action: CartAction): CartState {
  // Debug logging only in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[CartReducer]', action.type, 'payload' in action ? action.payload : 'no payload');
    console.log('[CartReducer] Current state:', state);
  }
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId && 
                item.size === action.payload.size && 
                item.color === action.payload.color
      )

      let newItems: CartItem[]
      
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: Math.min(item.quantity + action.payload.quantity, item.stock) }
            : item
        )
      } else {
        newItems = [...state.items, action.payload]
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => 
        !(item.productId === action.payload.split('-')[0] && 
          item.size === action.payload.split('-')[1] && 
          item.color === action.payload.split('-')[2])
      )
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item => {
        const itemKey = `${item.productId}-${item.size}-${item.color}`
        return itemKey === action.payload.id
          ? { ...item, quantity: Math.max(0, Math.min(action.payload.quantity, item.stock)) }
          : item
      }).filter(item => item.quantity > 0)

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case 'CLEAR_CART':
      return { ...initialState, loading: state.loading }

    case 'LOAD_CART': {
      const total = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      
      return { ...state, items: action.payload, total, itemCount, loading: false }
    }

    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'CART_ERROR':
      toast.error(action.payload)
      return { ...state, loading: false }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isAuthenticated, user } = useFirebaseAuth()
  
  // Socket with cart-specific event handlers - only enable if we have a backend server
  const socket = useSocket({
    onCartUpdate: (cartData) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[CartProvider] Socket cart update received:', cartData)
      }
      if (cartData?.items) {
        const items = cartData.items.map((item: any) => ({
          id: `${item.productId}-${item.size}-${item.color}`,
          productId: item.productId,
          name: item.name,
          punjabiName: item.punjabiName,
          price: item.price,
          image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          stock: item.stock
        }))
        dispatch({ type: 'LOAD_CART', payload: items })
      }
    },
    onConnect: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[CartProvider] Socket connected, user authenticated:', isAuthenticated)
      }
      if (isAuthenticated && socket?.socket?.connected) {
        // Request cart data from server when connected
        socket?.socket.emit('get-cart')
      }
    },
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[CartProvider] Socket connection failed, using localStorage only:', error.message)
      }
      // Gracefully handle socket errors - just use localStorage
    }
  })

  // Track if cart has been initialized to prevent immediate localStorage save
  const [cartInitialized, setCartInitialized] = useState(false)

  // Initialize cart from localStorage or server
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[CartProvider] Initializing cart state');
    }
    
    // Only try localStorage on client side
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('punjabi-heritage-cart')
        if (savedCart) {
          const cartItems = JSON.parse(savedCart)
          if (Array.isArray(cartItems) && cartItems.length > 0) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[CartProvider] Loading cart from localStorage:', cartItems);
            }
            dispatch({ type: 'LOAD_CART', payload: cartItems })
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        // Clear corrupted data
        try {
          localStorage.removeItem('punjabi-heritage-cart')
        } catch (clearError) {
          console.error('Error clearing corrupted cart data:', clearError)
        }
      }
    }
    
    // Mark cart as initialized
    setCartInitialized(true)
    
    // Only try to load server cart if authenticated and socket is connected
    if (isAuthenticated && socket?.socket?.connected) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[CartProvider] Requesting cart from server for authenticated user');
      }
      try {
        socket.socket.emit('get-cart')
      } catch (error) {
        console.error('Error requesting cart from server:', error)
      }
    }
  }, [])

  // Save cart to localStorage (only after initialization and on client side)
  useEffect(() => {
    if (cartInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem('punjabi-heritage-cart', JSON.stringify(state.items))
        if (process.env.NODE_ENV === 'development') {
          console.log('[CartProvider] Cart saved to localStorage:', state.items.length, 'items');
        }
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [state.items, cartInitialized])

  // Socket event listeners for authenticated users (only if socket is available)
  useEffect(() => {
    if (socket?.socket?.connected && isAuthenticated) {
      // Listen for cart loaded from server
      socket.socket.on('cart-loaded', (cartData) => {
        const items = cartData.items.map((item: any) => ({
          id: `${item.productId}-${item.size}-${item.color}`,
          productId: item.productId,
          name: item.name,
          punjabiName: item.punjabiName,
          price: item.price,
          image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          stock: item.stock
        }))
        dispatch({ type: 'LOAD_CART', payload: items })
      })

      // Listen for cart updates
      socket.socket.on('cart-updated', (cartData) => {
        const items = cartData.items.map((item: any) => ({
          id: `${item.productId}-${item.size}-${item.color}`,
          productId: item.productId,
          name: item.name,
          punjabiName: item.punjabiName,
          price: item.price,
          image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          stock: item.stock
        }))
        dispatch({ type: 'LOAD_CART', payload: items })
      })

      // Listen for cart cleared
      socket.socket.on('cart-cleared', () => {
        dispatch({ type: 'CLEAR_CART' })
        toast.success('Cart cleared')
      })

      // Listen for cart errors
      socket.socket.on('cart-error', (error) => {
        dispatch({ type: 'CART_ERROR', payload: error.message })
      })

      // Listen for auth required
      socket.socket.on('auth-required', (data) => {
        toast.error(data.message)
      })

      return () => {
        socket.socket?.off('cart-loaded')
        socket.socket?.off('cart-updated')
        socket.socket?.off('cart-cleared')
        socket.socket?.off('cart-error')
        socket.socket?.off('auth-required')
      }
    }
  }, [socket, isAuthenticated])

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const cartItem = { ...item, quantity: item.quantity || 1 }

    if (isAuthenticated && socket?.socket?.connected) {
      // Send to server for authenticated users (only if socket is connected)
      socket.socket.emit('add-to-cart', {
        productId: item.productId,
        name: item.name,
        punjabiName: item.punjabiName,
        price: item.price,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity || 1,
        stock: item.stock
      })
      dispatch({ type: 'SET_LOADING', payload: true })
    } else {
      // Local storage for all other cases (non-authenticated users or no socket connection)
      dispatch({ type: 'ADD_ITEM', payload: cartItem })
      toast.success('Item added to cart')
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[CartProvider] Item added to local cart:', cartItem)
      }
    }
  }

  const removeItem = (id: string, size: string, color: string) => {
    if (isAuthenticated && socket?.socket?.connected) {
      // Send to server for authenticated users (only if socket is connected)
      const [productId] = id.split('-')
      socket.socket.emit('remove-from-cart', { productId, size, color })
      dispatch({ type: 'SET_LOADING', payload: true })
    } else {
      // Local storage for all other cases
      dispatch({ type: 'REMOVE_ITEM', payload: `${id}-${size}-${color}` })
      toast.success('Item removed from cart')
    }
  }

  const updateQuantity = (id: string, size: string, color: string, quantity: number) => {
    if (isAuthenticated && socket?.socket?.connected) {
      // Send to server for authenticated users (only if socket is connected)
      const [productId] = id.split('-')
      socket.socket.emit('update-cart-item', { productId, size, color, quantity })
      dispatch({ type: 'SET_LOADING', payload: true })
    } else {
      // Local storage for all other cases
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: `${id}-${size}-${color}`, quantity } })
    }
  }

  const clearCart = () => {
    if (isAuthenticated && socket?.socket?.connected) {
      // Send to server for authenticated users (only if socket is connected)
      socket.socket.emit('clear-cart')
      dispatch({ type: 'SET_LOADING', payload: true })
    } else {
      // Local storage for all other cases
      dispatch({ type: 'CLEAR_CART' })
      toast.success('Cart cleared')
    }
  }

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}