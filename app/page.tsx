import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"
import { MongoClient } from "mongodb"
import type { Product } from "@/types/product"

async function getProducts(): Promise<Product[]> {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("[v0] MONGODB_URI not found")
      return []
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db(process.env.MONGODB_DB || "printstore")
    const products = await db.collection("products").find({}).toArray()
    await client.close()

    // Convert MongoDB _id to string for serialization
    return products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    })) as Product[]
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }
}

export default async function Home() {
  const products = await getProducts()

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
