'use client'

import { useState } from 'react'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

export default function DebugAuthPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testGoogleAuth = async () => {
    console.log('Starting Google Auth test...')
    setLoading(true)
    setResult('Testing Google Auth...')
    
    try {
      console.log('About to call signInWithPopup')
      const result = await signInWithPopup(auth, googleProvider)
      console.log('signInWithPopup completed:', result)
      setResult(`Success! Logged in as: ${result.user.email}`)
    } catch (error: any) {
      console.error('Google Auth error:', error)
      setResult(`Error: ${error.code} - ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testFirebaseConfig = () => {
    console.log('Firebase auth object:', auth)
    console.log('Google provider:', googleProvider)
    console.log('Firebase config:', {
      apiKey: auth.app.options.apiKey,
      authDomain: auth.app.options.authDomain,
      projectId: auth.app.options.projectId
    })
    setResult('Check console for Firebase configuration details')
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Firebase Auth Debug</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testFirebaseConfig}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Firebase Config
        </button>
        
        <button 
          onClick={testGoogleAuth}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Google Auth'}
        </button>
        
        <div className="p-4 border rounded bg-gray-50">
          <pre>{result}</pre>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Open browser console (F12) to see detailed logs</p>
          <p>Current domain: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}
