import { NextRequest, NextResponse } from 'next/server'

const AWS_BACKEND_URL = 'http://3.111.208.77:3001'

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email')
    
    if (!userEmail) {
      return NextResponse.json({ error: 'User email required' }, { status: 400 })
    }
    
    // Forward the request to AWS backend
    const response = await fetch(`${AWS_BACKEND_URL}/api/cart`, {
      headers: {
        'x-user-email': userEmail
      }
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error forwarding to AWS backend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to AWS backend
    const response = await fetch(`${AWS_BACKEND_URL}/api/cart`, {
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
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to AWS backend
    const response = await fetch(`${AWS_BACKEND_URL}/api/cart`, {
      method: 'PUT',
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
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to AWS backend
    const response = await fetch(`${AWS_BACKEND_URL}/api/cart`, {
      method: 'DELETE',
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
      { error: 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}
