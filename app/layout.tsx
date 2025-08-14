import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { CartProvider } from '@/contexts/CartContext'
import { FirebaseAuthProvider } from '@/contexts/FirebaseAuthContext'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/performance/navigation-progress'
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
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <NavigationProgress />
        <FirebaseAuthProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  )
}
