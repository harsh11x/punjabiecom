import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, RotateCcw, Shield, Clock, CheckCircle, XCircle, AlertTriangle, Package, RefreshCw } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Returns & Exchanges</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🔄</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Easy Returns & Exchanges
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We want you to love your purchase! If you're not completely satisfied, 
              we offer hassle-free returns and exchanges within 30 days.
            </p>
          </div>

          {/* Return Policy Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">30-Day Window</h3>
                <p className="text-gray-600">
                  Return or exchange items within 30 days of delivery for a full refund
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
                <p className="text-gray-600">
                  All items must be in original condition with tags attached
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <RefreshCw className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Free Exchanges</h3>
                <p className="text-gray-600">
                  Exchange for different size or color at no additional cost
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Return Process */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RotateCcw className="h-5 w-5 mr-2" />
                How to Return an Item
              </CardTitle>
              <CardDescription>
                Follow these simple steps to return your purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Contact Us</h4>
                    <p className="text-gray-600">
                      Email us at returns@punjabi-heritage.com or call +91 98765 43210 
                      with your order number and reason for return.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Get Return Label</h4>
                    <p className="text-gray-600">
                      We'll email you a prepaid return shipping label within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Pack & Ship</h4>
                    <p className="text-gray-600">
                      Pack the item in its original packaging with all tags attached. 
                      Attach the return label and drop off at any courier location.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Get Refund</h4>
                    <p className="text-gray-600">
                      Once we receive and inspect your return, we'll process your refund 
                      within 5-7 business days to your original payment method.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Returnable Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Items in original condition with tags
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Unworn and unwashed clothing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Accessories in original packaging
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Items returned within 30 days
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Defective or damaged items
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <XCircle className="h-5 w-5 mr-2" />
                  Non-Returnable Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    Items without original tags
                  </li>
                  <li className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    Worn or washed clothing
                  </li>
                  <li className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    Custom or personalized items
                  </li>
                  <li className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    Items returned after 30 days
                  </li>
                  <li className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    Sale items (final sale)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Exchange Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Exchanges
              </CardTitle>
              <CardDescription>
                Need a different size or color? We make exchanges easy!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Exchanges are free within 30 days of purchase. Simply follow the return process 
                  and specify that you'd like an exchange instead of a refund.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Exchange Options:</h4>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Different size of the same item</li>
                    <li>• Different color of the same item</li>
                    <li>• Different item of equal or lesser value</li>
                    <li>• Store credit for future purchases</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help with Your Return?</CardTitle>
              <CardDescription>
                Our customer service team is here to assist you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>📧 returns@punjabi-heritage.com</p>
                    <p>📞 +91 98765 43210</p>
                    <p>🕒 Mon-Fri: 9 AM - 6 PM IST</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What to Include</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>• Order number</p>
                    <p>• Item name and size</p>
                    <p>• Reason for return</p>
                    <p>• Photos (if damaged/defective)</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <Link href="/contact">
                  <Button>Contact Support</Button>
                </Link>
                <Link href="/orders">
                  <Button variant="outline">View My Orders</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
