import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Ruler, User, Shirt, Footprints, AlertCircle, Info } from 'lucide-react'

export default function SizeGuidePage() {
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
            <h1 className="text-2xl font-bold text-gray-900">Size Guide</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📏</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Fit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Use our comprehensive size guide to ensure your traditional Punjabi clothing 
              and accessories fit perfectly. Measurements are in inches unless specified.
            </p>
          </div>

          {/* How to Measure */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ruler className="h-5 w-5 mr-2" />
                How to Measure Yourself
              </CardTitle>
              <CardDescription>
                Follow these steps for accurate measurements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">General Tips:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Use a flexible measuring tape</li>
                    <li>• Measure over light clothing or undergarments</li>
                    <li>• Keep the tape snug but not tight</li>
                    <li>• Stand straight with arms at your sides</li>
                    <li>• Ask someone to help for accurate measurements</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                  <p className="text-blue-800 text-sm mb-3">
                    If you're unsure about sizing, our customer service team can help you choose the right size.
                  </p>
                  <Link href="/contact">
                    <Button size="sm" variant="outline">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Women's Clothing Sizes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Women's Clothing Sizes
              </CardTitle>
              <CardDescription>
                Punjabi suits, kurtas, and traditional wear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-2">Size</th>
                      <th className="text-left py-3 px-2">Bust</th>
                      <th className="text-left py-3 px-2">Waist</th>
                      <th className="text-left py-3 px-2">Hips</th>
                      <th className="text-left py-3 px-2">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">XS</td>
                      <td className="py-3 px-2">32-34"</td>
                      <td className="py-3 px-2">26-28"</td>
                      <td className="py-3 px-2">34-36"</td>
                      <td className="py-3 px-2">42-44"</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">S</td>
                      <td className="py-3 px-2">34-36"</td>
                      <td className="py-3 px-2">28-30"</td>
                      <td className="py-3 px-2">36-38"</td>
                      <td className="py-3 px-2">42-44"</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">M</td>
                      <td className="py-3 px-2">36-38"</td>
                      <td className="py-3 px-2">30-32"</td>
                      <td className="py-3 px-2">38-40"</td>
                      <td className="py-3 px-2">44-46"</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">L</td>
                      <td className="py-3 px-2">38-40"</td>
                      <td className="py-3 px-2">32-34"</td>
                      <td className="py-3 px-2">40-42"</td>
                      <td className="py-3 px-2">44-46"</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">XL</td>
                      <td className="py-3 px-2">40-42"</td>
                      <td className="py-3 px-2">34-36"</td>
                      <td className="py-3 px-2">42-44"</td>
                      <td className="py-3 px-2">46-48"</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">XXL</td>
                      <td className="py-3 px-2">42-44"</td>
                      <td className="py-3 px-2">36-38"</td>
                      <td className="py-3 px-2">44-46"</td>
                      <td className="py-3 px-2">46-48"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Men's Clothing Sizes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shirt className="h-5 w-5 mr-2" />
                Men's Clothing Sizes
              </CardTitle>
              <CardDescription>
                Kurtas, sherwanis, and traditional wear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-2">Size</th>
                      <th className="text-left py-3 px-2">Chest</th>
                      <th className="text-left py-3 px-2">Waist</th>
                      <th className="text-left py-3 px-2">Shoulder</th>
                      <th className="text-left py-3 px-2">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">S</td>
                      <td className="py-3 px-2">36-38"</td>
                      <td className="py-3 px-2">30-32"</td>
                      <td className="py-3 px-2">17-18"</td>
                      <td className="py-3 px-2">40-42"</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">M</td>
                      <td className="py-3 px-2">38-40"</td>
                      <td className="py-3 px-2">32-34"</td>
                      <td className="py-3 px-2">18-19"</td>
                      <td className="py-3 px-2">42-44"</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">L</td>
                      <td className="py-3 px-2">40-42"</td>
                      <td className="py-3 px-2">34-36"</td>
                      <td className="py-3 px-2">19-20"</td>
                      <td className="py-3 px-2">44-46"</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">XL</td>
                      <td className="py-3 px-2">42-44"</td>
                      <td className="py-3 px-2">36-38"</td>
                      <td className="py-3 px-2">20-21"</td>
                      <td className="py-3 px-2">46-48"</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">XXL</td>
                      <td className="py-3 px-2">44-46"</td>
                      <td className="py-3 px-2">38-40"</td>
                      <td className="py-3 px-2">21-22"</td>
                      <td className="py-3 px-2">48-50"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Footwear Sizes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Footprints className="h-5 w-5 mr-2" />
                Footwear Sizes (Juttis & Traditional Shoes)
              </CardTitle>
              <CardDescription>
                Size conversion chart for traditional footwear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">Women's Footwear</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-2">Indian Size</th>
                          <th className="text-left py-2">US Size</th>
                          <th className="text-left py-2">Foot Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">4</td>
                          <td className="py-2">6</td>
                          <td className="py-2">9.0"</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">5</td>
                          <td className="py-2">7</td>
                          <td className="py-2">9.5"</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">6</td>
                          <td className="py-2">8</td>
                          <td className="py-2">10.0"</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">7</td>
                          <td className="py-2">9</td>
                          <td className="py-2">10.5"</td>
                        </tr>
                        <tr>
                          <td className="py-2">8</td>
                          <td className="py-2">10</td>
                          <td className="py-2">11.0"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Men's Footwear</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-2">Indian Size</th>
                          <th className="text-left py-2">US Size</th>
                          <th className="text-left py-2">Foot Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">6</td>
                          <td className="py-2">7</td>
                          <td className="py-2">9.5"</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">7</td>
                          <td className="py-2">8</td>
                          <td className="py-2">10.0"</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">8</td>
                          <td className="py-2">9</td>
                          <td className="py-2">10.5"</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">9</td>
                          <td className="py-2">10</td>
                          <td className="py-2">11.0"</td>
                        </tr>
                        <tr>
                          <td className="py-2">10</td>
                          <td className="py-2">11</td>
                          <td className="py-2">11.5"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
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
                  <li>• Sizes may vary slightly between different products</li>
                  <li>• Traditional clothing often has a relaxed fit</li>
                  <li>• Handcrafted items may have minor size variations</li>
                  <li>• When in doubt, choose the larger size</li>
                  <li>• Check individual product descriptions for specific sizing</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Info className="h-5 w-5 mr-2" />
                  Alteration Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Free basic alterations on orders above ₹2,999</li>
                  <li>• Professional tailoring available</li>
                  <li>• Length adjustments for kurtas and suits</li>
                  <li>• Sleeve and waist modifications</li>
                  <li>• Contact us for custom sizing requirements</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact for Sizing Help */}
          <Card>
            <CardHeader>
              <CardTitle>Need Sizing Help?</CardTitle>
              <CardDescription>
                Our sizing experts are here to help you find the perfect fit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Sizing Support</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>📧 sizing@punjabi-heritage.com</p>
                    <p>📞 +91 98765 43210</p>
                    <p>🕒 Mon-Fri: 10 AM - 6 PM IST</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What We Can Help With</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>• Size recommendations based on measurements</p>
                    <p>• Product-specific sizing questions</p>
                    <p>• Alteration and customization options</p>
                    <p>• Exchange guidance for sizing issues</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <Link href="/contact">
                  <Button>Get Sizing Help</Button>
                </Link>
                <Link href="/returns">
                  <Button variant="outline">Exchange Policy</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
