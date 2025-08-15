import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

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

// Initialize Firebase Analytics (only in browser and after hydration)
let analytics: any = null
export const getFirebaseAnalytics = () => {
  if (typeof window !== 'undefined' && !analytics) {
    // Only load analytics after the component has mounted to prevent hydration issues
    import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app)
        }
      }).catch((error) => {
        console.warn('Firebase Analytics not supported:', error)
      })
    }).catch((error) => {
      console.warn('Failed to load Firebase Analytics:', error)
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
