"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { CategoryFilter } from "@/components/category-filter"
import type { Product } from "@/types/product"

interface ProductGridProps {
  initialProducts: Product[]
}

export function ProductGrid({ initialProducts }: ProductGridProps) {
  const [products] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((p) => p.category === selectedCategory))
    }
  }, [selectedCategory, products])

  if (products.length === 0) {
    return (
      <section id="productos" className="w-full py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No hay productos disponibles</p>
            <p className="text-sm text-muted-foreground mt-2">Verifica tu conexión a MongoDB</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="productos" className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-bold">Nuestros Productos</h2>
            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay productos disponibles en esta categoría
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
