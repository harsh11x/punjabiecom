import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-orange-600 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Return Home
            </Button>
          </Link>
          <div className="mt-4">
            <Link href="/products" className="text-orange-600 hover:text-orange-700 underline">
              Browse Our Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
