import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://veilen3d.vercel.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/configuracion/", "/perfil/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
