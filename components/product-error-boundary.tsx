'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface ProductErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ProductErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ProductErrorBoundary extends React.Component<
  ProductErrorBoundaryProps,
  ProductErrorBoundaryState
> {
  constructor(props: ProductErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ProductErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Product component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-700">
              Unable to load product
            </p>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

// HOC wrapper for easier use
export function withProductErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WrappedComponent(props: P) {
    return (
      <ProductErrorBoundary>
        <Component {...props} />
      </ProductErrorBoundary>
    )
  }
}