"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, KeyRound, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

// ============================================================================
// Componente principal con Suspense
// ============================================================================

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPasswordContent />
    </Suspense>
  )
}

// ============================================================================
// Estado de carga
// ============================================================================

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="py-12 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando enlace...</p>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// Contenido del reset
// ============================================================================

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  // Verificar token al cargar
  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setIsVerifying(false)
        return
      }

      try {
        const res = await fetch(`/api/auth/reset-password?token=${token}`)
        const data = await res.json()

        if (data.valid) {
          setTokenValid(true)
          setUserEmail(data.email || "")
        } else {
          setError(data.error || "El enlace ha expirado o es inválido")
        }
      } catch {
        setError("Error verificando el enlace")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validar contraseñas
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSuccess(true)
      } else {
        setError(data.error || "Ocurrió un error")
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Estado de verificación
  if (isVerifying) {
    return <LoadingState />
  }

  // Token inválido o no proporcionado
  if (!token || !tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Enlace inválido
            </CardTitle>
            <CardDescription>
              {error || "El enlace de recuperación ha expirado o es inválido."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
              <p>Los enlaces de recuperación expiran después de 1 hora por seguridad.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Link href="/forgot-password" className="w-full">
              <Button className="w-full">
                Solicitar nuevo enlace
              </Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio de sesión
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Éxito
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              ¡Contraseña actualizada!
            </CardTitle>
            <CardDescription>
              Tu contraseña ha sido restablecida correctamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground text-center">
              Ya puedes iniciar sesión con tu nueva contraseña.
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => router.push("/login")}
            >
              Iniciar sesión
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Formulario de nueva contraseña
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Nueva contraseña
          </CardTitle>
          <CardDescription>
            {userEmail && (
              <>
                Ingresa una nueva contraseña para <strong>{userEmail}</strong>
              </>
            )}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
                {error}
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              La contraseña debe tener al menos 6 caracteres.
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar nueva contraseña"}
            </Button>
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
