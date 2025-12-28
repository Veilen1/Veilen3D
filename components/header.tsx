"use client"

import { ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { CartSheet } from "@/components/cart-sheet"
import Link from "next/link"

export function Header() {
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl hidden sm:inline-block">Veilen</span>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">3D</span>
            </div>
            
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#productos" className="text-sm font-medium hover:text-accent transition-colors">
              Productos
            </Link>
            <Link href="#categorias" className="text-sm font-medium hover:text-accent transition-colors">
              Categorías
            </Link>
            <Link href="#contacto" className="text-sm font-medium hover:text-accent transition-colors">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <CartSheet>
              <Button variant="outline" size="icon" className="relative bg-transparent">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </CartSheet>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="#productos" className="text-lg font-medium hover:text-accent transition-colors">
                    Productos
                  </Link>
                  <Link href="#categorias" className="text-lg font-medium hover:text-accent transition-colors">
                    Categorías
                  </Link>
                  <Link href="#contacto" className="text-lg font-medium hover:text-accent transition-colors">
                    Contacto
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
