import type { Metadata } from 'next'
import { CartProvider } from '@/contexts/CartContext'
import { FirebaseAuthProvider } from '@/contexts/FirebaseAuthContext'
import { Toaster } from '@/components/ui/sonner'
import ErrorBoundary from '@/components/error-boundary'
import './globals.css'

export const metadata: Metadata = {
  title: 'Punjab Heritage - Authentic Punjabi Crafts',
  description: 'Discover the finest collection of traditional handmade leather jutti and exquisite phulkari, crafted by master artisans preserving centuries-old Punjabi heritage.',
  keywords: 'punjabi jutti, phulkari, traditional crafts, handmade, punjab heritage',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <FirebaseAuthProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </FirebaseAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
