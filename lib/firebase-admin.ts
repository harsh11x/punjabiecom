import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    // Check if we have service account credentials
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      initializeApp({
        credential: cert(serviceAccount)
      })
    } else {
      // Fallback to default credentials (for development)
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk@your-project.iam.gserviceaccount.com',
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || 'your-private-key'
        })
      })
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
    // Initialize with minimal config for development
    initializeApp({
      projectId: 'punjabi-ecom-store'
    })
  }
}

export const auth = getAuth()
