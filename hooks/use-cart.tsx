"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, CartItem } from "@/types/product"

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (product) => {
        const items = get().items
        const existingItem = items.find((item) => item._id === product._id)

        if (existingItem) {
          set({
            items: items.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)),
          })
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] })
        }

        // Calculate total
        const newItems = get().items
        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        set({ total })
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item._id !== productId) })

        const newItems = get().items
        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        set({ total })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return

        set({
          items: get().items.map((item) => (item._id === productId ? { ...item, quantity } : item)),
        })

        const newItems = get().items
        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        set({ total })
      },

      clearCart: () => {
        set({ items: [], total: 0 })
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
