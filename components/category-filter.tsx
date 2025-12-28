"use client"

import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: "all", label: "Todos" },
  { id: "tcg", label: "TCG" },
  { id: "rpg", label: "Juegos de Rol" },
  { id: "miniaturas", label: "Miniaturas" },
  { id: "adornos", label: "Adornos" },
  { id: "otros", label: "Otros" },
]

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div id="categorias" className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className="rounded-full"
        >
          {category.label}
        </Button>
      ))}
    </div>
  )
}
