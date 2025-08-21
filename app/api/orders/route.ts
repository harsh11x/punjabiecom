import { NextRequest, NextResponse } from 'next/server'

const AWS_BACKEND_URL = 'http://3.111.208.77:3001'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to AWS backend
    const response = await fetch(`${AWS_BACKEND_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error forwarding to AWS backend:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Forward the request to AWS backend
    const response = await fetch(`${AWS_BACKEND_URL}/api/orders`)
    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error forwarding to AWS backend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
