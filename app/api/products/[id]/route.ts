import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("[v0] Fetching products from MongoDB...")
    const db = await getDatabase()
    const products = await db.collection("products").find({}).toArray()

    console.log("[v0] Products fetched:", products.length)

    const serializedProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }))

    return NextResponse.json(serializedProducts)
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json(
      { error: "Error al cargar productos", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
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
    console.error("[v0] Error creating product:", error)
    return NextResponse.json(
      { error: "Error al crear producto", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
