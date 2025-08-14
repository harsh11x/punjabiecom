import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

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
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const uploadedFiles: string[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = path.extname(file.name)
      const filename = `${timestamp}-${randomString}${extension}`
      const filepath = path.join(uploadsDir, filename)

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      fs.writeFileSync(filepath, buffer)
      
      // Store the public URL
      uploadedFiles.push(`/uploads/products/${filename}`)
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`
    })

  } catch (error: any) {
    console.error('Error uploading files:', error)
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
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Filename is required' },
        { status: 400 }
      )
    }

    const filepath = path.join(process.cwd(), 'public', filename)
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
    }

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
