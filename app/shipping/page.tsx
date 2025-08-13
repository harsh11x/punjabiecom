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
                  <h3 className="text-xl font-bold text-red-900">Standard Delivery</h3>
                  <Badge className="bg-green-100 text-green-800">Most Popular</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Time</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Punjab: 1-2 business days</li>
                      <li>• North India: 2-4 business days</li>
                      <li>• Rest of India: 3-7 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Cost</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• FREE on orders ≥ ₹999</li>
                      <li>• ₹99 for orders < ₹999</li>
                      <li>• FREE shipping within Punjab</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-red-900">Express Delivery</h3>
                  <Badge className="bg-blue-100 text-blue-800">Fastest</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Time</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Punjab: Same day / Next day</li>
                      <li>• Delhi NCR: 1-2 business days</li>
                      <li>• Major cities: 2-3 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Cost</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• ₹199 for all orders</li>
                      <li>• Available in select cities</li>
                      <li>• Order before 2 PM for same day</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-red-900">Cash on Delivery (COD)</h3>
                  <Badge className="bg-amber-100 text-amber-800">Pay on Delivery</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Availability</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Available across India</li>
                      <li>• Standard delivery times apply</li>
                      <li>• Pay when you receive</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Additional Charges</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• ₹49 COD charges</li>
                      <li>• FREE COD on orders ≥ ₹1499</li>
                      <li>• Cash payment only</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Areas */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Delivery Areas</span>
            </CardTitle>
            <CardDescription>
              We deliver to the following locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-red-900">Punjab (1-2 days)</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Amritsar</li>
                  <li>• Ludhiana</li>
                  <li>• Jalandhar</li>
                  <li>• Patiala</li>
                  <li>• Chandigarh</li>
                  <li>• All other Punjab cities</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-red-900">North India (2-4 days)</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Delhi NCR</li>
                  <li>• Haryana</li>
                  <li>• Himachal Pradesh</li>
                  <li>• Rajasthan</li>
                  <li>• Uttar Pradesh</li>
                  <li>• Uttarakhand</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-red-900">Rest of India (3-7 days)</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Maharashtra</li>
                  <li>• Gujarat</li>
                  <li>• Karnataka</li>
                  <li>• Tamil Nadu</li>
                  <li>• West Bengal</li>
                  <li>• All other states</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Processing */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Order Processing Timeline</CardTitle>
            <CardDescription>
              Here's what happens after you place your order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Order Confirmation</h4>
                  <p className="text-gray-700 text-sm">
                    You'll receive an email confirmation within minutes of placing your order.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Order Processing</h4>
                  <p className="text-gray-700 text-sm">
                    Our team carefully picks and packs your items (1-2 business days).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
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