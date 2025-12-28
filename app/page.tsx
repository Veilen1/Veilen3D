import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"
import { getDatabase } from "@/lib/mongodb"
import type { Product } from "@/types/product"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getProducts(): Promise<Product[]> {
  try {
    console.log("[v0] Connecting to MongoDB...")

    if (!process.env.MONGODB_URI) {
      console.error("[v0] MONGODB_URI not found in environment variables")
      return []
    }

    const db = await getDatabase()
    console.log("[v0] Connected to database")

    const products = await db.collection("products").find({}).toArray()
    console.log("[v0] Products fetched:", products.length)

    return products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    })) as Product[]
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    console.error("[v0] Error details:", error instanceof Error ? error.message : "Unknown error")
    return []
  }
}

export default async function Home() {
  const products = await getProducts()
  console.log("[v0] Rendering page with products:", products.length)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero products={products} />
      <main className="flex-1">
        <ProductGrid initialProducts={products} />
      </main>
      <Footer />
    </div>
  )
}
