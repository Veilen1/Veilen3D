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
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="relative">
        <ProductCarousel images={productImages} productName={product.name} />
        <Badge className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-secondary text-secondary-foreground z-10 text-xs">{product.category}</Badge>
        {quantityInCart > 0 && (
          <Badge className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-accent text-accent-foreground z-10 font-bold text-xs">
            {quantityInCart} en carrito
          </Badge>
        )}
      </div>

      <CardContent className="p-2.5 sm:p-4 flex-1">
        <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3 hidden sm:block">{product.description}</p>
        <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
          <span className="text-lg sm:text-2xl font-bold text-accent">${product.price.toLocaleString("es-AR")}</span>
          {product.compareAtPrice && (
            <span className="text-xs sm:text-sm text-muted-foreground line-through">
              ${product.compareAtPrice.toLocaleString("es-AR")}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-2.5 sm:p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10">
          <ShoppingCart className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Agregar al</span> Carrito
        </Button>
      </CardFooter>
    </Card>
  )
}
