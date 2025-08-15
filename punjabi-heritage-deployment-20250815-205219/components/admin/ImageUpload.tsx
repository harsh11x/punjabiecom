'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    const newImages: string[] = []

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          toast.error('Please select only image files')
          continue
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error('Image size should be less than 5MB')
          continue
        }

        // Upload to server
        const formData = new FormData()
        formData.append('files', file)
        
        try {
          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData
          })
          
          if (response.ok) {
            const result = await response.json()
            if (result.success && result.files.length > 0) {
              newImages.push(result.files[0])
            } else {
              console.error('Upload failed:', result)
              toast.error(result.error || `Failed to upload ${file.name}`)
            }
          } else {
            const errorData = await response.text()
            console.error('Upload response error:', response.status, errorData)
            
            if (response.status === 401) {
              toast.error('Authentication required. Please login to admin panel.')
            } else {
              try {
                const errorJson = JSON.parse(errorData)
                toast.error(errorJson.error || `Failed to upload ${file.name}`)
              } catch {
                toast.error(`Failed to upload ${file.name} (Status: ${response.status})`)
              }
            }
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError)
          toast.error(`Network error uploading ${file.name}`)
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages])
        toast.success(`${newImages.length} image(s) uploaded successfully`)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    onImagesChange(updatedImages)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const input = fileInputRef.current
      if (input) {
        input.files = files
        handleFileSelect({ target: input } as React.ChangeEvent<HTMLInputElement>)
      }
    }
  }

  return (
    <div className="space-y-4">
      <Label>Product Images (Max {maxImages})</Label>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${
          uploading ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || images.length >= maxImages}
              className="mb-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Choose Images'}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Or drag and drop images here
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, WebP up to 5MB each
          </p>
        </div>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="space-y-2">
          <Label>Uploaded Images ({images.length}/{maxImages})</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                {index === 0 && (
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                    Main
                  </div>
                )}
              </Card>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            The first image will be used as the main product image
          </p>
        </div>
      )}
    </div>
  )
}
