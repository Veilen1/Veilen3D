"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction } from "lucide-react"

export default function ConfiguracionPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Configuración</CardTitle>
            <CardDescription>Ajustes de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Construction className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">En construcción</h3>
            <p className="text-muted-foreground mt-2">
              Esta sección estará disponible próximamente.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
