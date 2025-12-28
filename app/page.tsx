import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"
import { getDatabase } from "@/lib/mongodb"
import type { Product } from "@/types/product"

export const dynamic = "force-dynamic"

async function getProducts(): Promise<Product[]> {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in environment variables")
      return []
    }

    const db = await getDatabase()
    // Agregamos lean() si estuvieras usando Mongoose, pero con driver nativo toArray está bien.
    const products = await db.collection("products").find({}).toArray()
    
    console.log(`✅ Productos obtenidos: ${products.length}`)

    return products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    })) as Product[]
  } catch (error) {
    console.error("❌ Error fetching products:", error)
    return []
  }
}



export default async function Home() {
  const products = await getProducts() // Obtenemos productos

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* AQUI: Asegúrate de pasarle los productos al Hero */}
      <Hero products={products} />
      <main className="flex-1">
        <ProductGrid initialProducts={products} />
      </main>
      <Footer />
    </div>
  )
}