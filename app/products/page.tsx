import { getAllProducts } from '@/lib/product-manager'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ProductsPage() {
  const products = await getAllProducts()

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🏪</div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Punjabi Heritage Store</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our collection is being curated with authentic Punjabi traditional products. 
            New products will be added soon through our admin panel.
          </p>
          <div className="space-y-4">
            <p className="text-lg font-medium">Coming Soon:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">👡</div>
                <h3 className="font-semibold">Traditional Juttis</h3>
                <p className="text-sm text-gray-600">Handcrafted Punjabi footwear</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">🧵</div>
                <h3 className="font-semibold">Phulkari Work</h3>
                <p className="text-sm text-gray-600">Embroidered dupattas & suits</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">👗</div>
                <h3 className="font-semibold">Traditional Wear</h3>
                <p className="text-sm text-gray-600">Authentic Punjabi clothing</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/">
              <Button size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Our Products</h1>
        <p className="text-gray-600">
          Discover authentic Punjabi heritage products, handcrafted with love and tradition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
