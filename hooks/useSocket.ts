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
      // Skip Socket.IO initialization if URL is null (production)
      if (!SOCKET_CONFIG.url || socketRef.current?.connected) return

      setIsConnecting(true)
      
      try {
        socketRef.current = io(SOCKET_CONFIG.url, {
          ...SOCKET_CONFIG.options,
          auth: {
            token: typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
          }
        })

        const socket = socketRef.current

        // Connection events
        socket.on('connect', () => {
          console.log('Socket connected:', socket.id)
          setIsConnected(true)
          setIsConnecting(false)
          options.onConnect?.()
        })

        socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason)
          setIsConnected(false)
          setIsConnecting(false)
          options.onDisconnect?.()
        })

        socket.on('connect_error', (error) => {
          console.warn('Socket connection failed (this is optional):', error.message)
          setIsConnected(false)
          setIsConnecting(false)
          // Don't call onError callback for connection failures
          // as sockets are optional for basic app functionality
        })

        // Business events
        socket.on('order-notification', (data) => {
          console.log('Order notification received:', data)
          options.onOrderNotification?.(data)
        })

        socket.on('product-update', (data) => {
          console.log('Product update received:', data)
          options.onProductUpdate?.(data)
        })

        socket.on('cart-updated', (data) => {
          console.log('Cart update received:', data)
          options.onCartUpdate?.(data)
        })

        socket.on('auth-required', (data) => {
          console.log('Auth required:', data)
          options.onAuthRequired?.(data)
        })

        // Admin specific events
        socket.on('join-admin', () => {
          console.log('Joined admin room')
        })

      } catch (error) {
        console.warn('Socket initialization failed (sockets are optional):', error)
        setIsConnecting(false)
        // Don't call onError callback for initialization failures
        // as sockets are optional for basic app functionality
      }
    }

    // Initialize socket
    initSocket()

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
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