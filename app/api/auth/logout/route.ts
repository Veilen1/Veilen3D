import { NextResponse } from "next/server"
import { getCookieName } from "@/lib/auth"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })

    // Eliminar cookie seteando maxAge a 0
    response.cookies.set(getCookieName(), "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("[Auth] Error en logout:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
