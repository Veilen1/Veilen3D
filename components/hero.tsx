"use client"

import { useEffect, useState } from "react"
import { InfiniteCarousel } from "./infinite-carousel"
import type { Product } from "@/types/product"

export function Hero() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((products: Product[]) => {
        const featured = products.filter((p) => p.featured)
        setFeaturedProducts(featured.length > 0 ? featured : products.slice(0, 8))
      })
      .catch((error) => console.error("Error loading featured products:", error))
  }, [])

  return (
    <section className="w-full py-12 md:py-20 lg:py-28 bg-muted relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <InfiniteCarousel products={featuredProducts} />
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
