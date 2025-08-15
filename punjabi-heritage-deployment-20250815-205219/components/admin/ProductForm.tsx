'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import ImageUpload from '@/components/admin/ImageUpload'
import SizeSelector from '@/components/admin/SizeSelector'
import AuthStatus from '@/components/admin/AuthStatus'

interface Product {
  id?: string;
  name: string;
  punjabiName: string;
  description: string;
  punjabiDescription: string;
  price: number;
  originalPrice: number;
  category: 'men' | 'women' | 'kids' | 'fulkari' | 'jutti';
  productType: 'jutti' | 'fulkari';
  stock: number;
  isActive: boolean;
  images: string[];
  sizes: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ProductFormProps {
  initialData?: Product;
  onSave?: (product: Product) => void;
  onCancel?: () => void;
  isDialog?: boolean;
}

const defaultProduct: Product = {
  name: '',
  punjabiName: '',
  description: '',
  punjabiDescription: '',
  price: 0,
  originalPrice: 0,
  category: 'men',
  productType: 'jutti',
  stock: 0,
  isActive: true,
  images: [],
  sizes: []
}

export default function ProductForm({ 
  initialData, 
  onSave, 
  onCancel, 
  isDialog = false 
}: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Product>(initialData || defaultProduct)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSizesChange = (sizes: string[]) => {
    setFormData(prev => ({ ...prev, sizes }))
  }

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in required fields: name, price, and category are required')
      return
    }

    if (!formData.sizes || formData.sizes.length === 0) {
      toast.error('Please select at least one size')
      return
    }

    console.log('Saving product with data:', formData)
    setIsSaving(true)
    try {
      const url = '/api/admin/products'
      const method = initialData?.id ? 'PUT' : 'POST'
      
      const payload = initialData?.id 
        ? { ...formData, _id: initialData.id }
        : formData

      console.log('Sending request:', { method, url, payload })

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Response data:', data)
        
        if (data.success) {
          toast.success(initialData?.id ? 'Product updated successfully' : 'Product created successfully')
          
          if (onSave) {
            onSave(formData)
          } else if (!isDialog) {
            // Redirect to products page if not in dialog mode
            router.push('/admin/products')
          }
        } else {
          console.error('Save failed:', data)
          toast.error(data.error || 'Failed to save product')
        }
      } else {
        const errorText = await response.text()
        console.error('HTTP Error:', response.status, errorText)
        
        if (response.status === 401) {
          toast.error('Authentication required. Please login to admin panel.')
        } else {
          try {
            const errorData = JSON.parse(errorText)
            toast.error(errorData.error || `Failed to save product (Status: ${response.status})`)
          } catch {
            toast.error(`Failed to save product (Status: ${response.status})`)
          }
        }
      }
    } catch (error) {
      console.error('Network error saving product:', error)
      toast.error('Network error: Failed to save product')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else if (!isDialog) {
      router.push('/admin/products')
    }
  }

  return (
    <div className="space-y-6">
      {!isDialog && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Products</span>
            </Button>
            <h1 className="text-2xl font-bold text-red-900">
              {initialData?.id ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>
        </div>
      )}
      
      {/* Authentication Status */}
      <AuthStatus />

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Traditional Punjabi Jutti"
              required
            />
          </div>
          <div>
            <Label htmlFor="punjabiName">Punjabi Name</Label>
            <Input
              id="punjabiName"
              name="punjabiName"
              value={formData.punjabiName}
              onChange={handleInputChange}
              placeholder="ਪੰਜਾਬੀ ਜੁੱਤੀ"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Detailed product description..."
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="punjabiDescription">Punjabi Description</Label>
          <Textarea
            id="punjabiDescription"
            name="punjabiDescription"
            value={formData.punjabiDescription}
            onChange={handleInputChange}
            placeholder="ਪੰਜਾਬੀ ਵਿੱਚ ਵਰਣਨ..."
            rows={2}
          />
        </div>
      </div>

      {/* Product Classification */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Classification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="productType">Product Type *</Label>
            <Select value={formData.productType} onValueChange={(value) => handleSelectChange('productType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jutti">Jutti</SelectItem>
                <SelectItem value="fulkari">Fulkari</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">For Whom *</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Selling Price (₹) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="1500"
              required
            />
          </div>
          <div>
            <Label htmlFor="originalPrice">Original Price (₹)</Label>
            <Input
              id="originalPrice"
              name="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={handleInputChange}
              placeholder="2000"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty if no discount</p>
          </div>
          <div>
            <Label htmlFor="stock">Stock Quantity *</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="25"
              required
            />
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Images</h3>
        <ImageUpload
          images={formData.images}
          onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
          maxImages={5}
        />
      </div>

      {/* Product Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Variants</h3>
        <SizeSelector
          selectedSizes={formData.sizes}
          onSizesChange={handleSizesChange}
          required={true}
        />
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Status</h3>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="rounded"
          />
          <Label htmlFor="isActive">Product is active and visible to customers</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {initialData?.id ? 'Update' : 'Create'} Product
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
