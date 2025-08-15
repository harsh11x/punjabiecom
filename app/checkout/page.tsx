'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { useCart } from '@/contexts/CartContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  IndianRupee,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Shield,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Gift,
  Edit,
  Clock,
  Building,
  Smartphone
} from 'lucide-react'

interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export default function CheckoutPage() {
  const { user, isAuthenticated, loading: authLoading } = useFirebaseAuth()
  const { state: cartState, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  // Calculate order totals
  const subtotal = cartState.total
  const shippingCost = subtotal >= 1000 ? 0 : 99 // Free shipping above ₹1000
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const orderTotal = subtotal + shippingCost + tax

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return
    
    // Only redirect to login if auth is done loading and user is not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=checkout')
      return
    }

    // Pre-fill address if user is available
    if (user && isAuthenticated) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: user.displayName || prev.fullName,
        email: user.email || prev.email
      }))
    }
  }, [authLoading, isAuthenticated, user, router])
  
  // Separate effect for cart validation
  useEffect(() => {
    if (!authLoading && isAuthenticated && cartState.items.length === 0) {
      router.push('/cart')
    }
  }, [authLoading, isAuthenticated, cartState.items.length, router])

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const requiredFields: (keyof ShippingAddress)[] = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode']
    
    for (const field of requiredFields) {
      if (!shippingAddress[field] || shippingAddress[field].trim() === '') {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingAddress.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    // Validate phone
    const phoneRegex = /^\+?[\d\s-()]{10,15}$/
    if (!phoneRegex.test(shippingAddress.phone)) {
      toast.error('Please enter a valid phone number')
      return false
    }

    // Validate pincode
    const pincodeRegex = /^\d{6}$/
    if (!pincodeRegex.test(shippingAddress.pincode)) {
      toast.error('Please enter a valid 6-digit pincode')
      return false
    }

    return true
  }

  const nextStep = () => {
    if (currentStep === 1 && !validateForm()) return
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const createOrder = async () => {
    try {
      const orderData = {
        customerEmail: shippingAddress.email,
        items: cartState.items.map(item => ({
          productId: item.id,
          name: item.name,
          punjabiName: item.punjabiName || item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          addressLine1: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          phone: shippingAddress.phone
        },
        billingAddress: {
          fullName: shippingAddress.fullName,
          addressLine1: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          phone: shippingAddress.phone
        },
        subtotal,
        shippingCost,
        tax,
        paymentMethod
      }

      console.log('Creating order with data:', orderData)

      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Order creation failed:', errorData)
        throw new Error(errorData.error || 'Failed to create order')
      }

      const result = await response.json()
      console.log('Order creation result:', result)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create order')
      }

      // Return the order data with the correct structure for Razorpay
      return {
        id: result.data.orderId,
        orderNumber: result.data.orderNumber,
        razorpayOrderId: result.data.razorpayOrderId,
        amount: result.data.amount,
        currency: result.data.currency,
        razorpayKey: result.data.key,
        name: 'Punjab Heritage Store',
        description: `Order #${result.data.orderNumber}`,
        prefill: {
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          contact: shippingAddress.phone
        }
      }
    } catch (error: any) {
      console.error('Order creation error:', error)
      throw error
    }
  }

  const handlePayment = async () => {
    if (!validateForm()) return

    setLoading(true)
    
    try {
      // Create order first
      const order = await createOrder()
      
      if (paymentMethod === 'razorpay') {
        // Handle Razorpay payment
        await handleRazorpayPayment(order)
      } else if (paymentMethod === 'upi') {
        // Handle UPI payment
        await handleUPIPayment(order)
      } else if (paymentMethod === 'bank_transfer') {
        // Handle bank transfer
        await handleBankTransfer(order)
      } else {
        // Handle COD
        await handleCODPayment(order)
      }
      
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Failed to process payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUPIPayment = async (order: any) => {
    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        
        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
      }

      const options = {
        key: order.razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: order.name,
        description: order.description,
        order_id: order.razorpayOrderId,
        prefill: order.prefill,
        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false
        },
        theme: {
          color: '#7c3aed'
        },
        handler: async (response: any) => {
          try {
            console.log('UPI payment response:', response)
            
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: order.id,
                razorpay_order_id: order.razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentMethod: 'upi'
              })
            })

            const verifyResult = await verifyResponse.json()
            console.log('Payment verification result:', verifyResult)

            if (!verifyResponse.ok || !verifyResult.success) {
              throw new Error(verifyResult.error || 'Payment verification failed')
            }

            toast.success('UPI Payment successful! Order confirmed.')
            clearCart()
            router.push(`/order-confirmation/${order.id}`)
          } catch (error: any) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled')
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error: any) {
      console.error('UPI payment error:', error)
      throw new Error('Failed to initialize UPI payment')
    }
  }

  const handleRazorpayPayment = async (order: any) => {
    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        
        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
      }

      const options = {
        key: order.razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: order.name,
        description: order.description,
        order_id: order.razorpayOrderId,
        prefill: order.prefill,
        theme: {
          color: '#dc2626'
        },
        handler: async (response: any) => {
          try {
            console.log('Razorpay payment response:', response)
            
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: order.id,
                razorpay_order_id: order.razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentMethod: 'razorpay'
              })
            })

            const verifyResult = await verifyResponse.json()
            console.log('Payment verification result:', verifyResult)

            if (!verifyResponse.ok || !verifyResult.success) {
              throw new Error(verifyResult.error || 'Payment verification failed')
            }

            toast.success('Payment successful! Order confirmed.')
            clearCart()
            router.push(`/order-confirmation/${order.id}`)
          } catch (error: any) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled')
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error: any) {
      console.error('Razorpay error:', error)
      throw new Error('Failed to initialize payment gateway')
    }
  }

  const handleBankTransfer = async (order: any) => {
    try {
      // Show bank details from order
      const bankDetails = order.bankDetails
      
      // Create a modal-like dialog with bank details
      const showBankDetails = () => {
        const bankDetailsMessage = `
Bank Transfer Details:

Bank Name: ${bankDetails.bankName}
Account Name: ${bankDetails.accountName}
Account Number: ${bankDetails.accountNumber}
IFSC Code: ${bankDetails.ifscCode}
Amount: ₹${order.total.toLocaleString()}

Please transfer the exact amount and enter your transaction ID below.`
        
        return prompt(bankDetailsMessage + '\n\nTransaction ID:')
      }
      
      const transactionId = showBankDetails()
      
      if (!transactionId || transactionId.trim() === '') {
        throw new Error('Transaction ID is required for bank transfer verification')
      }

      // Verify bank transfer
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          paymentMethod: 'bank_transfer',
          bankTransferDetails: {
            transactionId: transactionId.trim()
          }
        })
      })

      if (!verifyResponse.ok) {
        throw new Error('Bank transfer verification failed')
      }

      toast.success('Bank transfer details recorded! Order created.')
      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (error: any) {
      console.error('Bank transfer error:', error)
      throw error
    }
  }

  const handleCODPayment = async (order: any) => {
    try {
      // Verify COD order
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          paymentMethod: 'cod'
        })
      })

      if (!verifyResponse.ok) {
        throw new Error('Order confirmation failed')
      }

      toast.success('Order confirmed! You can pay when the order is delivered.')
      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (error: any) {
      console.error('COD verification error:', error)
      throw error
    }
  }

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  // Show empty cart message if no items
  if (isAuthenticated && cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b-4 border-amber-600 bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="flex items-center text-amber-100 hover:text-amber-300">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Cart
              </Link>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-amber-100">Secure Checkout</h1>
                <p className="text-amber-200 text-sm">Complete your purchase securely</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-green-200 text-sm font-medium">SSL Secured</span>
            </div>
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-red-600">Shipping</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-600 rounded-full text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Payment</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-600 rounded-full text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-red-600" />
                  <span>Account Information</span>
                </CardTitle>
                <CardDescription>Logged in as {user?.email}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">{user?.displayName || 'User'}</p>
                    <p className="text-sm text-green-600">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <span>Delivery Address</span>
                </CardTitle>
                <CardDescription>Where should we deliver your order?</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleAddressChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => handleAddressChange('email', e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">Street Address *</Label>
                  <Textarea
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => handleAddressChange('address', e.target.value)}
                    placeholder="Enter your complete street address"
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      placeholder="Enter city"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">State *</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      placeholder="Enter state"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={shippingAddress.pincode}
                      onChange={(e) => handleAddressChange('pincode', e.target.value)}
                      placeholder="Enter pincode"
                      maxLength={6}
                      className="h-12"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50">
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-red-600" />
                  <span>Payment Method</span>
                </CardTitle>
                <CardDescription>Choose how you'd like to pay</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'cod' 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className="flex items-center space-x-3">
                        <Package className="h-6 w-6 text-orange-600" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-gray-600">Pay when delivered</p>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'razorpay' 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('razorpay')}
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium">Card Payment</p>
                          <p className="text-sm text-gray-600">Credit/Debit cards</p>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'upi' 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-6 w-6 text-purple-600" />
                        <div>
                          <p className="font-medium">UPI Payment</p>
                          <p className="text-sm text-gray-600">PhonePe, GPay, Paytm</p>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'bank_transfer' 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('bank_transfer')}
                    >
                      <div className="flex items-center space-x-3">
                        <IndianRupee className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-medium">Bank Transfer</p>
                          <p className="text-sm text-gray-600">Direct transfer</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'cod' && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Package className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">Cash on Delivery</p>
                          <p className="text-sm text-yellow-700">Pay ₹{orderTotal.toLocaleString()} when your order is delivered to your doorstep.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'razorpay' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-800">Secure Card Payment</p>
                          <p className="text-sm text-blue-700">Your payment information is encrypted and secure. Powered by Razorpay.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Smartphone className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-purple-800">UPI Payment</p>
                          <p className="text-sm text-purple-700">Pay instantly using PhonePe, Google Pay, Paytm, or any UPI app. Safe, secure, and instant.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bank_transfer' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <IndianRupee className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800">Bank Transfer</p>
                          <p className="text-sm text-green-700">Transfer ₹{orderTotal.toLocaleString()} directly to our bank account.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-red-600 to-amber-600 text-white">
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Order Summary</span>
                  </CardTitle>
                  <CardDescription className="text-red-100">
                    {cartState.itemCount} item{cartState.itemCount !== 1 ? 's' : ''} in your cart
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {/* Order Items */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {cartState.items.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-3">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-600 text-white text-xs">
                            {item.quantity}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                          <p className="text-xs text-gray-600 truncate">{item.punjabiName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs px-1 py-0">{item.size}</Badge>
                            <Badge variant="outline" className="text-xs px-1 py-0">{item.color}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                        {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (GST 18%)</span>
                      <span className="font-medium">₹{tax.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="flex items-center text-red-600">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {orderTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Security Features */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span>Free delivery on all orders</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Gift className="h-4 w-4 text-purple-600" />
                      <span>7-day return policy</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Place Order Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-3" />
                        Place Order • ₹{orderTotal.toLocaleString()}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    By placing your order, you agree to our{' '}
                    <Link href="/terms" className="text-red-600 hover:underline">Terms of Service</Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-red-600 hover:underline">Privacy Policy</Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}