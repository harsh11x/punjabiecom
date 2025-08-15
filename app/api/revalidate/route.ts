import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    const tag = searchParams.get('tag')
    const secret = searchParams.get('secret')
    
    // Simple secret validation (you can make this more secure)
    if (secret !== process.env.REVALIDATE_SECRET && secret !== 'punjabi-heritage-revalidate') {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }
    
    if (path) {
      revalidatePath(path)
      return NextResponse.json({ 
        revalidated: true, 
        path,
        timestamp: new Date().toISOString()
      })
    }
    
    if (tag) {
      revalidateTag(tag)
      return NextResponse.json({ 
        revalidated: true, 
        tag,
        timestamp: new Date().toISOString()
      })
    }
    
    // Revalidate common paths
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/men')
    revalidatePath('/women')
    revalidatePath('/kids')
    revalidatePath('/fulkari')
    
    return NextResponse.json({ 
      revalidated: true, 
      message: 'All product pages revalidated',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error revalidating:', error)
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}