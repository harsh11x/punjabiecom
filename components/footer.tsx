import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-red-900 via-red-800 to-amber-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fillOpacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative">
        {/* Top decorative border */}
        <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
        
        {/* Main footer content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">ਪ</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-100">ਪੰਜਾਬ ਹੈਰਿਟੇਜ</h3>
                  <p className="text-amber-200 text-sm">Punjab Heritage</p>
                </div>
              </div>
              <p className="text-amber-100 mb-4 leading-relaxed">
                ਪੰਜਾਬ ਦੀ ਅਮੀਰ ਸੱਭਿਆਚਾਰਕ ਵਿਰਾਸਤ ਨੂੰ ਸੰਭਾਲਣ ਅਤੇ ਸਾਝਾ ਕਰਨਾ।
              </p>
              <p className="text-amber-200 italic text-sm">
                Preserving and sharing the rich cultural heritage of Punjab through authentic handcrafted products.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-amber-100 mb-4 flex items-center">
                <span className="mr-2">ਤੇਜ਼ ਲਿੰਕ</span>
                <span className="text-amber-300">• Quick Links</span>
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-amber-100 hover:text-amber-300 transition-colors flex items-center">
                    <span className="mr-2">ਘਰ</span>
                    <span>• Home</span>
                  </Link>
                </li>
                <li>
                  <Link href="/jutti" className="text-amber-100 hover:text-amber-300 transition-colors flex items-center">
                    <span className="mr-2">ਜੁੱਤੀ ਸੰਗ੍ਰਹਿ</span>
                    <span>• Jutti Collection</span>
                  </Link>
                </li>
                <li>
                  <Link href="/fulkari" className="text-amber-100 hover:text-amber-300 transition-colors flex items-center">
                    <span className="mr-2">ਫੁਲਕਾਰੀ ਸੰਗ੍ਰਹਿ</span>
                    <span>• Fulkari Collection</span>
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-amber-100 hover:text-amber-300 transition-colors flex items-center">
                    <span className="mr-2">ਸਾਡੇ ਬਾਰੇ</span>
                    <span>• About Us</span>
                  </Link>
                </li>
                <li>
                  <Link href="/our-story" className="text-amber-100 hover:text-amber-300 transition-colors flex items-center">
                    <span className="mr-2">ਸਾਡੀ ਕਹਾਣੀ</span>
                    <span>• Our Story</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-lg font-bold text-amber-100 mb-4 flex items-center">
                <span className="mr-2">ਗਾਹਕ ਸੇਵਾ</span>
                <span className="text-amber-300">• Customer Care</span>
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-amber-100 hover:text-amber-300 transition-colors flex items-center">
                    <span className="mr-2">ਸੰਪਰਕ</span>
                    <span>• Contact Us</span>
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-amber-100 hover:text-amber-300 transition-colors flex items-center">
                    <span className="mr-2">ਸਿੱਪਿੰਗ ਜਾਣਕਾਰੀ</span>
                    <span>• Shipping Info</span>
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-amber-100 hover:text-amber-300 transition-colors flex items-center">
                    <span className="mr-2">ਵਾਪਸੀ</span>
                    <span>• Returns</span>
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="text-amber-100 hover:text-amber-300 transition-colors flex items-center">
                    <span className="mr-2">ਸਾਈਜ਼ ਗਾਈਡ</span>
                    <span>• Size Guide</span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-amber-100 hover:text-amber-300 transition-colors flex items-center">
                    <span className="mr-2">ਪ੍ਰਾਈਵੇਸੀ ਨੀਤੀ</span>
                    <span>• Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-amber-100 hover:text-amber-300 transition-colors flex items-center">
                    <span className="mr-2">ਨਿਯਮ ਤੇ ਸ਼ਰਤਾਂ</span>
                    <span>• Terms & Conditions</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect With Us */}
            <div>
              <h4 className="text-lg font-bold text-amber-100 mb-4 flex items-center">
                <span className="mr-2">ਸਾਡੇ ਨਾਲ ਜੁੜੋ</span>
                <span className="text-amber-300">• Connect With Us</span>
              </h4>
              <p className="text-amber-100 mb-4 text-sm">
                ਨਵੇਂ ਸੰਗਰਹਿ ਅਤੇ ਸੱਭਿਆਚਾਰਕ ਕਹਾਣੀਆਂ ਲਈ ਸਾਡਾ ਪਿੱਛਾ ਕਰੋ।
              </p>
              <p className="text-amber-200 italic text-sm mb-6">
                Follow us for the latest collections and cultural stories.
              </p>
              
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-purple-700 transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-6">
                <p className="text-amber-100 text-sm mb-2">ਸਾਡੇ ਨਿਊਜ਼ਲੈਟਰ ਲਈ ਸਾਈਨ ਅੱਪ ਕਰੋ</p>
                <p className="text-amber-200 text-xs mb-3 italic">Subscribe to our newsletter</p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email address"
                    className="flex-1 px-3 py-2 rounded-l-md text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-r-md text-red-900 font-semibold text-sm transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
        
        {/* Copyright */}
        <div className="bg-red-950 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm">
              <div className="text-amber-100 mb-2 md:mb-0">
                © 2024 <span className="font-semibold">ਪੰਜਾਬ ਹੈਰਿਟੇਜ • Punjab Heritage</span>. 
                <span className="ml-1">ਸਾਰੇ ਅਧਿਕਾਰ ਸੁਰੱਖਿਤ • All rights reserved.</span>
              </div>
              <div className="text-amber-200 flex items-center">
                <span className="mr-1">ਪੰਜਾਬੀ ਸੱਭਿਆਚਾਰ ਨੂੰ ਸੰਭਾਲਣ ਲਈ</span>
                <Heart className="w-4 h-4 text-red-400 mx-1" fill="currentColor" />
                <span className="ml-1">ਨਾਲ ਬਣਾਇਆ ਗਿਆ • Made with</span>
                <Heart className="w-4 h-4 text-red-400 mx-1" fill="currentColor" />
                <span>for preserving Punjabi culture.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
