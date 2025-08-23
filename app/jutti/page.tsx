import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function JuttiPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      <Header />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 py-16 lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-red-900 mb-6">
            <span className="block">ਪੰਜਾਬੀ ਜੁੱਤੀ</span>
            <span className="block text-3xl lg:text-5xl text-amber-800">Punjabi Jutti Collection</span>
          </h1>
          <p className="text-xl text-amber-800 max-w-3xl mx-auto leading-relaxed">
            Discover our exquisite collection of traditional Punjabi Jutti, handcrafted with love and heritage. 
            From men's classic designs to women's bridal elegance and kids' colorful styles.
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-red-900 mb-4">
            Our Jutti Collection
          </h2>
          <p className="text-lg text-amber-800">
            Beautiful jutti designs to choose from
          </p>
        </div>

        <div className="text-center py-16">
          <div className="text-amber-600 text-6xl mb-4">👟</div>
          <h3 className="text-2xl font-semibold text-amber-800 mb-2">Jutti Collection Coming Soon</h3>
          <p className="text-amber-700 mb-6">We're currently updating our collection. Please check back soon!</p>
          
          {/* Simple Product Display */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-amber-800 mb-4">Sample Jutti Products:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-md">
                <div className="w-full h-32 bg-amber-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-4xl">👞</span>
                </div>
                <h5 className="font-bold text-lg text-red-900">Traditional Punjabi Jutti</h5>
                <p className="text-amber-700 text-sm">Men's Classic Design</p>
                <p className="text-red-600 font-bold mt-2">₹1,299</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-md">
                <div className="w-full h-32 bg-amber-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-4xl">👠</span>
                </div>
                <h5 className="font-bold text-lg text-red-900">Women's Bridal Jutti</h5>
                <p className="text-amber-700 text-sm">Elegant Bridal Design</p>
                <p className="text-red-600 font-bold mt-2">₹1,899</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-md">
                <div className="w-full h-32 bg-amber-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-4xl">👟</span>
                </div>
                <h5 className="font-bold text-lg text-red-900">Kids Colorful Jutti</h5>
                <p className="text-amber-700 text-sm">Colorful & Comfortable</p>
                <p className="text-red-600 font-bold mt-2">₹799</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
