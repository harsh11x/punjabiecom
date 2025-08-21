'use client'

import { useCart } from '@/components/providers/CartProvider'
import { useFirebaseAuth } from '@/components/providers/FirebaseAuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { getApiUrl } from '@/config/environment'

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const { user } = useFirebaseAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    
    // Check if user is authenticated
    if (!user) {
      toast.error('Please login to continue with checkout')
      router.push('/login?redirect=/checkout')
      return
    }
    
    // Pre-fill form with user data if available
    if (user.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || ''
      }))
    }

    // Log the current form state
    console.log('Checkout page mounted, user:', user)
    console.log('Initial form data:', formData)
  }, [user, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart')
    }
  }, [mounted, items.length, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const debugFormData = () => {
    console.log('=== DEBUG FORM DATA ===')
    console.log('Form Data:', formData)
    console.log('Cart Items:', items)
    console.log('Total Price:', totalPrice)
    console.log('User:', user)
    console.log('Is Authenticated:', !!user)
    console.log('========================')
    
    toast.info('Check console for debug information')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Validate form data
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
        toast.error('Please fill in all required fields')
        setIsProcessing(false)
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address')
        setIsProcessing(false)
        return
      }

      // Validate phone number (basic validation)
      if (formData.phone && formData.phone.length < 10) {
        toast.error('Please enter a valid phone number')
        setIsProcessing(false)
        return
      }

      // Validate cart items
      if (!items || items.length === 0) {
        toast.error('Your cart is empty')
        setIsProcessing(false)
        return
      }

      // Validate each cart item
      for (const item of items) {
        if (!item.id || !item.name || !item.price || !item.quantity) {
          toast.error('Invalid cart item data')
          setIsProcessing(false)
          return
        }
      }

      console.log('Form validation passed, cart items:', items)
      console.log('Selected payment method:', paymentMethod)

      // Handle Cash on Delivery orders
      if (paymentMethod === 'cod') {
        console.log('Processing Cash on Delivery order...')
        
        // For COD orders, we create the order directly without payment processing
        const codOrderData = {
          items: items.map(item => ({
            productId: item.id,
            name: item.name,
            punjabiName: item.name, // Add required punjabiName field
            price: item.price,
            quantity: item.quantity,
            size: item.size || 'Standard',
            color: item.color || 'Default',
            image: item.image || ''
          })),
          shippingAddress: {
            fullName: `${formData.firstName} ${formData.lastName}`,
            addressLine1: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone
          },
          billingAddress: {
            fullName: `${formData.firstName} ${formData.lastName}`,
            addressLine1: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone
          },
          customerEmail: formData.email,
          subtotal: totalPrice,
          shippingCost: 0,
          tax: 0,
          total: totalPrice,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          status: 'confirmed'
        }

        console.log('COD Order Data:', JSON.stringify(codOrderData, null, 2))

        try {
          console.log('Sending COD order to API...')
          
          // Use local Vercel API route
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(codOrderData)
          })

          console.log('COD API Response Status:', response.status)
          console.log('COD API Response Headers:', Object.fromEntries(response.headers.entries()))

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }))
            console.error('COD API Error Response:', errorData)
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
          }

          const orderResult = await response.json()
          console.log('COD API Success Response:', orderResult)
          
          if (orderResult.success) {
            // Clear cart after successful order creation
            clearCart()
            
            // Redirect to success page
            router.push(`/order-success?orderId=${orderResult.data._id}&orderNumber=${orderResult.data.orderNumber}`)
            toast.success('Order placed successfully! You will pay on delivery.')
            return
          } else {
            console.error('COD API returned success: false:', orderResult)
            throw new Error(orderResult.error || 'Failed to create COD order')
          }
        } catch (error: any) {
          console.error('COD order creation failed:', error)
          toast.error(`Failed to create order: ${error.message}`)
          setIsProcessing(false)
          return
        }
      }

      // Prepare order data for online payment
      const orderData = {
        items: items.map(item => ({
          productId: item.id, // Use id instead of productId
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || 'Standard',
          color: item.color || 'Default',
          image: item.image || ''
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.pincode, // Use pincode for zipCode
          phone: formData.phone
        },
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.pincode, // Use pincode for zipCode
          phone: formData.phone
        },
        customerEmail: formData.email,
        subtotal: totalPrice,
        shippingCost: 0,
        tax: 0
      }

      console.log('Online Payment Order Data:', JSON.stringify(orderData, null, 2))

      console.log('Creating payment order...', orderData)
      toast.info('Creating your order...')

      // Log the request details
      console.log('Request URL:', '/api/payment/create-order')
      console.log('Request method:', 'POST')
      console.log('Request headers:', { 'Content-Type': 'application/json' })
      console.log('Request body:', JSON.stringify(orderData, null, 2))

      // Create Razorpay order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Payment order response:', data)

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment order')
      }

      // Check if this is a mock payment
      if (data.order.isMockPayment) {
        console.log('Using mock payment system')
        
        // For mock payments, we can simulate success immediately
        // or show a different flow
        toast.success('Mock payment order created successfully!')
        
        // Clear cart after successful mock payment
        clearCart()
        
        // Redirect to success page
        router.push(`/order-success?orderId=${data.order.id}&orderNumber=${data.order.orderNumber}`)
        return
      }

      // Initialize Razorpay payment for real payments
      const options = {
        key: data.order.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.razorpayAmount,
        currency: 'INR',
        name: 'Punjab Heritage',
        description: `Order #${data.order.orderNumber}`,
        order_id: data.order.razorpayOrderId,
        handler: async function (response: any) {
          console.log('Payment successful:', response)
          
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
                orderId: data.order.id
              })
            })

            const verifyData = await verifyResponse.json()
            
            if (verifyData.success) {
              // Clear cart after successful payment
              clearCart()
              
              // Redirect to success page
              router.push(`/order-success?orderId=${data.order.id}&orderNumber=${data.order.orderNumber}`)
              toast.success('Payment successful! Order placed.')
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#F59E0B'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed')
            setIsProcessing(false)
          }
        }
      }

      // Load Razorpay script if not already loaded
      if (typeof window !== 'undefined') {
        if (!(window as any).Razorpay) {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => {
            const rzp = new (window as any).Razorpay(options)
            rzp.open()
          }
          script.onerror = () => {
            toast.error('Failed to load payment gateway')
            setIsProcessing(false)
          }
          document.body.appendChild(script)
        } else {
          const rzp = new (window as any).Razorpay(options)
          rzp.open()
        }
      }

    } catch (error: any) {
      console.error('Order processing failed:', error)
      
      // Provide more specific error messages
      let errorMessage = 'Failed to process order'
      
      if (error.message.includes('Failed to create payment order')) {
        errorMessage = 'Payment order creation failed. Please try again.'
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Server error. Please try again later.'
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else {
        errorMessage = error.message || 'An unexpected error occurred. Please try again.'
      }
      
      toast.error(errorMessage)
      setIsProcessing(false)
    }
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to your cart before checkout!</p>
            <Link href="/products">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Street address"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        placeholder="PIN Code"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Phone number"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="cod" 
                        name="payment" 
                        value="cod" 
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <Label htmlFor="cod">Cash on Delivery</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="razorpay" 
                        name="payment" 
                        value="razorpay" 
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <Label htmlFor="razorpay">Online Payment (Razorpay)</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>

                {/* Place Order Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isProcessing}
                  onClick={handleSubmit}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>

                {/* Debug Button - Development Only */}
                {process.env.NODE_ENV === 'development' && (
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full border-dashed" 
                    onClick={debugFormData}
                  >
                    🐛 Debug Form Data
                  </Button>
                )}

                <Link href="/cart">
                  <Button variant="outline" className="w-full">
                    Back to Cart
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
