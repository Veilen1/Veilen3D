import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { signToken, getAuthCookieOptions, getCookieName } from "@/lib/auth"
import { checkRateLimit, getClientIP } from "@/lib/security"

export async function POST(request: Request) {
  try {
    // Rate limiting: 3 registros por minuto por IP
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(`register:${clientIP}`, 3, 60000)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intenta de nuevo en un minuto." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, password } = body

    // Validación básica
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

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El formato del email no es válido" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const users = db.collection("users")

    // Verificar si el email ya existe
    const existingUser = await users.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 409 }
      )
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // Crear usuario
    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await users.insertOne(newUser)

    // Generar token y setear cookie
    const token = await signToken({
      _id: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name,
      isAdmin: newUser.isAdmin,
    })

    const cookieOptions = getAuthCookieOptions()
    const response = NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    })

    response.cookies.set(getCookieName(), token, cookieOptions)

    return response
  } catch (error) {
    console.error("[Auth] Error en registro:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
