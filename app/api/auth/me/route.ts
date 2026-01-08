import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: session.sub,
        email: session.email,
        name: session.name,
        isAdmin: session.isAdmin,
      },
    })
  } catch (error) {
    console.error("[Auth] Error obteniendo sesión:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
