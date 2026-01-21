"use client"
import type { Product } from "@/types/product"
import { InfiniteCarousel } from "@/components/infinite-carousel" // <-- Importamos de nuevo

interface HeroProps {
  products: Product[] // <-- Volvemos a aceptar productos
}

export function Hero({ products }: HeroProps) {
  return (
    <section className="w-full relative overflow-hidden pb-8 sm:pb-12">
       {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 -z-10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
         {/* Orbes de luz decorativos */}
        <div className="absolute top-0 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/20 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 pt-8 sm:pt-12 md:pt-20 lg:pt-28 relative z-10 mb-8 sm:mb-12">
        <div className="flex flex-col items-center text-center gap-4 sm:gap-6 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-balance bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/60">
            Impresiones 3D de Alta Calidad
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-balance max-w-2xl leading-relaxed px-2">
            Descubre nuestra colección de miniaturas, accesorios para TCG, fichas para juegos de rol y decoraciones
            únicas. Cada pieza impresa con precisión y detalle.
          </p>
          <a href="#productos" className="mt-2 sm:mt-4">
            <button className="bg-primary text-primary-foreground px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-lg hover:shadow-primary/25 cursor-pointer text-sm sm:text-base">
              Ver Productos
            </button>
          </a>
        </div>
      </div>

      {/* Insertamos el carrusel aquí, debajo del texto principal */}
      <div className="relative w-full mt-4 sm:mt-8">
         <InfiniteCarousel products={products} />
      </div>
    </section>
  )
}