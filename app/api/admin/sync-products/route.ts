import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { forceSyncProducts } from '@/lib/product-sync'
import { revalidatePath } from 'next/cache'

// Auth middleware
function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  if (!token) {
    throw new Error('No token provided')
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'punjab-admin-secret-key')
  return decoded
}

export async function POST(request: NextRequest) {
  try {
    verifyAdminToken(request)
    
    console.log('🔄 Admin initiated product sync...')
    
    const syncResult = await forceSyncProducts()
    
    // Revalidate all product pages after sync
    try {
      revalidatePath('/')
      revalidatePath('/products')
      revalidatePath('/men')
      revalidatePath('/women')
      revalidatePath('/kids')
      revalidatePath('/fulkari')
      revalidatePath('/jutti')
      console.log('🔄 All product pages revalidated')
    } catch (revalidateError) {
      console.warn('⚠️ Failed to revalidate paths:', revalidateError)
    }
    
    console.log('✅ Product sync completed:', syncResult)
    
    return NextResponse.json({
      success: true,
      message: 'Products synchronized successfully',
      data: syncResult
    })
    
  } catch (error: any) {
    console.error('❌ Error syncing products:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync products' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    )
  }
}
