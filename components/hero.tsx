"use client"
import type { Product } from "@/types/product"

interface HeroProps {
  products: Product[]
}

export function Hero({ products }: HeroProps) {
  // Removed client-side carousel and products prop to fix hydration errors
  return (
    <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Impresiones 3D de Alta Calidad
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl">
            Descubre nuestra colección de miniaturas, accesorios para TCG, fichas para juegos de rol y decoraciones
            únicas. Cada pieza impresa con precisión y detalle.
          </p>
          <a href="#productos">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Ver Productos
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}
