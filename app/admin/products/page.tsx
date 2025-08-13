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

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<ProductStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const socket = useSocket({
    onProductUpdate: () => {
      fetchProducts()
      toast.success('Product updated in real-time!')
    }
  })

  const [formData, setFormData] = useState({
    name: '',
    punjabiName: '',
    description: '',
    punjabiDescription: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    stock: '',
    images: [''],
    colors: [''],
    sizes: [''],
    badge: '',
    badgeEn: '',
    isActive: true
  })

  useEffect(() => {
    fetchProducts()
  }, [currentPage, selectedCategory, selectedStatus, searchTerm])

  useEffect(() => {
    if (socket) {
      socket.on('product-update', (data) => {
        fetchProducts() // Refresh products on real-time updates
        toast.success('Product inventory updated')
      })

      return () => {
        socket.off('product-update')
      }
    }
  }, [socket])

  const fetchProducts = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedStatus !== 'all' && { status: selectedStatus })
      })

      const response = await fetch(`/api/admin/products?${params}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data || [])
        setStats(data.stats)
        setTotalPages(data.pagination?.pages || 1)
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error fetching products')
    } finally {
      setLoading(false)
      if (showRefreshing) setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchProducts(true)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim()),
        colors: formData.colors.filter(color => color.trim()),
        sizes: formData.sizes.filter(size => size.trim())
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Product added successfully')
        setIsAddModalOpen(false)
        resetForm()
        fetchProducts()
        
        // Emit real-time update
        if (socket) {
          socket.emit('inventory-update', {
            productId: data.data._id,
            stock: data.data.stock,
            isActive: data.data.isActive
          })
        }
      } else {
        toast.error(data.error || 'Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Error adding product')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    
    setFormLoading(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim()),
        colors: formData.colors.filter(color => color.trim()),
        sizes: formData.sizes.filter(size => size.trim())
      }

      const response = await fetch(`/api/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Product updated successfully')
        setIsEditModalOpen(false)
        setEditingProduct(null)
        resetForm()
        fetchProducts()
        
        // Emit real-time update
        if (socket) {
          socket.emit('inventory-update', {
            productId: data.data._id,
            stock: data.data.stock,
            isActive: data.data.isActive
          })
        }
      } else {
        toast.error(data.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Error updating product')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error deleting product')
    }
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      punjabiName: product.punjabiName,
      description: product.description,
      punjabiDescription: product.punjabiDescription,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      category: product.category,
      subcategory: product.subcategory || '',
      stock: product.stock.toString(),
      images: product.images.length > 0 ? product.images : [''],
      colors: product.colors.length > 0 ? product.colors : [''],
      sizes: product.sizes.length > 0 ? product.sizes : [''],
      badge: product.badge || '',
      badgeEn: product.badgeEn || '',
      isActive: product.isActive
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      punjabiName: '',
      description: '',
      punjabiDescription: '',
      price: '',
      originalPrice: '',
      category: '',
      subcategory: '',
      stock: '',
      images: [''],
      colors: [''],
      sizes: [''],
      badge: '',
      badgeEn: '',
      isActive: true
    })
  }

  const addArrayField = (field: 'images' | 'colors' | 'sizes') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const updateArrayField = (field: 'images' | 'colors' | 'sizes', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const removeArrayField = (field: 'images' | 'colors' | 'sizes', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const categories = ['all', 'men', 'women', 'kids', 'phulkari']
  const statusOptions = ['all', 'active', 'inactive']

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {product.stock <= 5 && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="destructive" className="flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Low Stock</span>
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{product.punjabiName}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg text-gray-900">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => openEditModal(product)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 text-center mb-4">
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first product"
              }
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Product Modal */}
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