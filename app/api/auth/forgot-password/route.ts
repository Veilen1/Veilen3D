import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

// ============================================================================
// POST - Solicitar recuperación de contraseña
// ============================================================================

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validar email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email requerido" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Buscar usuario
    const db = await getDatabase()
    const user = await db.collection("users").findOne({ email: normalizedEmail })

    // Siempre responder con éxito para no revelar si el email existe
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Si el email existe, recibirás un enlace de recuperación",
      })
    }

    // Generar token seguro
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    // Guardar token en la base de datos (expira en 1 hora)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          passwordResetToken: resetTokenHash,
          passwordResetExpires: expiresAt,
        },
      }
    )

    // Enviar email
    const emailResult = await sendPasswordResetEmail(
      normalizedEmail,
      resetToken,
      user.name || "Usuario"
    )

    if (!emailResult.success) {
      console.error("Error enviando email de recuperación:", emailResult.error)
      // No revelar el error exacto al usuario
    }

    return NextResponse.json({
      success: true,
      message: "Si el email existe, recibirás un enlace de recuperación",
    })
  } catch (error) {
    console.error("Error en forgot-password:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
