'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

export default function AdminStatusPage() {
  const [status, setStatus] = useState({
    database: { connected: false, error: '', loading: true },
    admin: { exists: false, count: 0, error: '', loading: true },
    server: { running: true, error: '' }
  })

  const [setupLoading, setSetupLoading] = useState(false)
  const [setupResult, setSetupResult] = useState('')

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    // Check admin setup status
    try {
      const response = await fetch('/api/admin/setup')
      if (response.ok) {
        const data = await response.json()
        setStatus(prev => ({
          ...prev,
          database: { connected: true, error: '', loading: false },
          admin: { 
            exists: data.data.adminExists, 
            count: data.data.adminCount, 
            error: '', 
            loading: false 
          }
        }))
      } else {
        const errorData = await response.json()
        if (response.status === 503) {
          setStatus(prev => ({
            ...prev,
            database: { connected: false, error: errorData.error, loading: false },
            admin: { exists: false, count: 0, error: 'Database unavailable', loading: false }
          }))
        } else {
          setStatus(prev => ({
            ...prev,
            admin: { exists: false, count: 0, error: errorData.error, loading: false }
          }))
        }
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        database: { connected: false, error: 'Failed to connect to API', loading: false },
        admin: { exists: false, count: 0, error: 'API unavailable', loading: false },
        server: { running: false, error: 'Server not responding' }
      }))
    }
  }

  const setupAdmin = async () => {
    setSetupLoading(true)
    setSetupResult('')

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setSetupResult(`✅ Success! Admin created with email: ${data.data.email} and password: ${data.data.password}`)
        checkStatus() // Refresh status
      } else {
        setSetupResult(`❌ Failed: ${data.error}`)
      }
    } catch (error) {
      setSetupResult(`❌ Error: ${error.message}`)
    }

    setSetupLoading(false)
  }

  const StatusIndicator = ({ connected, loading, error }: { connected: boolean, loading: boolean, error: string }) => {
    if (loading) return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
    if (connected) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-lg">
              <span className="text-white font-bold text-2xl drop-shadow-lg">ਪ</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-red-900 mb-2">Admin System Status</h1>
          <p className="text-amber-700">Punjab Heritage Admin Panel Diagnostics</p>
        </div>

        <div className="space-y-6">
          {/* System Status */}
          <Card className="border-2 border-amber-200">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>Current status of admin panel components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Server Status */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3">
                  <StatusIndicator connected={status.server.running} loading={false} error={status.server.error} />
                  <div>
                    <h3 className="font-semibold text-red-900">Server</h3>
                    <p className="text-sm text-gray-600">Application server status</p>
                  </div>
                </div>
                <Badge variant={status.server.running ? "default" : "destructive"}>
                  {status.server.running ? 'Running' : 'Offline'}
                </Badge>
              </div>

              {/* Database Status */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3">
                  <StatusIndicator 
                    connected={status.database.connected} 
                    loading={status.database.loading} 
                    error={status.database.error} 
                  />
                  <div>
                    <h3 className="font-semibold text-red-900">Database</h3>
                    <p className="text-sm text-gray-600">MongoDB connection status</p>
                    {status.database.error && (
                      <p className="text-sm text-red-600 mt-1">{status.database.error}</p>
                    )}
                  </div>
                </div>
                <Badge variant={status.database.connected ? "default" : "destructive"}>
                  {status.database.connected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>

              {/* Admin Users Status */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3">
                  <StatusIndicator 
                    connected={status.admin.exists} 
                    loading={status.admin.loading} 
                    error={status.admin.error} 
                  />
                  <div>
                    <h3 className="font-semibold text-red-900">Admin Users</h3>
                    <p className="text-sm text-gray-600">
                      {status.admin.loading ? 'Checking...' : `${status.admin.count} admin users found`}
                    </p>
                    {status.admin.error && (
                      <p className="text-sm text-red-600 mt-1">{status.admin.error}</p>
                    )}
                  </div>
                </div>
                <Badge variant={status.admin.exists ? "default" : "secondary"}>
                  {status.admin.exists ? 'Configured' : 'Not Set'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Admin Setup */}
          {!status.admin.exists && status.database.connected && (
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-blue-900">Admin Setup Required</CardTitle>
                <CardDescription>No admin users found. Create the initial admin account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-blue-800">
                      This will create an admin user with email: <strong>admin@punjabijuttiandfulkari.com</strong> and password: <strong>admin123</strong>
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    onClick={setupAdmin} 
                    disabled={setupLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {setupLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating Admin User...
                      </>
                    ) : (
                      'Create Admin User'
                    )}
                  </Button>
                  
                  {setupResult && (
                    <Alert className={setupResult.includes('Success') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                      <AlertDescription className={setupResult.includes('Success') ? 'text-green-800' : 'text-red-800'}>
                        {setupResult}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card className="border-2 border-amber-200">
            <CardHeader>
              <CardTitle className="text-red-900">Actions</CardTitle>
              <CardDescription>System management actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={checkStatus} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh Status
                </Button>
                
                {status.admin.exists && (
                  <Button 
                    onClick={() => window.location.href = '/admin'} 
                    className="bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700"
                  >
                    Go to Admin Panel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Database Connection Issues:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Check if MongoDB URI is correctly configured in environment variables</li>
                  <li>Verify MongoDB Atlas cluster is running and accessible</li>
                  <li>Ensure database credentials are correct</li>
                </ul>
                
                <p className="mt-4"><strong>Admin Access Issues:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Create admin user using the setup button above</li>
                  <li>Check JWT secret is configured in environment variables</li>
                  <li>Clear browser cookies and try again</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
