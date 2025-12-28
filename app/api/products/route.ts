import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

// Configura tu conexión a MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || "tu-connection-string-aqui"
const MONGODB_DB = process.env.MONGODB_DB || "printstore"

let cachedClient: MongoClient | null = null

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient
  }

  const client = await MongoClient.connect(MONGODB_URI)
  cachedClient = client
  return client
}

export async function GET() {
  try {
    const client = await connectToDatabase()
    const db = client.db(MONGODB_DB)
    const products = await db.collection("products").find({}).toArray()

    return NextResponse.json(products)
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ error: "Error al cargar productos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const client = await connectToDatabase()
    const db = client.db(MONGODB_DB)

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
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
