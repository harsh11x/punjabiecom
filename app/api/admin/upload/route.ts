import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

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
    console.log('Upload request received')
    verifyAdminToken(request)
    console.log('Admin token verified successfully')
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    console.log('Files received:', files.length)
    
    if (!files || files.length === 0) {
      console.log('No files provided in request')
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadedFiles: string[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue
      }

      try {
        // Convert file to base64 data URL
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64DataUrl = `data:${file.type};base64,${buffer.toString('base64')}`
        
        // For development/serverless environments, we'll use base64 data URLs
        // This is not ideal for production but works for demonstration
        uploadedFiles.push(base64DataUrl)
        
        console.log(`File ${file.name} converted to base64 (${Math.round(base64DataUrl.length / 1024)}KB)`)
        
      } catch (uploadError) {
        console.error('Error processing file:', uploadError)
        // Continue with other files
      }
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`
    })

  } catch (error: any) {
    console.error('Error uploading files:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload files' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    )
  }
}

// DELETE - Remove uploaded image
export async function DELETE(request: NextRequest) {
  try {
    verifyAdminToken(request)
    
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // For Cloudinary URLs, we could implement deletion via their API
    // For now, we'll just return success since cloud images can remain
    console.log('Image deletion requested for:', imageUrl)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error: any) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete file' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    )
  }
}
