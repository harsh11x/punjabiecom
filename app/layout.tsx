import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import AutoSync from '@/components/AutoSync'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Punjabi Heritage Store',
  description: 'Authentic Punjabi traditional products including Juttis, Phulkari, and more',
  keywords: 'punjabi, heritage, juttis, phulkari, traditional, clothing, accessories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
        {/* Auto-sync component for real-time updates */}
        <AutoSync 
          interval={30000} 
          enabled={true} 
          showStatus={process.env.NODE_ENV === 'development'} 
        />
      </body>
    </html>
  )
}
