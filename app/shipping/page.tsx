'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from '@/components/shopping-cart'
import { ArrowLeft, Truck, Package, Clock, MapPin, Shield, AlertCircle } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b-4 border-amber-600 bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-100 hover:text-amber-300 hover:bg-red-700/50"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-amber-100">ਸ਼ਿਪਿੰਗ ਜਾਣਕਾਰੀ</h1>
                <p className="text-amber-200">Shipping Information</p>
              </div>
            </div>
            <ShoppingCart />
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-red-900 mb-4">
            ਸ਼ਿਪਿੰਗ ਅਤੇ ਡਿਲੀਵਰੀ
          </h2>
          <p className="text-xl text-red-700 mb-2">Shipping & Delivery Information</p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We deliver authentic Punjabi products across India with care and speed. 
            Learn about our shipping options, delivery times, and policies.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-red-900">Free Shipping</h3>
              <p className="text-gray-700">On orders above ₹999 across India</p>
              <Badge className="bg-green-100 text-green-800">No minimum for Punjab</Badge>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-red-900">Fast Delivery</h3>
              <p className="text-gray-700">3-7 business days across India</p>
              <Badge className="bg-blue-100 text-blue-800">1-2 days in Punjab</Badge>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-red-900">Secure Packaging</h3>
              <p className="text-gray-700">Products carefully packed to prevent damage</p>
              <Badge className="bg-purple-100 text-purple-800">100% Safe</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Options */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Shipping Options</span>
            </CardTitle>
            <CardDescription>
              Choose the delivery option that works best for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">Standard Delivery</h4>
                    <p className="text-gray-600">3-7 business days</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹99</p>
                    <p className="text-sm text-gray-500">or Free above ₹999</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Available across India</span>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">Express Delivery</h4>
                    <p className="text-gray-600">1-3 business days</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹199</p>
                    <p className="text-sm text-gray-500">or Free above ₹1499</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Available in major cities</span>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">Same Day Delivery</h4>
                    <p className="text-gray-600">Order by 12 PM, delivered same day</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹299</p>
                    <p className="text-sm text-gray-500">Limited areas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Available in select cities</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Process */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Delivery Process</CardTitle>
            <CardDescription>
              Here's what happens after you place your order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Order Confirmation</h4>
                  <p className="text-gray-700 text-sm">
                    You'll receive an email and SMS confirmation with your order details.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Processing</h4>
                  <p className="text-gray-700 text-sm">
                    We carefully pack your authentic Punjabi products with love and care.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Shipment Dispatch</h4>
                  <p className="text-gray-700 text-sm">
                    Your order is handed over to our delivery partner with tracking details.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Out for Delivery</h4>
                  <p className="text-gray-700 text-sm">
                    Your package is on its way! Track it using the provided tracking number.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Delivered</h4>
                  <p className="text-gray-700 text-sm">
                    Your authentic Punjabi products are delivered to your doorstep!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Important Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Order Cut-off Times</h4>
                <p className="text-yellow-700 text-sm">
                  Orders placed before 2:00 PM (IST) on business days are processed the same day. 
                  Orders placed after 2:00 PM or on weekends/holidays are processed the next business day.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Tracking Your Order</h4>
                <p className="text-blue-700 text-sm">
                  Once your order is shipped, you'll receive a tracking number via email and SMS. 
                  You can track your package on our website or the courier partner's website.
                </p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Delivery Attempts</h4>
                <p className="text-red-700 text-sm">
                  Our delivery partners will make 3 attempts to deliver your package. 
                  If unsuccessful, the package will be returned to us, and you'll be contacted for re-delivery.
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Packaging</h4>
                <p className="text-green-700 text-sm">
                  All products are carefully packed in protective materials to ensure they reach you in perfect condition. 
                  We use eco-friendly packaging whenever possible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact for Shipping */}
        <div className="text-center bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Questions About Shipping?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our customer service team is here to help with any shipping-related queries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-red-600 hover:bg-gray-100 px-6 py-2">
                Contact Support
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-6 py-2">
              Call: +91 98765 43210
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}