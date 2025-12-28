"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import type { Product } from "@/types/product"

interface InfiniteCarouselProps {
  products: Product[]
}

export function InfiniteCarousel({ products }: InfiniteCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || products.length === 0) return

    let animationId: number
    let position = 0

    const scroll = () => {
      position += 0.5
      if (scrollContainer) {
        scrollContainer.scrollLeft = position

        if (position >= scrollContainer.scrollWidth / 2) {
          position = 0
        }
      }
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(animationId)
  }, [products.length])

  if (products.length === 0) return null

  const duplicatedProducts = [...products, ...products]

  return (
    <div className="relative w-full overflow-hidden h-32 md:h-40 bg-muted/50">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden h-full items-center px-4"
        style={{ scrollBehavior: "auto" }}
      >
        {duplicatedProducts.map((product, index) => {
          const firstImage = product.images?.[0] || product.image
          return (
            <div
              key={`${product._id}-${index}`}
              className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0 rounded-lg overflow-hidden"
            >
              <Image
                src={firstImage || `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(product.name)}`}
                alt={product.name}
                fill
                className="object-cover opacity-70"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
