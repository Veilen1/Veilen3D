"use client"

import { ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { CartSheet } from "@/components/cart-sheet"
import { UserMenu } from "@/components/user-menu"
import Link from "next/link"

export function Header() {
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-base sm:text-lg">3D</span>
            </div>
            <span className="font-bold text-lg sm:text-xl">Veilen</span>
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

          <div className="flex items-center gap-1.5 sm:gap-2">
            <CartSheet>
              <Button variant="outline" size="icon" className="relative bg-transparent h-8 w-8 sm:h-9 sm:w-9">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </CartSheet>

            <UserMenu />

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
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
