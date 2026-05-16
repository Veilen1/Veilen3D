import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    if (!session.isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const formData = await request.formData()
    const files = formData.getAll("images")

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No se recibieron archivos" }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await fs.promises.mkdir(uploadDir, { recursive: true })

    const urls: string[] = []

    for (const f of files) {
      const file = f as any
      const safeName = (file.name || "file").replace(/[^a-zA-Z0-9.()-]/g, "-")
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const filePath = path.join(uploadDir, filename)
      await fs.promises.writeFile(filePath, buffer)
      urls.push(`/uploads/${filename}`)
    }

    return NextResponse.json({ success: true, urls })
  } catch (error) {
    console.error("[Admin] Error subiendo archivos:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
