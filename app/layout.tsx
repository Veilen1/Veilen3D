import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://veilen3d.vercel.app"

export const metadata: Metadata = {
  title: {
    default: "Veilen 3D - Impresiones 3D | TCG, RPG & Miniaturas",
    template: "%s | Veilen 3D",
  },
  description:
    "Tienda online de impresiones 3D en La Plata: miniaturas, accesorios TCG, fichas para juegos de rol, decoraciones y productos personalizados. Envíos a todo el país.",
  keywords: [
    "impresiones 3D",
    "miniaturas",
    "TCG",
    "juegos de rol",
    "RPG",
    "deckbox",
    "dados",
    "D&D",
    "Dungeons and Dragons",
    "impresión 3D La Plata",
    "accesorios TCG",
    "figuras 3D",
  ],
  authors: [{ name: "Veilen 3D" }],
  creator: "Veilen 3D",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    siteName: "Veilen 3D",
    title: "Veilen 3D - Impresiones 3D | TCG, RPG & Miniaturas",
    description:
      "Tienda online de impresiones 3D: miniaturas, accesorios TCG, fichas RPG y decoraciones únicas. Cada pieza impresa con precisión y detalle.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Veilen 3D Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Veilen 3D - Impresiones 3D | TCG, RPG & Miniaturas",
    description:
      "Miniaturas, accesorios TCG, fichas RPG y decoraciones únicas impresas en 3D.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geist.className} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
