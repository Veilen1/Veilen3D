import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

// Revalidar cada 60 segundos para productos públicos
export const revalidate = 60

export async function GET() {
  try {
    const db = await getDatabase()
    const products = await db
      .collection("products")
      .find({})
      .project({ passwordHash: 0 }) // Excluir campos sensibles si existieran
      .toArray()

    // Headers de caché para CDN de Vercel
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    })
  } catch (error) {
    console.error("[API] Error fetching products:", error)
    return NextResponse.json({ error: "Error al cargar productos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()

    const product = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("products").insertOne(product)

    return NextResponse.json({
      success: true,
      productId: result.insertedId,
    })
  } catch (error) {
    console.error("[API] Error creating product:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
