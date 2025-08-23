'use client'

import { useState, useEffect } from 'react'
import { ResponsiveProductCard } from '@/components/responsive-product-card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

interface Product {
  _id: string
  name: string
  punjabiName?: string
  price: number
  originalPrice: number
  images: string[]
  rating: number
  reviews: number
  colors: string[]
  sizes: string[]
  stock: number
  badge?: string
  category?: string
  subcategory?: string
}

export default function JuttiPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-center text-red-900">
        Jutti Collection Test
      </h1>
      <p className="text-center mt-4 text-gray-600">
        This is a minimal test page to verify the /jutti route is working.
      </p>
    </div>
  )
}
