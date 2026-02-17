// Archivo centralizado para las categorías de productos
// Modificar aquí para actualizar las categorías en toda la aplicación

export const CATEGORIES = [
  { id: "tcg", label: "TCG", value: "tcg" },
  { id: "rpg", label: "Juegos de Rol", value: "rpg" },
  { id: "miniaturas", label: "Miniaturas", value: "miniaturas" },
  { id: "decoraciones", label: "Decoraciones", value: "decoraciones" },
  { id: "juguetes", label: "Juguetes", value: "juguetes" },
  { id: "otros", label: "Otros", value: "otros" },
] as const

// Categorías con opción "Todos" para filtros
export const CATEGORIES_WITH_ALL = [
  { id: "all", label: "Todos", value: "all" },
  ...CATEGORIES,
] as const

// Tipo derivado de las categorías
export type CategoryId = (typeof CATEGORIES)[number]["id"]

// Función helper para obtener el label de una categoría
export function getCategoryLabel(categoryId: string): string {
  const category = CATEGORIES.find((c) => c.id === categoryId)
  return category?.label || categoryId
}

// Función helper para validar si una categoría existe
export function isValidCategory(categoryId: string): boolean {
  return CATEGORIES.some((c) => c.id === categoryId)
}
