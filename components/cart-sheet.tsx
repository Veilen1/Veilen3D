"use client"

import type React from "react"
import { useMemo } from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, MessageCircle } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"

interface CartSheetProps {
  children: React.ReactNode
}

export function CartSheet({ children }: CartSheetProps) {
  const { items, removeItem, updateQuantity, total } = useCart()

  const whatsappUrl = useMemo(() => {
    if (items.length === 0) return "#"

    // MODIFICACIÓN AQUÍ:
    const message = `¡Hola! Me gustaría hacer un pedido:\n\n${items
      .map((item) => {
        const precioUnitario = item.price.toLocaleString("es-AR")
        const subtotal = (item.price * item.quantity).toLocaleString("es-AR")
        // Formato: • Nombre: Cantidad x Precio Unitario = Subtotal
        return `• ${item.name}: ${item.quantity} x $${precioUnitario} = $${subtotal}`
      })
      .join("\n")}\n\n*Total: $${total.toLocaleString("es-AR")}*`

    return `https://wa.me/5492216387312?text=${encodeURIComponent(message)}`
  }, [items, total])

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <p className="text-muted-foreground">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.image || `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                    <p className="text-sm font-semibold text-accent">${item.price.toLocaleString("es-AR")}</p>

                    <div className="flex items-center gap-2 mt-auto">
                      <div className="flex items-center gap-1 border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                        onClick={() => removeItem(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator />
            <SheetFooter className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-accent">${total.toLocaleString("es-AR")}</span>
              </div>
              
              <Button
                asChild
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                size="lg"
              >
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Finalizar por WhatsApp
                </a>
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Te redirigiremos a WhatsApp para confirmar tu pedido
              </p>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}