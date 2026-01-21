"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

// ============================================================================
// Types
// ============================================================================

interface ProductCarouselProps {
  images: string[]
  productName: string
}

// ============================================================================
// Component
// ============================================================================

export function ProductCarousel({ images, productName }: ProductCarouselProps) {
  // Estado del carrusel
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  
  // Estado del drag (solo móvil)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null)
  
  // Hooks
  const isMobile = useIsMobile()

  // --------------------------------------------------------------------------
  // Cleanup de timeouts
  // --------------------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      if (autoRotateRef.current) clearInterval(autoRotateRef.current)
    }
  }, [])

  // --------------------------------------------------------------------------
  // Auto-rotación en hover (después de 1 segundo, cambia cada 2 segundos)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isHovering || images.length <= 1) return

    // Iniciar auto-rotación después de 1 segundo de hover
    hoverTimeoutRef.current = setTimeout(() => {
      autoRotateRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }, 2000)
    }, 1000)

    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      if (autoRotateRef.current) clearInterval(autoRotateRef.current)
    }
  }, [isHovering, images.length])

  // --------------------------------------------------------------------------
  // Navegación
  // --------------------------------------------------------------------------
  const goToPrevious = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      e?.stopPropagation()
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    },
    [images.length]
  )

  const goToNext = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      e?.stopPropagation()
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    },
    [images.length]
  )

  const goToIndex = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex(index)
  }

  // --------------------------------------------------------------------------
  // Touch/Drag handlers (solo móvil)
  // --------------------------------------------------------------------------
  const handleDragStart = (clientX: number) => {
    if (!isMobile) return
    setIsDragging(true)
    setStartX(clientX)
    setDragOffset(0)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !isMobile) return
    setDragOffset(clientX - startX)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 50 // Mínimo de píxeles para cambiar de imagen
    if (dragOffset > threshold) {
      goToPrevious()
    } else if (dragOffset < -threshold) {
      goToNext()
    }
    setDragOffset(0)
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return
    handleDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return
    handleDragMove(e.touches[0].clientX)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    handleDragEnd()
  }

  // --------------------------------------------------------------------------
  // Render: Sin imágenes
  // --------------------------------------------------------------------------
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={`/placeholder.svg?height=400&width=400&query=${encodeURIComponent(productName)}`}
          alt={productName}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // Render: Con imágenes
  // --------------------------------------------------------------------------
  const containerClasses = [
    "relative aspect-square overflow-hidden bg-muted group",
    isMobile ? "touch-pan-y select-none" : "",
  ].join(" ")

  const containerStyle = {
    cursor: isMobile ? (isDragging ? "grabbing" : "grab") : "default",
  }

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={containerStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
    >
      {/* Imagen actual con efecto de drag */}
      <div
        className="relative w-full h-full transition-transform duration-200"
        style={{
          transform: isDragging ? `translateX(${dragOffset}px)` : "translateX(0)",
        }}
      >
        <Image
          src={images[currentIndex] || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(productName)}`}
          alt={`${productName} - Imagen ${currentIndex + 1}`}
          fill
          className={`object-cover transition-transform duration-300 ${
            isHovering && !isDragging ? "scale-105" : ""
          }`}
          draggable={false}
        />
      </div>

      {/* Controles de navegación (solo si hay múltiples imágenes) */}
      {images.length > 1 && (
        <>
          {/* Flechas de navegación (solo desktop) */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hidden sm:flex"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hidden sm:flex"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Indicadores de página */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToIndex(index, e)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>

          {/* Indicador de swipe (solo móvil) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 sm:hidden">
            <span className="text-xs text-white/70 bg-black/30 px-2 py-1 rounded-full">
              Desliza ← →
            </span>
          </div>
        </>
      )}
    </div>
  )
}
