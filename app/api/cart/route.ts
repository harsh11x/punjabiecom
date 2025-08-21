import { NextRequest, NextResponse } from 'next/server'

const AWS_BACKEND_URL = 'http://3.111.208.77:3001'

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email')
    
    if (!userEmail) {
      return NextResponse.json({ error: 'User email required' }, { status: 400 })
    }
    
    console.log(`🔄 Forwarding cart request to AWS backend: ${AWS_BACKEND_URL}/api/cart`)
    
    // Forward the request to AWS backend with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(`${AWS_BACKEND_URL}/api/cart`, {
      headers: {
        'x-user-email': userEmail
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.error(`❌ AWS backend returned error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `AWS backend error: ${response.status}` },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log(`✅ Successfully forwarded cart request to AWS backend`)
    return NextResponse.json(data, { status: response.status })
    
  } catch (error: any) {
    console.error('❌ Error forwarding to AWS backend:', error)
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout - AWS backend not responding' },
        { status: 504 }
      )
    }
    
    return NextResponse.json(
      { error: `Failed to fetch cart: ${error.message}` },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log(`🔄 Forwarding cart POST request to AWS backend`)
    
    // Forward the request to AWS backend with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(`${AWS_BACKEND_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.error(`❌ AWS backend returned error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `AWS backend error: ${response.status}` },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log(`✅ Successfully forwarded cart POST request to AWS backend`)
    return NextResponse.json(data, { status: response.status })
    
  } catch (error: any) {
    console.error('❌ Error forwarding to AWS backend:', error)
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout - AWS backend not responding' },
        { status: 504 }
      )
    }
    
    return NextResponse.json(
      { error: `Failed to update cart: ${error.message}` },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log(`🔄 Forwarding cart PUT request to AWS backend`)
    
    // Forward the request to AWS backend with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(`${AWS_BACKEND_URL}/api/cart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.error(`❌ AWS backend returned error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `AWS backend error: ${response.status}` },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log(`✅ Successfully forwarded cart PUT request to AWS backend`)
    return NextResponse.json(data, { status: response.status })
    
  } catch (error: any) {
    console.error('❌ Error forwarding to AWS backend:', error)
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout - AWS backend not responding' },
        { status: 504 }
      )
    }
    
    return NextResponse.json(
      { error: `Failed to update cart: ${error.message}` },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log(`🔄 Forwarding cart DELETE request to AWS backend`)
    
    // Forward the request to AWS backend with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(`${AWS_BACKEND_URL}/api/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.error(`❌ AWS backend returned error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `AWS backend error: ${response.status}` },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log(`✅ Successfully forwarded cart DELETE request to AWS backend`)
    return NextResponse.json(data, { status: response.status })
    
  } catch (error: any) {
    console.error('❌ Error forwarding to AWS backend:', error)
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout - AWS backend not responding' },
        { status: 504 }
      )
    }
    
    return NextResponse.json(
      { error: `Failed to remove cart item: ${error.message}` },
      { status: 500 }
    )
  }
}
