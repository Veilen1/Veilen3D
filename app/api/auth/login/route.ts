import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { signToken, getAuthCookieOptions, getCookieName } from "@/lib/auth"
import { checkRateLimit, getClientIP } from "@/lib/security"

export async function POST(request: Request) {
  try {
    // Rate limiting: 5 intentos por minuto por IP
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(`login:${clientIP}`, 5, 60000)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intenta de nuevo en un minuto." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const users = db.collection("users")

    // Buscar usuario por email
    const user = await users.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    // Generar token
    const token = await signToken({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
    })

    const cookieOptions = getAuthCookieOptions()
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false,
      },
    })

    response.cookies.set(getCookieName(), token, cookieOptions)

    return response
  } catch (error) {
    console.error("[Auth] Error en login:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
