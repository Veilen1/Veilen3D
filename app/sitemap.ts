import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://veilen3d.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]
}
