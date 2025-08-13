import Link from "next/link"
import { ArrowLeft, FileText, Scale, ShoppingCart, Truck, RotateCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-red-700 hover:text-red-900 hover:bg-amber-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-red-900">
              ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ
            </h1>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-amber-800 mb-4">
            Terms & Conditions
          </h2>
          <p className="text-lg text-red-700 max-w-3xl mx-auto">
            ਸਾਡੀ ਵੈਬਸਾਈਟ ਅਤੇ ਸੇਵਾਵਾਂ ਦੀ ਵਰਤੋਂ ਲਈ ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ।
            <br />
            <span className="italic text-amber-700">
              Terms and conditions governing the use of our website and services.
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Last updated: January 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Agreement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="h-5 w-5" />
                <span>Agreement</span>
              </CardTitle>
              <CardDescription>
                ਇਸ ਸਮਝੌਤੇ ਨੂੰ ਸਵੀਕਾਰ ਕਰਨਾ • Accepting this agreement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                By accessing and using Punjab Heritage Store website and services, you accept 
                and agree to be bound by the terms and provision of this agreement. If you do 
                not agree to abide by the above, please do not use this service.
              </p>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-red-800 font-semibold">
                  ਇਸ ਵੈਬਸਾਈਟ ਦੀ ਵਰਤੋਂ ਕਰ ਕੇ ਤੁਸੀਂ ਇਨ੍ਹਾਂ ਨਿਯਮਾਂ ਨੂੰ ਮੰਨਦੇ ਹੋ।
                </p>
                <p className="text-amber-700 italic">
                  By using this website, you agree to these terms.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Use License */}
          <Card>
            <CardHeader>
              <CardTitle>Use License</CardTitle>
              <CardDescription>
                ਵਰਤੋਂ ਦਾ ਲਾਇਸੈਂਸ • Permission to use our services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Permission is granted to:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Browse and purchase products from our store</li>
                  <li>Create and manage your customer account</li>
                  <li>Use our website for personal, non-commercial purposes</li>
                  <li>Download and view product information</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-2">This license shall not allow you to:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Modify or copy our materials</li>
                  <li>Use materials for commercial purposes</li>
                  <li>Attempt to reverse engineer our software</li>
                  <li>Remove copyright or proprietary notations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Product Information</span>
              </CardTitle>
              <CardDescription>
                ਉਤਪਾਦ ਦੀ ਜਾਣਕਾਰੀ ਅਤੇ ਉਪਲਬਧਤਾ • Product details and availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>All product descriptions and images are as accurate as possible</li>
                <li>Colors may vary slightly due to monitor settings</li>
                <li>Handmade items may have natural variations</li>
                <li>Product availability is subject to change without notice</li>
                <li>We reserve the right to limit quantities</li>
              </ul>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800">
                  <strong>Note:</strong> Each handcrafted item is unique and may vary slightly 
                  from the displayed images, reflecting the authentic nature of traditional 
                  Punjabi craftsmanship.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing and Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing and Payment</CardTitle>
              <CardDescription>
                ਕੀਮਤ ਅਤੇ ਭੁਗਤਾਨ • Pricing and payment terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>All prices are displayed in Indian Rupees (INR)</li>
                <li>Prices include applicable taxes unless stated otherwise</li>
                <li>We reserve the right to change prices without notice</li>
                <li>Payment is required at the time of order placement</li>
                <li>We accept major credit cards, debit cards, and digital wallets</li>
                <li>All transactions are processed securely</li>
              </ul>
            </CardContent>
          </Card>

          {/* Shipping and Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Shipping and Delivery</span>
              </CardTitle>
              <CardDescription>
                ਸ਼ਿਪਿੰਗ ਅਤੇ ਡਿਲੀਵਰੀ • Shipping and delivery terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Free shipping on orders above ₹2,000</li>
                <li>Standard delivery: 5-7 business days</li>
                <li>Express delivery: 2-3 business days (additional charges apply)</li>
                <li>International shipping available to select countries</li>
                <li>Delivery times may vary during festivals or peak seasons</li>
                <li>Risk of loss passes to buyer upon delivery</li>
              </ul>
              <div className="mt-4">
                <Link href="/shipping" className="text-red-600 hover:text-red-800 underline">
                  View detailed shipping information →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Returns and Refunds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5" />
                <span>Returns and Refunds</span>
              </CardTitle>
              <CardDescription>
                ਵਾਪਸੀ ਅਤੇ ਰਿਫੰਡ • Return and refund policy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>30-day return policy for most items</li>
                <li>Items must be unused and in original condition</li>
                <li>Custom or personalized items cannot be returned</li>
                <li>Refunds processed within 5-7 business days</li>
                <li>Return shipping costs may apply</li>
                <li>Exchanges available for size/color variants</li>
              </ul>
              <div className="mt-4">
                <Link href="/returns" className="text-red-600 hover:text-red-800 underline">
                  View detailed return policy →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>
                ਉਪਭੋਗਤਾ ਖਾਤੇ • Customer account responsibilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>You are responsible for maintaining account security</li>
                <li>Provide accurate and complete information</li>
                <li>Notify us immediately of unauthorized account use</li>
                <li>You are responsible for all activities under your account</li>
                <li>We may suspend accounts for violations of these terms</li>
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Prohibited Uses</span>
              </CardTitle>
              <CardDescription>
                ਵਰਜਿਤ ਵਰਤੋਂ • Activities not allowed on our platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-red-900 mb-2">You may not use our service:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>For any unlawful purpose or to solicit unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations</li>
                  <li>To harass, abuse, insult, harm, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To transmit viruses or malicious code</li>
                  <li>To collect user information without permission</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
              <CardDescription>
                ਬੌਧਿਕ ਸੰਪਦਾ ਅਧਿਕਾਰ • Copyright and trademark information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>All content is owned by Punjab Heritage Store or licensors</li>
                <li>Product images, descriptions, and designs are protected</li>
                <li>Traditional patterns and designs respect cultural heritage</li>
                <li>Unauthorized use of our content is prohibited</li>
                <li>We respect the intellectual property rights of others</li>
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle>Disclaimer</CardTitle>
              <CardDescription>
                ਬੇਬਾਕੀ • Legal disclaimers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The information on this website is provided on an "as is" basis. To the fullest 
                extent permitted by law, Punjab Heritage Store excludes all representations, 
                warranties, conditions, and terms whether express, implied, statutory, or otherwise.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>We do not guarantee continuous, uninterrupted access to our website</li>
                <li>We are not liable for any technical difficulties or interruptions</li>
                <li>Product colors may vary from those displayed on your screen</li>
                <li>Handmade products may have natural variations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
              <CardDescription>
                ਜਿੰਮੇਵਾਰੀ ਦੀ ਸੀਮਾ • Limits on our liability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                In no event shall Punjab Heritage Store, nor its directors, employees, partners, 
                agents, suppliers, or affiliates, be liable for any indirect, incidental, punitive, 
                consequential, or special damages arising from your use of the service.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
              <CardDescription>
                ਸ਼ਾਸਨ ਕਰਨ ਵਾਲਾ ਕਾਨੂੰਨ • Legal jurisdiction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                These terms and conditions are governed by and construed in accordance with the 
                laws of India. Any disputes arising from these terms will be subject to the 
                exclusive jurisdiction of the courts in Amritsar, Punjab, India.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
              <CardDescription>
                ਨਿਯਮਾਂ ਵਿੱਚ ਬਦਲਾਅ • Updates to these terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We reserve the right to revise these terms and conditions at any time without notice. 
                By using this website, you are agreeing to be bound by the then-current version of 
                these terms and conditions.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-red-50 to-amber-50 border-2 border-amber-300">
            <CardHeader>
              <CardTitle className="text-red-900">Contact Information</CardTitle>
              <CardDescription>
                ਸੰਪਰਕ ਜਾਣਕਾਰੀ • Get in touch with us
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> legal@punjabheritage.com</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> Punjab Heritage Store, 123 Heritage Street, Amritsar, Punjab 143001, India</p>
              </div>
              <div className="mt-4">
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700">
                    Contact Us for Questions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
