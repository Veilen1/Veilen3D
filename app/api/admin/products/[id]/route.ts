import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

// GET: Obtener un producto
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) })

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      product: {
        ...product,
        _id: product._id.toString(),
      },
    })
  } catch (error) {
    console.error("[Admin] Error obteniendo producto:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// PATCH: Actualizar producto (solo admin)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    if (!session.isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, price, compareAtPrice, category, images, stock, featured } = body

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description.trim()
    if (price !== undefined) updateData.price = Number(price)
    if (compareAtPrice !== undefined) updateData.compareAtPrice = compareAtPrice ? Number(compareAtPrice) : null
    if (category !== undefined) updateData.category = category
    if (images !== undefined) {
      updateData.images = images
      updateData.image = images[0] || ""
    }
    if (stock !== undefined) updateData.stock = Number(stock)
    if (featured !== undefined) updateData.featured = Boolean(featured)

    const db = await getDatabase()
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Admin] Error actualizando producto:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// DELETE: Eliminar producto (solo admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    if (!session.isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const db = await getDatabase()
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Admin] Error eliminando producto:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
