'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { SOCKET_CONFIG } from '@/lib/api-config'

interface UseSocketOptions {
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
  onOrderNotification?: (data: any) => void
  onProductUpdate?: (data: any) => void
  onCartUpdate?: (data: any) => void
  onAuthRequired?: (data: any) => void
}

export function useSocket(options: UseSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection
    const initSocket = () => {
      // Skip Socket.IO initialization if URL is null (production) or if we're on server
      if (!SOCKET_CONFIG.url || typeof window === 'undefined' || socketRef.current?.connected) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[useSocket] Socket.IO disabled or already connected')
        }
        setIsConnecting(false)
        setIsConnected(false)
        return
      }

      setIsConnecting(true)
      
      try {
        socketRef.current = io(SOCKET_CONFIG.url, {
          ...SOCKET_CONFIG.options,
          auth: {
            token: localStorage.getItem('auth-token')
          }
        })

        const socket = socketRef.current

        // Connection events
        socket.on('connect', () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Socket connected:', socket.id)
          }
          setIsConnected(true)
          setIsConnecting(false)
          options.onConnect?.()
        })

        socket.on('disconnect', (reason) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Socket disconnected:', reason)
          }
          setIsConnected(false)
          setIsConnecting(false)
          options.onDisconnect?.()
        })

        socket.on('connect_error', (error: any) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Socket connection failed (this is optional):', error?.message || 'Connection error')
          }
          setIsConnected(false)
          setIsConnecting(false)
          // Don't call onError callback for connection failures
          // as sockets are optional for basic app functionality
        })

        // Business events with error handling
        socket.on('order-notification', (data) => {
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log('Order notification received:', data)
            }
            options.onOrderNotification?.(data)
          } catch (error) {
            console.error('Error handling order notification:', error)
          }
        })

        socket.on('product-update', (data) => {
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log('Product update received:', data)
            }
            options.onProductUpdate?.(data)
          } catch (error) {
            console.error('Error handling product update:', error)
          }
        })

        socket.on('cart-updated', (data) => {
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log('Cart update received:', data)
            }
            options.onCartUpdate?.(data)
          } catch (error) {
            console.error('Error handling cart update:', error)
          }
        })

        socket.on('auth-required', (data) => {
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log('Auth required:', data)
            }
            options.onAuthRequired?.(data)
          } catch (error) {
            console.error('Error handling auth required:', error)
          }
        })

        // Admin specific events
        socket.on('join-admin', () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Joined admin room')
          }
        })

      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Socket initialization failed (sockets are optional):', error)
        }
        setIsConnecting(false)
        setIsConnected(false)
        // Don't call onError callback for initialization failures
        // as sockets are optional for basic app functionality
      }
    }

    // Only initialize socket on client side
    if (typeof window !== 'undefined') {
      initSocket()
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        try {
          socketRef.current.disconnect()
          socketRef.current = null
        } catch (error) {
          console.error('Error cleaning up socket:', error)
        }
      }
    }
  }, [options])

  // Reconnect when token changes
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
    
    if (socketRef.current && token) {
      socketRef.current.emit('authenticate', { token })
    }
  }, [])

  // Helper functions
  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
    } else {
      console.warn('Socket not connected, cannot emit:', event)
    }
  }

  const joinAdminRoom = () => {
    emit('join-admin')
  }

  const emitNewOrder = (orderData: any) => {
    emit('new-order', orderData)
  }

  const emitOrderStatusUpdate = (updateData: any) => {
    emit('order-status-update', updateData)
  }

  const emitInventoryUpdate = (productData: any) => {
    emit('inventory-update', productData)
  }

  const emitAddToCart = (item: any) => {
    emit('add-to-cart', item)
  }

  const emitUpdateCartItem = (data: any) => {
    emit('update-cart-item', data)
  }

  const emitRemoveFromCart = (data: any) => {
    emit('remove-from-cart', data)
  }

  const emitClearCart = () => {
    emit('clear-cart')
  }

  const emitProfileUpdate = (userData: any) => {
    emit('profile-updated', userData)
  }

  return {
    socket: socketRef.current,
    isConnected,
    isConnecting,
    emit,
    joinAdminRoom,
    emitNewOrder,
    emitOrderStatusUpdate,
    emitInventoryUpdate,
    emitAddToCart,
    emitUpdateCartItem,
    emitRemoveFromCart,
    emitClearCart,
    emitProfileUpdate
  }
}