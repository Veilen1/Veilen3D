import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import bcrypt from "bcryptjs"

// GET: Listar todos los usuarios (solo admin)
export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    if (!session.isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const db = await getDatabase()
    const users = await db
      .collection("users")
      .find({}, { projection: { passwordHash: 0 } })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("[Admin] Error listando usuarios:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// POST: Crear nuevo usuario (solo admin)
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
    const { name, email, password, isAdmin } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const users = db.collection("users")

    const existingUser = await users.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      isAdmin: Boolean(isAdmin),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await users.insertOne(newUser)

    return NextResponse.json({
      success: true,
      user: {
        _id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        createdAt: newUser.createdAt,
      },
    })
  } catch (error) {
    console.error("[Admin] Error creando usuario:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
