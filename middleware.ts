import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-in-production")

// Rutas que requieren autenticación
const PROTECTED_ROUTES = ["/perfil", "/configuracion"]

// Rutas que requieren ser admin
const ADMIN_ROUTES = ["/admin"]

// Rutas públicas (no redirigir si está logueado)
const AUTH_ROUTES = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth_token")?.value

  let user = null

  // Verificar token si existe
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      user = payload
    } catch {
      // Token inválido - limpiar cookie
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth_token")
      return response
    }
  }

  // Rutas de autenticación: redirigir a home si ya está logueado
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Rutas protegidas: requieren autenticación
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const url = new URL("/login", request.url)
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }
  }

  // Rutas admin: requieren autenticación + isAdmin
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const url = new URL("/login", request.url)
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }
    if (!user.isAdmin) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
}
