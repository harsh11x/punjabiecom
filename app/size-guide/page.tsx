'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShoppingCart } from '@/components/shopping-cart'
import { ArrowLeft, Ruler, Footprints, AlertCircle, HelpCircle } from 'lucide-react'

export default function SizeGuidePage() {
  const [selectedSize, setSelectedSize] = useState('')

  const menSizes = [
    { size: '6', length: '24.5', width: '9.5' },
    { size: '7', length: '25.0', width: '10.0' },
    { size: '8', length: '25.5', width: '10.5' },
    { size: '9', length: '26.0', width: '11.0' },
    { size: '10', length: '26.5', width: '11.5' },
    { size: '11', length: '27.0', width: '12.0' },
    { size: '12', length: '27.5', width: '12.5' }
  ]

  const womenSizes = [
    { size: '4', length: '22.5', width: '8.5' },
    { size: '5', length: '23.0', width: '9.0' },
    { size: '6', length: '23.5', width: '9.5' },
    { size: '7', length: '24.0', width: '10.0' },
    { size: '8', length: '24.5', width: '10.5' },
    { size: '9', length: '25.0', width: '11.0' },
    { size: '10', length: '25.5', width: '11.5' }
  ]

  const kidsSizes = [
    { size: '1', length: '16.5', width: '6.5', age: '1-2 years' },
    { size: '2', length: '17.5', width: '7.0', age: '2-3 years' },
    { size: '3', length: '18.5', width: '7.5', age: '3-4 years' },
    { size: '4', length: '19.5', width: '8.0', age: '4-5 years' },
    { size: '5', length: '20.5', width: '8.5', age: '5-6 years' },
    { size: '6', length: '21.5', width: '9.0', age: '6-7 years' }
  ]

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
                <h1 className="text-2xl lg:text-3xl font-bold text-amber-100">ਸਾਈਜ਼ ਗਾਈਡ</h1>
                <p className="text-amber-200">Size Guide</p>
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
            ਸਾਈਜ਼ ਗਾਈਡ ਅਤੇ ਫਿਟ
          </h2>
          <p className="text-xl text-red-700 mb-2">Size Guide & Fit Information</p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Find your perfect fit with our comprehensive size guide for traditional Punjabi jutti. 
            Proper sizing ensures comfort and authentic look.
          </p>
        </div>

        {/* How to Measure */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Ruler className="h-5 w-5" />
              <span>How to Measure Your Feet</span>
            </CardTitle>
            <CardDescription>
              Follow these simple steps to get accurate measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Prepare</h4>
                    <p className="text-gray-700 text-sm">
                      Place a blank paper on a flat surface against a wall. Wear the socks you plan to wear with the jutti.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Position</h4>
                    <p className="text-gray-700 text-sm">
                      Stand with your heel against the wall and your foot flat on the paper.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Mark</h4>
                    <p className="text-gray-700 text-sm">
                      Mark the longest point of your foot (usually the big toe) on the paper.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Measure</h4>
                    <p className="text-gray-700 text-sm">
                      Measure the distance from the wall to the mark in centimeters. Repeat for both feet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Footprints className="h-16 w-16 mx-auto mb-4" />
                  <p className="font-semibold">Foot Measurement Diagram</p>
                  <p className="text-sm">Visual guide for measuring your foot</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Size Charts */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Size Charts</CardTitle>
            <CardDescription>
              Select the appropriate category to view size measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="women" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="women">Women's Jutti</TabsTrigger>
                <TabsTrigger value="men">Men's Jutti</TabsTrigger>
                <TabsTrigger value="kids">Kids' Jutti</TabsTrigger>
              </TabsList>

              <TabsContent value="women" className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-red-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Size</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Length (cm)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Width (cm)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      {womenSizes.map((size, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3 font-semibold">{size.size}</td>
                          <td className="border border-gray-300 p-3">{size.length}</td>
                          <td className="border border-gray-300 p-3">{size.width}</td>
                          <td className="border border-gray-300 p-3 text-sm text-gray-600">
                            Foot length {parseFloat(size.length) - 0.5}-{size.length} cm
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="men" className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-red-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Size</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Length (cm)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Width (cm)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menSizes.map((size, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3 font-semibold">{size.size}</td>
                          <td className="border border-gray-300 p-3">{size.length}</td>
                          <td className="border border-gray-300 p-3">{size.width}</td>
                          <td className="border border-gray-300 p-3 text-sm text-gray-600">
                            Foot length {parseFloat(size.length) - 0.5}-{size.length} cm
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="kids" className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-red-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Size</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Length (cm)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Width (cm)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Age Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kidsSizes.map((size, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3 font-semibold">{size.size}</td>
                          <td className="border border-gray-300 p-3">{size.length}</td>
                          <td className="border border-gray-300 p-3">{size.width}</td>
                          <td className="border border-gray-300 p-3 text-sm text-gray-600">{size.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Fit Guide */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Fit Guide</CardTitle>
            <CardDescription>
              Understanding how traditional jutti should fit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-3">Perfect Fit Characteristics</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Snug but not tight around the foot</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>About 0.5-1 cm space at the toe</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Heel sits comfortably in the back</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>No pinching or pressure points</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Easy to slip on and off</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-3">Signs of Wrong Size</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>Toes touching the front</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>Heel hanging over the back</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>Foot sliding inside the jutti</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>Difficulty putting on or taking off</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>Pinching or discomfort</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-3">Traditional Jutti Fit</h4>
                  <p className="text-blue-700 text-sm">
                    Traditional Punjabi jutti are designed to fit snugly. Unlike western shoes, 
                    they don't have laces or straps, so the fit should be secure but comfortable. 
                    The leather will soften and mold to your foot shape with wear.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h4 className="font-semibold text-amber-800 mb-3">Breaking In Period</h4>
                  <p className="text-amber-700 text-sm">
                    New jutti may feel slightly tight initially. This is normal as the leather 
                    needs time to soften and adapt to your foot shape. Wear them for short 
                    periods initially to allow proper breaking in.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-green-800 mb-3">Care Tips</h4>
                  <p className="text-green-700 text-sm">
                    To maintain the fit and shape, store your jutti with shoe trees or 
                    newspaper stuffing. Avoid wearing them in wet conditions as leather 
                    can stretch when wet.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Size Conversion */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>International Size Conversion</CardTitle>
            <CardDescription>
              Convert between different sizing systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-red-50">
                    <th className="border border-gray-300 p-3 text-left font-semibold">Indian Size</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">US Women</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">US Men</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">UK Size</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">EU Size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold">4</td>
                    <td className="border border-gray-300 p-3">6</td>
                    <td className="border border-gray-300 p-3">-</td>
                    <td className="border border-gray-300 p-3">3.5</td>
                    <td className="border border-gray-300 p-3">36</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold">5</td>
                    <td className="border border-gray-300 p-3">7</td>
                    <td className="border border-gray-300 p-3">-</td>
                    <td className="border border-gray-300 p-3">4.5</td>
                    <td className="border border-gray-300 p-3">37</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold">6</td>
                    <td className="border border-gray-300 p-3">8</td>
                    <td className="border border-gray-300 p-3">6</td>
                    <td className="border border-gray-300 p-3">5.5</td>
                    <td className="border border-gray-300 p-3">38</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold">7</td>
                    <td className="border border-gray-300 p-3">9</td>
                    <td className="border border-gray-300 p-3">7</td>
                    <td className="border border-gray-300 p-3">6.5</td>
                    <td className="border border-gray-300 p-3">39</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold">8</td>
                    <td className="border border-gray-300 p-3">10</td>
                    <td className="border border-gray-300 p-3">8</td>
                    <td className="border border-gray-300 p-3">7.5</td>
                    <td className="border border-gray-300 p-3">40</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold">9</td>
                    <td className="border border-gray-300 p-3">11</td>
                    <td className="border border-gray-300 p-3">9</td>
                    <td className="border border-gray-300 p-3">8.5</td>
                    <td className="border border-gray-300 p-3">41</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold">10</td>
                    <td className="border border-gray-300 p-3">12</td>
                    <td className="border border-gray-300 p-3">10</td>
                    <td className="border border-gray-300 p-3">9.5</td>
                    <td className="border border-gray-300 p-3">42</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Frequently Asked Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h4 className="font-semibold text-red-900 mb-2">Should I size up or down for jutti?</h4>
                <p className="text-gray-700 text-sm">
                  For traditional jutti, we recommend choosing your exact measured size or going half a size up 
                  if you're between sizes. The leather will soften and conform to your foot shape.
                </p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold text-red-900 mb-2">How do I know if my jutti fit properly?</h4>
                <p className="text-gray-700 text-sm">
                  Your jutti should feel snug but not tight. You should be able to wiggle your toes slightly, 
                  and your heel should sit comfortably without hanging over the back.
                </p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold text-red-900 mb-2">Can I exchange if the size doesn't fit?</h4>
                <p className="text-gray-700 text-sm">
                  Yes! We offer free size exchanges within Punjab and ₹99 shipping for other states. 
                  The exchange must be requested within 7 days of delivery.
                </p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold text-red-900 mb-2">Do jutti sizes run small or large?</h4>
                <p className="text-gray-700 text-sm">
                  Our jutti follow standard Indian sizing. If you usually wear western shoes, 
                  refer to our conversion chart or measure your feet for the most accurate fit.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-red-900 mb-2">How long does it take for jutti to break in?</h4>
                <p className="text-gray-700 text-sm">
                  Typically 3-5 days of regular wear. Start with shorter periods and gradually increase 
                  wearing time. The high-quality leather will soften and become more comfortable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact for Help */}
        <div className="text-center bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Still Need Help with Sizing?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our sizing experts are here to help you find the perfect fit for your jutti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-red-600 hover:bg-gray-100 px-6 py-2">
                Contact Size Expert
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-6 py-2">
              WhatsApp: +91 98765 43210
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}