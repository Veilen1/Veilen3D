"use client"

import { Button } from "@/components/ui/button"
import { CATEGORIES_WITH_ALL } from "@/lib/categories"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div id="categorias" className="flex flex-wrap gap-1.5 sm:gap-2">
      {CATEGORIES_WITH_ALL.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className="rounded-full text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9"
        >
          {category.label}
        </Button>
      ))}
    </div>
  )
}
