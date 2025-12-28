export interface Product {
  _id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  category: "tcg" | "rpg" | "miniaturas" | "adornos" | "otros"
  images?: string[]
  image?: string // Mantener por compatibilidad
  featured?: boolean // Agregar flag para productos destacados
  stock: number
  createdAt: Date
  updatedAt: Date
}

export interface CartItem extends Product {
  quantity: number
}