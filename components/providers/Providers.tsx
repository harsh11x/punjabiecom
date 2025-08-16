'use client'

import { FirebaseAuthProvider } from './FirebaseAuthProvider'
import { CartProvider } from './CartProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseAuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </FirebaseAuthProvider>
  )
}
