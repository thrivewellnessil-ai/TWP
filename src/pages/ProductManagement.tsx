import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Product, ProductInsert, ProductUpdate } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Trash2, Edit, Plus, Upload, Image as ImageIcon } from 'lucide-react'

const ProductManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const queryClient = useQueryClient()

  // Form state
  const [formData, setFormData] = useState<ProductInsert>({
    name: '',
    description: '',
    category: 'Accessories',
    status: 'In Store',
    sku: '',
    price: 0,
    buy_link: '',
    image_url: '',
    group_name: '',
    color: '',
    hex_color: '',
    specifications: {}
  })

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Product[]
    }
  })

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
      
      if (error) throw error
      return data?.[0] || null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product created successfully!')
      resetForm()
      setIsCreateModalOpen(false)
    },
    onError: (error) => {
      toast.error(`Error creating product: ${error.message}`)
    }
  })

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...product }: ProductUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
      
      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('Update failed: 0 rows updated (check RLS policies and that the product id exists).')
      }
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product updated successfully!')
      setEditingProduct(null)
      setIsEditModalOpen(false)
    },
    onError: (error) => {
      toast.error(`Error updating product: ${error.message}`)
    }
  })

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted successfully!')
    },
    onError: (error) => {
      toast.error(`Error deleting product: ${error.message}`)
    }
  })

  // Handle image upload
  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `product-images/${fileName}`

      console.log('Uploading file to:', filePath)
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      console.log('Public URL:', publicUrl)
      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image: ' + (error as Error).message)
      return null
    }
  }

  // Form handlers
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Accessories',
      status: 'In Store',
      sku: '',
      price: 0,
      buy_link: '',
      image_url: '',
      group_name: '',
      color: '',
      hex_color: '',
      specifications: {}
    })
    setImageFile(null)
    setImagePreview('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let imageUrl = formData.image_url
    
    if (imageFile) {
      const uploadedUrl = await handleImageUpload(imageFile)
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      }
    }

    const productData = { 
      ...formData, 
      image_url: imageUrl,
      specifications: formData.specifications || {}
    }

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, ...productData })
    } else {
      createProductMutation.mutate(productData)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      status: product.status || 'In Store',
      sku: product.sku,
      price: product.price,
      buy_link: product.buy_link || '',
      image_url: product.image_url || '',
      group_name: product.group_name || '',
      color: product.color || '',
      hex_color: product.hex_color || '',
      specifications: product.specifications || {}
    })
    setImagePreview(product.image_url || '')
    setIsEditModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Filter products
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error loading products</h2>
          <p className="text-red-600">{(error as Error).message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Wellness">Wellness</SelectItem>
                      <SelectItem value="Water Bottles">Water Bottles</SelectItem>
                      <SelectItem value="Bundles">Bundles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Store">In Store</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Removal Requested">Removal Requested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="group_name">Group Name</Label>
                  <Input
                    id="group_name"
                    value={formData.group_name}
                    onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color/Variant</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hex_color">Hex Color</Label>
                  <Input
                    id="hex_color"
                    value={formData.hex_color}
                    onChange={(e) => setFormData({ ...formData, hex_color: e.target.value })}
                    placeholder="#000000"
                  />
                </div>
                <div>
                  <Label htmlFor="buy_link">Buy Link</Label>
                  <Input
                    id="buy_link"
                    value={formData.buy_link}
                    onChange={(e) => setFormData({ ...formData, buy_link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {imagePreview && (
                    <div className="w-16 h-16 border rounded overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications Editor */}
              <div>
                <Label>Specifications</Label>
                <div className="space-y-2 mt-2">
                  {formData.specifications && Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <Input
                        placeholder="Specification name (e.g., capacity, material)"
                        value={key}
                        onChange={(e) => {
                          const newSpecs = { ...formData.specifications }
                          delete newSpecs[key]
                          newSpecs[e.target.value] = value
                          setFormData({ ...formData, specifications: newSpecs })
                        }}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value (e.g., 40 oz, Stainless Steel)"
                        value={Array.isArray(value) ? value.join(', ') : String(value)}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            specifications: { ...formData.specifications, [key]: e.target.value }
                          })
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSpecs = { ...formData.specifications }
                          delete newSpecs[key]
                          setFormData({ ...formData, specifications: newSpecs })
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          ['']: ''
                        }
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Specification
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createProductMutation.isPending}>
                  {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <Badge 
                  className={`absolute top-2 right-2 ${
                    product.status === 'In Store' ? 'bg-green-500' :
                    product.status === 'Out of Stock' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}
                >
                  {product.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                {product.color && (
                  <div className="flex items-center gap-2 mb-3">
                    {product.hex_color && (
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: product.hex_color }}
                      />
                    )}
                    <span className="text-sm text-gray-600">{product.color}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-sku">SKU</Label>
                  <Input
                    id="edit-sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Wellness">Wellness</SelectItem>
                      <SelectItem value="Water Bottles">Water Bottles</SelectItem>
                      <SelectItem value="Bundles">Bundles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Store">In Store</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Removal Requested">Removal Requested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-group_name">Group Name</Label>
                  <Input
                    id="edit-group_name"
                    value={formData.group_name}
                    onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-color">Color/Variant</Label>
                  <Input
                    id="edit-color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-hex_color">Hex Color</Label>
                  <Input
                    id="edit-hex_color"
                    value={formData.hex_color}
                    onChange={(e) => setFormData({ ...formData, hex_color: e.target.value })}
                    placeholder="#000000"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-buy_link">Buy Link</Label>
                  <Input
                    id="edit-buy_link"
                    value={formData.buy_link}
                    onChange={(e) => setFormData({ ...formData, buy_link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-image">Product Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {imagePreview && (
                    <div className="w-16 h-16 border rounded overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications Editor */}
              <div>
                <Label>Specifications</Label>
                <div className="space-y-2 mt-2">
                  {formData.specifications && Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <Input
                        placeholder="Specification name (e.g., capacity, material)"
                        value={key}
                        onChange={(e) => {
                          const newSpecs = { ...formData.specifications }
                          delete newSpecs[key]
                          newSpecs[e.target.value] = value
                          setFormData({ ...formData, specifications: newSpecs })
                        }}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value (e.g., 40 oz, Stainless Steel)"
                        value={Array.isArray(value) ? value.join(', ') : String(value)}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            specifications: { ...formData.specifications, [key]: e.target.value }
                          })
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSpecs = { ...formData.specifications }
                          delete newSpecs[key]
                          setFormData({ ...formData, specifications: newSpecs })
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          ['']: ''
                        }
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Specification
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateProductMutation.isPending}>
                  {updateProductMutation.isPending ? 'Updating...' : 'Update Product'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductManagement
