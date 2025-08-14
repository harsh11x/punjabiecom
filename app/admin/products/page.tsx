'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Package,
  Save,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import ImageUpload from '@/components/admin/ImageUpload'

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

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Product>(defaultProduct)
  const [isSaving, setIsSaving] = useState(false)

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'men', label: 'Men\'s Jutti' },
    { value: 'women', label: 'Women\'s Jutti' },
    { value: 'kids', label: 'Kids\' Jutti' },
    { value: 'phulkari', label: 'Phulkari' },
    { value: 'accessories', label: 'Accessories' }
  ]

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/products', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProducts(data.products)
        } else {
          toast.error('Failed to load products')
        }
      } else {
        toast.error('Failed to load products')
      }
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }

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

  const openCreateDialog = () => {
    setEditingProduct(null)
    setFormData(defaultProduct)
    setShowDialog(true)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      ...product,
      sizes: product.sizes || [],
      images: product.images || []
    })
    setShowDialog(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in required fields')
      return
    }

    setIsSaving(true)
    try {
      const url = editingProduct ? '/api/admin/products' : '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const payload = editingProduct 
        ? { ...formData, _id: editingProduct.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully')
          setShowDialog(false)
          loadProducts() // Reload products
        } else {
          toast.error(data.error || 'Failed to save product')
        }
      } else {
        toast.error('Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Failed to save product')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success('Product deleted successfully')
          loadProducts()
        } else {
          toast.error(data.error || 'Failed to delete product')
        }
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.punjabiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mb-4"></div>
          <p className="text-red-900 font-semibold">Loading Products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-red-900 mb-2">Products Management</h1>
            <p className="text-amber-700">Manage your store's product catalog</p>
          </div>
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-red-900">
              <Package className="h-5 w-5 mr-2" />
              Products ({filteredProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-100 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-red-900">{product.name}</h3>
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-amber-700 mt-1">{product.punjabiName}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>₹{product.price}</span>
                        <span>Stock: {product.stock}</span>
                        <span className="capitalize">{product.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(product.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
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
                  onClick={() => setShowDialog(false)}
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
                      {editingProduct ? 'Update' : 'Create'} Product
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
