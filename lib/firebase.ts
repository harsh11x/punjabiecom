import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyA96W2Y6321lit2B2HuPOPIdY-MS9dytl4",
  authDomain: "punjabiecom-dc8ea.firebaseapp.com",
  projectId: "punjabiecom-dc8ea",
  storageBucket: "punjabiecom-dc8ea.firebasestorage.app",
  messagingSenderId: "248407809084",
  appId: "1:248407809084:web:769700a9c267ac2a5e3739",
  measurementId: "G-VNY53M2Q6L"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Analytics (lazy loaded)
let analytics: any = null
const getFirebaseAnalytics = () => {
  if (typeof window !== 'undefined' && !analytics) {
    // Lazy load analytics to prevent blocking initial page load
    import('firebase/analytics').then(({ getAnalytics }) => {
      analytics = getAnalytics(app)
    })
  }
  return analytics
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export default app
