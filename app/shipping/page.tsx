import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Truck, Package, Clock, MapPin, Shield, AlertCircle, Globe, Plane } from 'lucide-react'

export default function ShippingPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">Shipping Information</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🚚</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fast & Reliable Shipping
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We deliver your authentic Punjabi heritage products safely and quickly 
              to your doorstep, anywhere in the world.
            </p>
          </div>

          {/* Shipping Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Domestic Shipping (India)
                </CardTitle>
                <CardDescription>
                  Fast delivery across all Indian states and territories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Standard Delivery</span>
                    <Badge variant="outline">3-7 Business Days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Express Delivery</span>
                    <Badge variant="outline">1-3 Business Days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Free Shipping</span>
                    <Badge className="bg-green-100 text-green-800">Orders ₹999+</Badge>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      <Shield className="h-4 w-4 inline mr-1" />
                      Cash on Delivery available for all domestic orders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-600" />
                  International Shipping
                </CardTitle>
                <CardDescription>
                  Worldwide delivery to bring Punjab to your doorstep
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Standard International</span>
                    <Badge variant="outline">7-14 Business Days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Express International</span>
                    <Badge variant="outline">3-7 Business Days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tracking Included</span>
                    <Badge className="bg-blue-100 text-blue-800">All Orders</Badge>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <Plane className="h-4 w-4 inline mr-1" />
                      Customs duties may apply based on destination country
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Rates */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Shipping Rates
              </CardTitle>
              <CardDescription>
                Transparent pricing for all shipping options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Destination</th>
                      <th className="text-left py-2">Standard</th>
                      <th className="text-left py-2">Express</th>
                      <th className="text-left py-2">Free Shipping</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b">
                      <td className="py-3 font-medium">India (All States)</td>
                      <td className="py-3">₹99</td>
                      <td className="py-3">₹199</td>
                      <td className="py-3">Orders ₹999+</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium">USA & Canada</td>
                      <td className="py-3">₹1,299</td>
                      <td className="py-3">₹2,499</td>
                      <td className="py-3">Orders ₹4,999+</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium">UK & Europe</td>
                      <td className="py-3">₹1,199</td>
                      <td className="py-3">₹2,299</td>
                      <td className="py-3">Orders ₹4,999+</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium">Australia & NZ</td>
                      <td className="py-3">₹1,399</td>
                      <td className="py-3">₹2,699</td>
                      <td className="py-3">Orders ₹4,999+</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">Other Countries</td>
                      <td className="py-3">₹1,499</td>
                      <td className="py-3">₹2,899</td>
                      <td className="py-3">Orders ₹5,999+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Process */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                How We Ship Your Order
              </CardTitle>
              <CardDescription>
                From our warehouse to your doorstep
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Order Processing</h4>
                    <p className="text-gray-600">
                      We carefully pack your items within 1-2 business days. 
                      You'll receive a confirmation email with tracking details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Quality Check</h4>
                    <p className="text-gray-600">
                      Each item is inspected for quality and authenticity before packaging 
                      to ensure you receive perfect products.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Secure Packaging</h4>
                    <p className="text-gray-600">
                      Items are wrapped in protective materials and placed in branded packaging 
                      to prevent damage during transit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Tracking & Delivery</h4>
                    <p className="text-gray-600">
                      Track your package in real-time and receive updates until it reaches your doorstep. 
                      Signature may be required for high-value items.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Delivery times are estimates and may vary during peak seasons</li>
                  <li>• International orders may be subject to customs delays</li>
                  <li>• We're not responsible for customs duties or taxes</li>
                  <li>• Address changes after shipping incur additional charges</li>
                  <li>• Signature required for orders above ₹5,000</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Shield className="h-5 w-5 mr-2" />
                  Shipping Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• All packages are insured against loss or damage</li>
                  <li>• Real-time tracking provided for all orders</li>
                  <li>• Secure packaging to prevent damage</li>
                  <li>• Replacement guarantee for damaged items</li>
                  <li>• 24/7 customer support for shipping issues</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact for Shipping */}
          <Card>
            <CardHeader>
              <CardTitle>Questions About Shipping?</CardTitle>
              <CardDescription>
                Our shipping team is here to help with any questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Shipping Support</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>📧 shipping@punjabi-heritage.com</p>
                    <p>📞 +91 98765 43210</p>
                    <p>🕒 Mon-Sat: 9 AM - 7 PM IST</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Track Your Order</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>Use your order number to track shipments</p>
                    <p>Receive SMS and email updates</p>
                    <p>Real-time location tracking</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <Link href="/contact">
                  <Button>Contact Support</Button>
                </Link>
                <Link href="/orders">
                  <Button variant="outline">Track My Order</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
