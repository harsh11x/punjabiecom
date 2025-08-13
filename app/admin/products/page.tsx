'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  AlertCircle,
  Loader2,
  RefreshCw,
  IndianRupee
} from 'lucide-react'
import { useSocket } from '@/hooks/useSocket'
import Image from 'next/image'

interface Product {
  _id: string
  name: string
  punjabiName: string
  description: string
  punjabiDescription: string
  price: number
  originalPrice: number
  category: string
  subcategory?: string
  stock: number
  isActive: boolean
  images: string[]
  colors: string[]
  sizes: string[]
  rating: number
  reviews: number
  badge?: string
  badgeEn?: string
  createdAt: string
}

interface ProductStats {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  totalStock: number
  lowStockProducts: number
}

interface ProductFormData {
  name: string
  punjabiName: string
  description: string
  punjabiDescription: string
  price: number
  originalPrice: number
  category: string
  subcategory: string
  images: string[]
  colors: string[]
  sizes: string[]
  stock: number
  badge: string
  badgeEn: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState<ProductStats | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    punjabiName: '',
    description: '',
    punjabiDescription: '',
    price: 0,
    originalPrice: 0,
    category: 'men',
    subcategory: '',
    images: [''],
    colors: [''],
    sizes: [''],
    stock: 0,
    badge: '',
    badgeEn: ''
  })

  const socket = useSocket()

  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [])

  useEffect(() => {
    if (socket) {
      // Join admin room for real-time notifications
      socket.emit('join-admin')

      // Listen for real-time updates
      socket.on('product-update', (data) => {
        toast.success(`Product updated: ${data.product.name}`)
        fetchProducts()
        fetchStats()
      })

      socket.on('product-added', (data) => {
        toast.success(`New product added: ${data.product.name}`)
        fetchProducts()
        fetchStats()
      })

      socket.on('product-deleted', (data) => {
        toast.success(`Product deleted: ${data.product.name}`)
        fetchProducts()
        fetchStats()
      })

      return () => {
        socket.off('product-update')
        socket.off('product-added')
        socket.off('product-deleted')
      }
    }
  }, [socket])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/products')
      const result = await response.json()
      
      if (result.success) {
        setProducts(result.data)
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/products/stats')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchProducts(), fetchStats()])
    setRefreshing(false)
    toast.success('Products refreshed')
  }

  const handleAddProduct = async (productData: ProductFormData) => {
    try {
      setFormLoading(true)
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('Product added successfully')
        setIsAddModalOpen(false)
        resetForm()
        fetchProducts()
        fetchStats()
        
        // Emit real-time update
        if (socket) {
          socket.emit('product-added', { product: result.data })
        }
      } else {
        toast.error(result.error || 'Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditProduct = async (productData: ProductFormData) => {
    if (!editingProduct) return
    
    try {
      setFormLoading(true)
      const response = await fetch(`/api/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('Product updated successfully')
        setIsEditModalOpen(false)
        setEditingProduct(null)
        resetForm()
        fetchProducts()
        fetchStats()
        
        // Emit real-time update
        if (socket) {
          socket.emit('product-update', { product: result.data })
        }
      } else {
        toast.error(result.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('Product deleted successfully')
        fetchProducts()
        fetchStats()
        
        // Emit real-time update
        if (socket) {
          socket.emit('product-deleted', { product: result.data })
        }
      } else {
        toast.error(result.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      punjabiName: product.punjabiName,
      description: product.description,
      punjabiDescription: product.punjabiDescription,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      subcategory: product.subcategory || '',
      images: product.images,
      colors: product.colors,
      sizes: product.sizes,
      stock: product.stock,
      badge: product.badge || '',
      badgeEn: product.badgeEn || ''
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      punjabiName: '',
      description: '',
      punjabiDescription: '',
      price: 0,
      originalPrice: 0,
      category: 'men',
      subcategory: '',
      images: [''],
      colors: [''],
      sizes: [''],
      stock: 0,
      badge: '',
      badgeEn: ''
    })
  }

  const addArrayField = (field: keyof Pick<ProductFormData, 'images' | 'colors' | 'sizes'>) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const updateArrayField = (field: keyof Pick<ProductFormData, 'images' | 'colors' | 'sizes'>, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const removeArrayField = (field: keyof Pick<ProductFormData, 'images' | 'colors' | 'sizes'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.punjabiName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-48 bg-gray-200 rounded"></div>
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory - Real-time updates enabled</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleAddProduct}
                loading={formLoading}
                addArrayField={addArrayField}
                updateArrayField={updateArrayField}
                removeArrayField={removeArrayField}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Real-time Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Products</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeProducts}</p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive Products</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.inactiveProducts}</p>
                </div>
                <Eye className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Stock</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalStock}</p>
                </div>
                <Package className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.lowStockProducts}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="men">Men's Jutti</SelectItem>
                <SelectItem value="women">Women's Jutti</SelectItem>
                <SelectItem value="kids">Kids' Jutti</SelectItem>
                <SelectItem value="phulkari">Phulkari</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product._id} className="overflow-hidden">
            <div className="relative">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.punjabiName}</p>
                  <p className="text-lg font-bold text-red-600">₹{product.price.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Stock: {product.stock}</span>
                  <span className="capitalize">{product.category}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(product)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteProduct(product._id)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditProduct}
            loading={formLoading}
            addArrayField={addArrayField}
            updateArrayField={updateArrayField}
            removeArrayField={removeArrayField}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Product Form Component
function ProductForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  addArrayField,
  updateArrayField,
  removeArrayField,
  isEdit = false
}: {
  formData: any
  setFormData: any
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  addArrayField: (field: 'images' | 'colors' | 'sizes') => void
  updateArrayField: (field: 'images' | 'colors' | 'sizes', index: number, value: string) => void
  removeArrayField: (field: 'images' | 'colors' | 'sizes', index: number) => void
  isEdit?: boolean
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name (English)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="punjabiName">Product Name (Punjabi)</Label>
          <Input
            id="punjabiName"
            value={formData.punjabiName}
            onChange={(e) => setFormData(prev => ({ ...prev, punjabiName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description (English)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="punjabiDescription">Description (Punjabi)</Label>
          <Textarea
            id="punjabiDescription"
            value={formData.punjabiDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, punjabiDescription: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Original Price (₹)</Label>
          <Input
            id="originalPrice"
            type="number"
            value={formData.originalPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="kids">Kids</SelectItem>
              <SelectItem value="phulkari">Phulkari</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory (Optional)</Label>
          <Input
            id="subcategory"
            value={formData.subcategory}
            onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
          />
          <Label htmlFor="isActive">Product Active</Label>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>Product Images (URLs)</Label>
        {formData.images.map((image, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              value={image}
              onChange={(e) => updateArrayField('images', index, e.target.value)}
              placeholder="Image URL"
              required={index === 0}
            />
            {formData.images.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayField('images', index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayField('images')}
        >
          Add Image
        </Button>
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <Label>Available Colors</Label>
        {formData.colors.map((color, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              value={color}
              onChange={(e) => updateArrayField('colors', index, e.target.value)}
              placeholder="Color name"
              required={index === 0}
            />
            {formData.colors.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayField('colors', index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayField('colors')}
        >
          Add Color
        </Button>
      </div>

      {/* Sizes */}
      <div className="space-y-2">
        <Label>Available Sizes</Label>
        {formData.sizes.map((size, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              value={size}
              onChange={(e) => updateArrayField('sizes', index, e.target.value)}
              placeholder="Size (e.g., S, M, L, XL or 6, 7, 8, 9)"
              required={index === 0}
            />
            {formData.sizes.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayField('sizes', index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayField('sizes')}
        >
          Add Size
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="badge">Badge (Punjabi)</Label>
          <Input
            id="badge"
            value={formData.badge}
            onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
            placeholder="e.g., ਨਵਾਂ, ਵਿਸ਼ੇਸ਼"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="badgeEn">Badge (English)</Label>
          <Input
            id="badgeEn"
            value={formData.badgeEn}
            onChange={(e) => setFormData(prev => ({ ...prev, badgeEn: e.target.value }))}
            placeholder="e.g., New, Special"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  )
}