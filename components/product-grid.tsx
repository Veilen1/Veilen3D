"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { CategoryFilter } from "@/components/category-filter"
import type { Product } from "@/types/product"

interface ProductGridProps {
  initialProducts?: Product[] // Hacemos la prop opcional por seguridad
}

export function ProductGrid({ initialProducts = [] }: ProductGridProps) { // Valor por defecto = []
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Lógica simplificada: No necesitas useEffect ni useState para esto
  const filteredProducts = selectedCategory === "all"
    ? initialProducts
    : initialProducts.filter((p) => p.category === selectedCategory)

  // Verificación de seguridad
  if (!initialProducts || initialProducts.length === 0) {
    return (
      <section id="productos" className="w-full py-12 md:py-16">
        <div className="container mx-auto px-4 text-center py-12">
          <p className="text-xl text-muted-foreground">No hay productos disponibles</p>
          <p className="text-sm text-muted-foreground mt-2">Verifica tu conexión a MongoDB</p>
        </div>
      </section>
    )
  }

  return (
    <section id="productos" className="w-full py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Nuestros Productos</h2>
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onCategoryChange={setSelectedCategory} 
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay productos disponibles en esta categoría
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
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