import { MessageCircle, Instagram, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer id="contacto" className="w-full border-t border-border bg-muted/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Veilen 3D</h3>
            <p className="text-sm text-muted-foreground">
              Impresiones 3D de alta calidad para coleccionistas y entusiastas.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>TCG</li>
              <li>Juegos de Rol</li>
              <li>Miniaturas</li>
              <li>Adornos</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5492216387312"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href="https://instagram.com/veilen3d"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
                @veilen.3d
              </a>
              <a
                href="mailto:devrientv@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                devrientv@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Veilen 3D. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
