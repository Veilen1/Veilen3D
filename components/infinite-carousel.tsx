import Image from "next/image"
import type { Product } from "@/types/product"

interface InfiniteCarouselProps {
  products: Product[]
}

export function InfiniteCarousel({ products }: InfiniteCarouselProps) {
  // Si no hay suficientes productos para hacer el efecto infinito, no mostramos nada.
  if (!products || products.length < 4) return null

  // Duplicamos los productos para asegurar que el loop sea continuo sin cortes
  // Triplicamos para pantallas muy anchas para asegurar que no haya espacios vacíos
  const duplicatedProducts = [...products, ...products, ...products]

  return (
    <div className="w-full py-10 overflow-hidden bg-secondary/30 border-y border-border/50 backdrop-blur-sm relative z-20">
      {/* Gradients laterales para suavizar la entrada y salida */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-30 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-30 pointer-events-none" />

      {/* Contenedor que se anima */}
      {/* Usamos una animación CSS inline para no depender de tailwind.config */}
      <div
        className="flex gap-6 animate-infinite-scroll hover:paused"
        style={{
          width: "max-content",
          animation: "scroll 60s linear infinite",
        }}
      >
        {duplicatedProducts.map((product, index) => {
          const firstImage = product.images?.[0] || product.image
          return (
            <div
              key={`${product._id}-${index}`}
              className="relative h-40 w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <Image
                src={firstImage || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name)}`}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
              />
              {/* Overlay sutil con el nombre al hacer hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-white font-medium text-sm truncate">{product.name}</p>
              </div>
            </div>
          )
        })}
      </div>
      {/* Definimos la animación en un tag style jsx para que funcione directo */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            // Movemos 1/3 del total porque triplicamos el array
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </div>
  )
}