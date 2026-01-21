"use client"

import Image from "next/image"
import type { Product } from "@/types/product"

// ============================================================================
// Types
// ============================================================================

interface InfiniteCarouselProps {
  products: Product[]
}

// ============================================================================
// Component
// ============================================================================

export function InfiniteCarousel({ products }: InfiniteCarouselProps) {
  // Requiere al menos 4 productos para el efecto infinito
  if (!products || products.length < 4) return null

  // Duplicamos los productos para el loop continuo
  const duplicatedProducts = [...products, ...products]

  return (
    <div className="w-full py-6 sm:py-10 overflow-hidden bg-secondary/30 border-y border-border/50 backdrop-blur-sm relative">
      {/* Gradientes laterales */}
      <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Track del carrusel */}
      <div className="flex animate-scroll">
        {duplicatedProducts.map((product, index) => (
          <div
            key={`${product._id}-${index}`}
            className="flex-shrink-0 px-2 sm:px-3"
          >
            <div className="relative h-28 w-28 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 rounded-xl sm:rounded-2xl overflow-hidden shadow-md">
              <Image
                src={product.images?.[0] || product.image || `/placeholder.svg?height=300&width=300`}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 112px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}