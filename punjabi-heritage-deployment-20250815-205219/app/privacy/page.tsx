import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, User, Database, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
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
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-red-900">
              ਨਿਜਤਾ ਨੀਤੀ
            </h1>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-amber-800 mb-4">
            Privacy Policy
          </h2>
          <p className="text-lg text-red-700 max-w-3xl mx-auto">
            ਸਾਡੀ ਕੰਪਨੀ ਤੁਹਾਡੀ ਨਿਜਤਾ ਅਤੇ ਡਾਟਾ ਸੁਰੱਖਿਆ ਨੂੰ ਬਹੁਤ ਮਹੱਤਵ ਦਿੰਦੀ ਹੈ।
            <br />
            <span className="italic text-amber-700">
              We are committed to protecting your privacy and personal information.
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Last updated: January 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Information We Collect</span>
              </CardTitle>
              <CardDescription>
                ਅਸੀਂ ਕਿਹੜੀ ਜਾਣਕਾਰੀ ਇਕੱਠੀ ਕਰਦੇ ਹਾਂ • What information we gather
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (securely processed)</li>
                  <li>Order history and preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Website usage patterns and preferences</li>
                  <li>Cookie and tracking data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>How We Use Your Information</span>
              </CardTitle>
              <CardDescription>
                ਅਸੀਂ ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਦਾ ਕਿਵੇਂ ਉਪਯੋਗ ਕਰਦੇ ਹਾਂ • How we use your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Process and fulfill your orders</li>
                <li>Communicate about your purchases and account</li>
                <li>Provide customer support and assistance</li>
                <li>Send promotional emails (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal requirements</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Information Sharing</span>
              </CardTitle>
              <CardDescription>
                ਅਸੀਂ ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਕਦੇ ਸਾਂਝੀ ਕਰਦੇ ਹਾਂ • When we share your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-red-900 mb-2">We may share information with:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Payment processors for transaction handling</li>
                  <li>Shipping partners for order delivery</li>
                  <li>Service providers who help us operate our business</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-red-800 font-semibold">
                  We never sell your personal information to third parties.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Data Security</span>
              </CardTitle>
              <CardDescription>
                ਅਸੀਂ ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਨੂੰ ਕਿਵੇਂ ਸੁਰੱਖਿਤ ਰੱਖਦੇ ਹਾਂ • How we protect your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>SSL encryption for all data transmission</li>
                <li>Secure servers and databases</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and employee training</li>
                <li>PCI DSS compliance for payment processing</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Your Rights</span>
              </CardTitle>
              <CardDescription>
                ਤੁਹਾਡੇ ਅਧਿਕਾਰ ਅਤੇ ਵਿਕਲਪ • Your rights and choices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request data portability</li>
                <li>File complaints with supervisory authorities</li>
              </ul>
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-red-800">
                  To exercise your rights, contact us at{" "}
                  <a href="mailto:privacy@punjabheritage.com" className="underline">
                    privacy@punjabheritage.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
              <CardDescription>
                ਕੂਕੀਜ਼ ਅਤੇ ਟਰੈਕਿੰਗ ਬਾਰੇ • About cookies and tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We use cookies and similar technologies to enhance your browsing experience, 
                analyze website traffic, and personalize content. You can control cookie 
                settings through your browser preferences.
              </p>
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Types of Cookies:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Essential cookies for website functionality</li>
                  <li>Analytics cookies for usage statistics</li>
                  <li>Marketing cookies for personalized ads</li>
                  <li>Preference cookies for customized experience</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
              <CardDescription>
                ਅੰਤਰਰਾਸ਼ਟਰੀ ਡਾਟਾ ਸਥਾਨਾਂਤਰਣ • Cross-border data transfers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than 
                your country of residence. We ensure appropriate safeguards are in place to 
                protect your data during such transfers.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
              <CardDescription>
                ਬੱਚਿਆਂ ਦੀ ਨਿਜਤਾ ਦੀ ਸੁਰੱਖਿਆ • Protecting children's privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Our services are not directed to children under 13. We do not knowingly 
                collect personal information from children under 13. If you believe we have 
                collected such information, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Updates to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
              <CardDescription>
                ਨੀਤੀ ਅਪਡੇਟ • Changes to this policy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We may update this privacy policy from time to time. We will notify you of 
                significant changes by email or through a prominent notice on our website. 
                Your continued use of our services after such changes constitutes acceptance 
                of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-red-50 to-amber-50 border-2 border-amber-300">
            <CardHeader>
              <CardTitle className="text-red-900">Contact Us</CardTitle>
              <CardDescription>
                ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ • Get in touch with us
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                If you have any questions about this privacy policy or our data practices, 
                please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> privacy@punjabheritage.com</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> Punjab Heritage Store, 123 Heritage Street, Amritsar, Punjab 143001, India</p>
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
