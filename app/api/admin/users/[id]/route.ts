import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

// PATCH: Actualizar usuario (cambiar rol, etc.)
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
    const { isAdmin } = body

    // No permitir que un admin se quite sus propios permisos
    if (id === session.sub && isAdmin === false) {
      return NextResponse.json(
        { error: "No puedes quitarte tus propios permisos de admin" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isAdmin: Boolean(isAdmin),
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Admin] Error actualizando usuario:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// DELETE: Eliminar usuario
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

    // No permitir que un admin se elimine a sí mismo
    if (id === session.sub) {
      return NextResponse.json(
        { error: "No puedes eliminarte a ti mismo" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Admin] Error eliminando usuario:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
