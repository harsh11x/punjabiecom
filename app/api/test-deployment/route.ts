import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Deployment successful!',
    timestamp: new Date().toISOString(),
    version: '2.0.0-updated'
  })
}
