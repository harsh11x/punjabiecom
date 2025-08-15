'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Package } from 'lucide-react'
import { toast } from 'sonner'
import ImageUpload from '@/components/admin/ImageUpload'

interface ProductFormData {
  name: string;
  punjabiName: string;
  description: string;
  punjabiDescription: string;
  price: number;
  originalPrice: number;
  category: 'men' | 'women' | 'kids';
  productType: 'jutti' | 'fulkari';
  stock: number;
  isActive: boolean;
  images: string[];
  sizes: string[];
}

const defaultProduct: ProductFormData = {
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

export default function AddProductPage() {
  const [formData, setFormData] = useState<ProductFormData>(defaultProduct)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

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

  const handleArrayChange = (name: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean)
    setFormData(prev => ({ ...prev, [name]: items }))
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.name.trim()) errors.push('Product name is required')
    if (!formData.description.trim()) errors.push('Description is required')
    if (!formData.price || formData.price <= 0) errors.push('Valid price is required')
    if (!formData.stock || formData.stock < 0) errors.push('Valid stock quantity is required')
    if (!formData.category) errors.push('Category selection is required')
    if (!formData.productType) errors.push('Product type selection is required')
    if (!formData.sizes || formData.sizes.length === 0) errors.push('At least one size is required')
    if (!formData.images || formData.images.length === 0) errors.push('At least one product image is required')
    
    return errors
  }

  const handleSave = async () => {
    const errors = validateForm()
    if (errors.length > 0) {
      toast.error(`Please fix the following errors:\n${errors.join('\n')}`)
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success('Product created successfully!')
          router.push('/admin/products')
        } else {
          toast.error(data.error || 'Failed to create product')
        }
      } else {
        toast.error('Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to create product')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setFormData(defaultProduct)
    toast.info('Form reset')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-red-900 flex items-center">
                <Package className="h-8 w-8 mr-3" />
                Add New Product
              </h1>
              <p className="text-amber-700">Create a new product for your store</p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
          {/* Basic Information */}
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-900">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  rows={4}
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
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Classification */}
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-900">Product Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Pricing & Stock */}
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-900">Pricing & Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Selling Price (₹) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
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
                    min="0"
                    step="0.01"
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
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="25"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-900">Product Images *</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={formData.images}
                onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                maxImages={5}
              />
            </CardContent>
          </Card>

          {/* Product Variants */}
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-900">Product Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="sizes">Available Sizes *</Label>
                <Input
                  id="sizes"
                  name="sizes"
                  value={formData.sizes.join(', ')}
                  onChange={(e) => handleArrayChange('sizes', e.target.value)}
                  placeholder="UK 6, UK 7, UK 8, UK 9, UK 10"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter sizes separated by commas</p>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-900">Product Status</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
            >
              Reset Form
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/products')}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
