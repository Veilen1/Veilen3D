import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"
import { getDatabase } from "@/lib/mongodb"
import type { Product } from "@/types/product"

// ISR: Revalidar cada 60 segundos (mejor que force-dynamic)
export const revalidate = 60

async function getProducts(): Promise<Product[]> {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in environment variables")
      return []
    }

    const db = await getDatabase()
    const products = await db
      .collection("products")
      .find({})
      .sort({ featured: -1, createdAt: -1 }) // Destacados primero, luego recientes
      .limit(50) // Limitar para mejor performance
      .toArray()
    
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
  const products = await getProducts()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Veilen 3D",
    description:
      "Tienda online de impresiones 3D: miniaturas, accesorios TCG, fichas RPG y decoraciones únicas.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://veilen3d.vercel.app",
    logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://veilen3d.vercel.app"}/icon.png`,
    image: `${process.env.NEXT_PUBLIC_APP_URL || "https://veilen3d.vercel.app"}/icon.png`,
    telephone: "+5492216387312",
    email: "devrientv@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "La Plata",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    sameAs: ["https://instagram.com/veilen3d"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Impresiones 3D",
      itemListElement: products.slice(0, 10).map((p) => ({
        "@type": "Product",
        name: p.name,
        description: p.description,
        image: p.images?.[0] || p.image,
        offers: {
          "@type": "Offer",
          price: p.price,
          priceCurrency: "ARS",
          availability:
            p.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      })),
    },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Hero products={products} />
      <main className="flex-1">
        <ProductGrid initialProducts={products} />
      </main>
      <Footer />
    </div>
  )
}