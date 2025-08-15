import mongoose from 'mongoose'

declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }

  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string
      JWT_SECRET: string
      RAZORPAY_KEY_ID: string
      RAZORPAY_KEY_SECRET: string
      NEXT_PUBLIC_RAZORPAY_KEY_ID: string
      EMAIL_HOST: string
      EMAIL_PORT: string
      EMAIL_USER: string
      EMAIL_PASS: string
      NEXTAUTH_URL: string
      NEXTAUTH_SECRET: string
      APP_NAME: string
      APP_URL: string
    }
  }

  interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description: string
    order_id: string
    prefill: {
      name: string
      email: string
      contact: string
    }
    theme: {
      color: string
    }
    handler: (response: RazorpayResponse) => void
    modal?: {
      ondismiss?: () => void
    }
    image?: string
    notes?: {
      address: string
    }
  }

  interface RazorpayResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
  }

  interface RazorpayInstance {
    open(): void
    close(): void
    on(event: string, callback: (response: any) => void): void
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export {}