'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from '@/components/shopping-cart'
import { ArrowLeft, RotateCcw, Shield, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function ReturnsPage() {
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
                <h1 className="text-2xl lg:text-3xl font-bold text-amber-100">ਵਾਪਸੀ</h1>
                <p className="text-amber-200">Returns & Exchanges</p>
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
            ਵਾਪਸੀ ਅਤੇ ਅਦਲਾ-ਬਦਲੀ
          </h2>
          <p className="text-xl text-red-700 mb-2">Returns & Exchange Policy</p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We want you to be completely satisfied with your purchase. If you're not happy with your order, 
            we're here to help with easy returns and exchanges.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-red-900">7-Day Returns</h3>
              <p className="text-gray-700">Easy returns within 7 days of delivery</p>
              <Badge className="bg-green-100 text-green-800">No questions asked</Badge>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <RotateCcw className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-red-900">Free Exchanges</h3>
              <p className="text-gray-700">Size or color exchanges at no extra cost</p>
              <Badge className="bg-blue-100 text-blue-800">Within Punjab</Badge>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-red-900">Quality Guarantee</h3>
              <p className="text-gray-700">100% refund for defective products</p>
              <Badge className="bg-purple-100 text-purple-800">Guaranteed</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Return Policy */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5" />
              <span>Return Policy</span>
            </CardTitle>
            <CardDescription>
              Detailed information about our return process and conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4">Return Window</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">7 days from delivery date for all products</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">14 days for defective or damaged items</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">30 days for wrong item delivered</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4">Return Conditions</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Eligible for Return
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Items in original condition</li>
                      <li>• Unused and unworn products</li>
                      <li>• Original packaging intact</li>
                      <li>• All tags and labels attached</li>
                      <li>• No signs of wear or damage</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                      <XCircle className="h-4 w-4 mr-2" />
                      Not Eligible for Return
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Worn or used items</li>
                      <li>• Damaged by customer</li>
                      <li>• Missing original packaging</li>
                      <li>• Custom or personalized items</li>
                      <li>• Items beyond return window</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Policy */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Exchange Policy</CardTitle>
            <CardDescription>
              Easy size and color exchanges for the perfect fit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-red-900 mb-4">Size Exchange</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Free size exchange within Punjab</li>
                    <li>• ₹99 shipping for other states</li>
                    <li>• Same product, different size</li>
                    <li>• Subject to availability</li>
                    <li>• 7-day exchange window</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-red-900 mb-4">Color Exchange</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Exchange for different color</li>
                    <li>• Same price range products</li>
                    <li>• Free within Punjab</li>
                    <li>• ₹99 shipping for other states</li>
                    <li>• Based on stock availability</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Process */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>How to Return/Exchange</CardTitle>
            <CardDescription>
              Simple steps to return or exchange your products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Contact Us</h4>
                  <p className="text-gray-700 text-sm">
                    Email us at returns@punjabheritage.com or call +91 98765 43210 with your order number.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Get Return Authorization</h4>
                  <p className="text-gray-700 text-sm">
                    We'll provide you with a Return Authorization Number (RAN) and return instructions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Pack the Item</h4>
                  <p className="text-gray-700 text-sm">
                    Pack the item in original packaging with all tags, labels, and accessories.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ship the Package</h4>
                  <p className="text-gray-700 text-sm">
                    Use the prepaid return label (if provided) or ship at your cost to our return address.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Processing & Refund</h4>
                  <p className="text-gray-700 text-sm">
                    We'll process your return within 3-5 business days and issue refund/exchange.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Information */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Refund Information</CardTitle>
            <CardDescription>
              Details about refund processing and timelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-red-900">Refund Methods</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Original payment method (preferred)</li>
                  <li>• Bank transfer (if original method unavailable)</li>
                  <li>• Store credit (for exchanges)</li>
                  <li>• Cash refund for COD orders</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-red-900">Refund Timeline</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Credit/Debit Cards: 5-7 business days</li>
                  <li>• UPI/Net Banking: 3-5 business days</li>
                  <li>• Bank Transfer: 3-5 business days</li>
                  <li>• COD Refund: 7-10 business days</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Cases */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Special Cases</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Damaged/Defective Products</h4>
                <p className="text-red-700 text-sm">
                  If you receive a damaged or defective product, contact us immediately with photos. 
                  We'll arrange for immediate replacement or full refund including shipping costs.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Wrong Item Delivered</h4>
                <p className="text-blue-700 text-sm">
                  If you receive the wrong item, we'll arrange for pickup of the incorrect item and 
                  send the correct one at no additional cost. Extended 30-day return window applies.
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Custom/Personalized Items</h4>
                <p className="text-green-700 text-sm">
                  Custom-made or personalized items cannot be returned unless they are defective or 
                  not made according to specifications. Please review your customization carefully before ordering.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Bulk Orders</h4>
                <p className="text-yellow-700 text-sm">
                  For bulk orders (10+ items), special return conditions may apply. 
                  Please contact our customer service team for bulk order return policies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="text-center bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Need Help with Returns?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our customer service team is ready to assist you with any return or exchange queries.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-sm opacity-90">returns@punjabheritage.com</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2">Phone</h4>
              <p className="text-sm opacity-90">+91 98765 43210</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2">Hours</h4>
              <p className="text-sm opacity-90">Mon-Sat: 9 AM - 7 PM</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-red-600 hover:bg-gray-100 px-6 py-2">
                Contact Support
              </Button>
            </Link>
            <Link href="/shipping">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-6 py-2">
                Shipping Info
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}