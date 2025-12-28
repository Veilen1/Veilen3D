"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/types/product"
import { useToast } from "@/hooks/use-toast"
import { ProductCarousel } from "@/components/product-carousel"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart()
  const { toast } = useToast()

  const itemInCart = items.find((item) => item._id === product._id)
  const quantityInCart = itemInCart ? itemInCart.quantity : 0

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: "¡Agregado al carrito!",
      description: `${product.name} se agregó correctamente`,
      duration: 2000,
    })
  }

  const productImages =
    product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : []

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative">
        <ProductCarousel images={productImages} productName={product.name} />
        <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground z-10">{product.category}</Badge>
        {quantityInCart > 0 && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground z-10 font-bold">
            {quantityInCart} en carrito
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-accent">${product.price.toLocaleString("es-AR")}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.compareAtPrice.toLocaleString("es-AR")}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full bg-primary hover:bg-primary/90">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  )
}
