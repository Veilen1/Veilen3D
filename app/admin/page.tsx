"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Shield, ShieldOff, Users, Package, Plus, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  createdAt: string
}

interface Product {
  _id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  category: string
  images?: string[]
  stock: number
  featured?: boolean
  createdAt: string
}

const CATEGORIES = [
  { value: "tcg", label: "TCG" },
  { value: "rpg", label: "RPG" },
  { value: "miniaturas", label: "Miniaturas" },
  { value: "adornos", label: "Adornos" },
  { value: "otros", label: "Otros" },
]

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Estados para modales
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Formulario usuario
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", isAdmin: false })
  const [savingUser, setSavingUser] = useState(false)

  // Formulario producto
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: "otros",
    images: "",
    stock: "",
    featured: false,
  })
  const [savingProduct, setSavingProduct] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (!authLoading && user && !user.isAdmin) {
      router.push("/")
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos de administrador",
        variant: "destructive",
      })
    }
  }, [user, authLoading, router, toast])

  useEffect(() => {
    if (user?.isAdmin) {
      fetchUsers()
      fetchProducts()
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products")
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Error cargando productos:", error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // ===== USUARIOS =====
  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    setUpdatingUser(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: !currentStatus }),
      })

      if (res.ok) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, isAdmin: !currentStatus } : u)))
        toast({
          title: "Usuario actualizado",
          description: `El rol de administrador fue ${!currentStatus ? "otorgado" : "revocado"}`,
        })
      } else {
        const data = await res.json()
        toast({ title: "Error", description: data.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Error de conexión", variant: "destructive" })
    } finally {
      setUpdatingUser(null)
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== userId))
        toast({ title: "Usuario eliminado" })
      } else {
        const data = await res.json()
        toast({ title: "Error", description: data.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Error de conexión", variant: "destructive" })
    }
  }

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({ title: "Error", description: "Completa todos los campos", variant: "destructive" })
      return
    }

    setSavingUser(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })

      const data = await res.json()

      if (res.ok) {
        setUsers([data.user, ...users])
        setNewUser({ name: "", email: "", password: "", isAdmin: false })
        setUserDialogOpen(false)
        toast({ title: "Usuario creado" })
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Error de conexión", variant: "destructive" })
    } finally {
      setSavingUser(false)
    }
  }

  // ===== PRODUCTOS =====
  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setProductForm({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        compareAtPrice: product.compareAtPrice?.toString() || "",
        category: product.category,
        images: product.images?.join(", ") || "",
        stock: product.stock.toString(),
        featured: product.featured || false,
      })
    } else {
      setEditingProduct(null)
      setProductForm({
        name: "",
        description: "",
        price: "",
        compareAtPrice: "",
        category: "otros",
        images: "",
        stock: "",
        featured: false,
      })
    }
    setProductDialogOpen(true)
  }

  const saveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast({ title: "Error", description: "Nombre, precio y categoría son requeridos", variant: "destructive" })
      return
    }

    setSavingProduct(true)

    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      compareAtPrice: productForm.compareAtPrice ? parseFloat(productForm.compareAtPrice) : undefined,
      category: productForm.category,
      images: productForm.images.split(",").map((s) => s.trim()).filter(Boolean),
      stock: parseInt(productForm.stock) || 0,
      featured: productForm.featured,
    }

    try {
      let res
      if (editingProduct) {
        res = await fetch(`/api/admin/products/${editingProduct._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        })
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        })
      }

      const data = await res.json()

      if (res.ok) {
        if (editingProduct) {
          setProducts(products.map((p) => (p._id === editingProduct._id ? { ...p, ...productData } : p)))
          toast({ title: "Producto actualizado" })
        } else {
          setProducts([data.product, ...products])
          toast({ title: "Producto creado" })
        }
        setProductDialogOpen(false)
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Error de conexión", variant: "destructive" })
    } finally {
      setSavingProduct(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" })
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== productId))
        toast({ title: "Producto eliminado" })
      } else {
        const data = await res.json()
        toast({ title: "Error", description: data.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Error de conexión", variant: "destructive" })
    }
  }

  if (authLoading || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Panel de Administración</CardTitle>
            <CardDescription>Gestiona usuarios y productos</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Usuarios ({users.length})
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Productos ({products.length})
                </TabsTrigger>
              </TabsList>

              {/* ===== TAB USUARIOS ===== */}
              <TabsContent value="users" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Usuarios registrados</h3>
                  <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Usuario
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Crear Usuario</DialogTitle>
                        <DialogDescription>Añade un nuevo usuario al sistema</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="user-name">Nombre</Label>
                          <Input
                            id="user-name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            placeholder="Nombre completo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-email">Email</Label>
                          <Input
                            id="user-email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            placeholder="correo@ejemplo.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-password">Contraseña</Label>
                          <Input
                            id="user-password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            placeholder="Mínimo 6 caracteres"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="user-admin"
                            checked={newUser.isAdmin}
                            onCheckedChange={(checked) => setNewUser({ ...newUser, isAdmin: checked })}
                          />
                          <Label htmlFor="user-admin">Administrador</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={createUser} disabled={savingUser}>
                          {savingUser ? "Creando..." : "Crear Usuario"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {isLoadingUsers ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            {u.isAdmin ? (
                              <Badge className="bg-amber-500">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <ShieldOff className="h-3 w-3 mr-1" />
                                Usuario
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={u.isAdmin}
                              disabled={updatingUser === u._id || u._id === user.id}
                              onCheckedChange={() => toggleAdmin(u._id, u.isAdmin)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  disabled={u._id === user.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción eliminará permanentemente a <strong>{u.name}</strong>.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={() => deleteUser(u._id)}
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              {/* ===== TAB PRODUCTOS ===== */}
              <TabsContent value="products" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Catálogo de productos</h3>
                  <Button size="sm" onClick={() => openProductDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </div>

                {/* Dialog crear/editar producto */}
                <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? "Editar Producto" : "Crear Producto"}</DialogTitle>
                      <DialogDescription>
                        {editingProduct ? "Modifica los datos del producto" : "Añade un nuevo producto al catálogo"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="prod-name">Nombre *</Label>
                        <Input
                          id="prod-name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="Nombre del producto"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prod-category">Categoría *</Label>
                        <Select
                          value={productForm.category}
                          onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prod-price">Precio *</Label>
                        <Input
                          id="prod-price"
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prod-compare">Precio anterior (opcional)</Label>
                        <Input
                          id="prod-compare"
                          type="number"
                          step="0.01"
                          value={productForm.compareAtPrice}
                          onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prod-stock">Stock</Label>
                        <Input
                          id="prod-stock"
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          id="prod-featured"
                          checked={productForm.featured}
                          onCheckedChange={(checked) => setProductForm({ ...productForm, featured: checked })}
                        />
                        <Label htmlFor="prod-featured">Producto destacado</Label>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="prod-images">URLs de imágenes (separadas por coma)</Label>
                        <Input
                          id="prod-images"
                          value={productForm.images}
                          onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                          placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="prod-desc">Descripción</Label>
                        <Textarea
                          id="prod-desc"
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          placeholder="Descripción del producto"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={saveProduct} disabled={savingProduct}>
                        {savingProduct ? "Guardando..." : editingProduct ? "Guardar Cambios" : "Crear Producto"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {isLoadingProducts ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Destacado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((p) => (
                        <TableRow key={p._id}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {CATEGORIES.find((c) => c.value === p.category)?.label || p.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${p.price.toFixed(2)}
                            {p.compareAtPrice && (
                              <span className="text-muted-foreground line-through ml-2">
                                ${p.compareAtPrice.toFixed(2)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{p.stock}</TableCell>
                          <TableCell>
                            {p.featured && <Badge className="bg-amber-500">Destacado</Badge>}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => openProductDialog(p)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción eliminará permanentemente <strong>{p.name}</strong>.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={() => deleteProduct(p._id)}
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
