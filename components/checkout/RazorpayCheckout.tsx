'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  notes: {
    address: string
  }
  theme: {
    color: string
  }
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void
    }
  }
}

interface ShippingAddress {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  phone: string
}

interface RazorpayCheckoutProps {
  shippingAddress: ShippingAddress
  onSuccess: (orderId: string) => void
  onError: (error: string) => void
}

export function RazorpayCheckout({ shippingAddress, onSuccess, onError }: RazorpayCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useFirebaseAuth()

  const handlePayment = async () => {
    if (!user?.email) {
      onError('Please login to continue')
      return
    }

    if (items.length === 0) {
      onError('Your cart is empty')
      return
    }

    setIsProcessing(true)

    try {
      // Calculate totals
      const subtotal = getTotalPrice()
      const shippingCost = subtotal > 2000 ? 0 : 100 // Free shipping above ₹2000
      const tax = Math.round(subtotal * 0.18) // 18% GST
      const total = subtotal + shippingCost + tax

      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            name: item.name,
            punjabiName: item.punjabiName || item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image
          })),
          shippingAddress,
          customerEmail: user.email,
          subtotal,
          shippingCost,
          tax
        })
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        
        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      // Configure Razorpay options
      const options = {
        key: orderData.data.key,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'Punjab Heritage',
        description: 'Authentic Punjabi Crafts',
        image: '/logo.png',
        order_id: orderData.data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.data.orderId
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              clearCart()
              onSuccess(orderData.data.orderId)
            } else {
              throw new Error(verifyData.error || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            onError(error instanceof Error ? error.message : 'Payment verification failed')
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: user.email,
          contact: shippingAddress.phone
        },
        notes: {
          address: `${shippingAddress.addressLine1}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`
        },
        theme: {
          color: '#dc2626'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error)
        onError(`Payment failed: ${response.error.description}`)
        setIsProcessing(false)
      })

      rzp.open()

    } catch (error) {
      console.error('Payment error:', error)
      onError(error instanceof Error ? error.message : 'Payment failed')
      setIsProcessing(false)
    }
  }

  const subtotal = getTotalPrice()
  const shippingCost = subtotal > 2000 ? 0 : 100
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shippingCost + tax

  return (
    <div className="space-y-4">
      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal ({items.length} items)</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (GST 18%)</span>
            <span>₹{tax.toLocaleString()}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={isProcessing || items.length === 0}
        className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white py-3 text-lg"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processing...</span>
          </div>
        ) : (
          `Pay ₹${total.toLocaleString()}`
        )}
      </Button>

      {/* Security Info */}
      <div className="text-xs text-gray-500 text-center">
        <p>🔒 Secured by Razorpay • Your payment information is safe</p>
        <p>We accept UPI, Cards, Net Banking & Wallets</p>
      </div>
    </div>
  )
}