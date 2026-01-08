import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

// GET: Listar todos los productos
export async function GET() {
  try {
    const db = await getDatabase()
    const products = await db
      .collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    const serializedProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }))

    return NextResponse.json({ products: serializedProducts })
  } catch (error) {
    console.error("[Admin] Error listando productos:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// POST: Crear nuevo producto (solo admin)
export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    if (!session.isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, price, compareAtPrice, category, images, stock, featured } = body

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "Nombre, precio y categoría son requeridos" },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    const newProduct = {
      name: name.trim(),
      description: description?.trim() || "",
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      category,
      images: images || [],
      image: images?.[0] || "",
      stock: Number(stock) || 0,
      featured: Boolean(featured),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("products").insertOne(newProduct)

    return NextResponse.json({
      success: true,
      product: {
        ...newProduct,
        _id: result.insertedId.toString(),
      },
    })
  } catch (error) {
    console.error("[Admin] Error creando producto:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
