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
}

export {}