export default function JuttiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-red-900 mb-6">
            <span className="block">ਪੰਜਾਬੀ ਜੁੱਤੀ</span>
            <span className="block text-3xl lg:text-5xl text-amber-800">Punjabi Jutti Collection</span>
          </h1>
          <p className="text-xl text-amber-800 max-w-3xl mx-auto leading-relaxed">
            Discover our exquisite collection of traditional Punjabi Jutti, handcrafted with love and heritage. 
            From men's classic designs to women's bridal elegance and kids' colorful styles.
          </p>
        </div>
        
        <div className="text-center py-16">
          <div className="text-amber-600 text-6xl mb-4">👟</div>
          <h3 className="text-2xl font-semibold text-amber-800 mb-2">Jutti Collection</h3>
          <p className="text-amber-700 mb-6">Our beautiful collection of traditional Punjabi Jutti</p>
          <a 
            href="/products"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors inline-block"
          >
            View All Products
          </a>
        </div>
      </div>
    </div>
  )
}
