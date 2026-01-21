import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import crypto from "crypto"

// ============================================================================
// POST - Restablecer contraseña
// ============================================================================

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    // Validaciones
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 400 }
      )
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Hash del token para buscar en la DB
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    // Buscar usuario con token válido y no expirado
    const db = await getDatabase()
    const user = await db.collection("users").findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json(
        { error: "El enlace ha expirado o es inválido. Solicita uno nuevo." },
        { status: 400 }
      )
    }

    // Hash de la nueva contraseña
    const passwordHash = await bcrypt.hash(password, 12)

    // Actualizar contraseña y limpiar tokens
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          passwordHash,
          updatedAt: new Date(),
        },
        $unset: {
          passwordResetToken: "",
          passwordResetExpires: "",
        },
      }
    )

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada correctamente",
    })
  } catch (error) {
    console.error("Error en reset-password:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// ============================================================================
// GET - Verificar si el token es válido
// ============================================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token no proporcionado" },
        { status: 400 }
      )
    }

    // Hash del token para buscar en la DB
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    // Verificar si existe y no ha expirado
    const db = await getDatabase()
    const user = await db.collection("users").findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({
        valid: false,
        error: "El enlace ha expirado o es inválido",
      })
    }

    return NextResponse.json({
      valid: true,
      email: user.email,
    })
  } catch (error) {
    console.error("Error verificando token:", error)
    return NextResponse.json(
      { valid: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
