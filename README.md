<div align="center">

# 🎯 Veilen3D

### Tienda Online de Impresiones 3D Premium

*Miniaturas • TCG • RPG • Adornos Personalizados*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[✨ Demo en Vivo](#) • [📖 Documentación](#-instalación) • [📱 Contacto](#-contacto)

</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [API](#-api-endpoints)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contacto](#-contacto)

---

## ✨ Características

🎨 **Experiencia Visual**
- Carruseles de imágenes en cada producto
- Hero con productos destacados en scroll infinito
- Diseño moderno y responsivo
- Animaciones fluidas y feedback visual

🛒 **Sistema de Compras**
- Carrito de compras con persistencia local
- Contador de productos en tiempo real
- Checkout directo por WhatsApp
- Notificaciones toast al agregar productos

🗂️ **Gestión de Productos**
- Filtros por categorías (TCG, RPG, Miniaturas, Adornos, Otros)
- Sistema de precios con descuentos opcionales
- Múltiples imágenes por producto
- Productos destacados (featured)

🔌 **Backend Robusto**
- API REST completa (CRUD)
- Conexión a MongoDB Atlas
- TypeScript para type-safety
- Server Actions de Next.js 16

---

## 🛠️ Tecnologías

| Tecnología | Descripción |
|------------|-------------|
| **Next.js 16** | Framework React con App Router y Server Components |
| **React 19** | Biblioteca UI con hooks modernos |
| **TypeScript** | Tipado estático para mayor seguridad |
| **MongoDB Atlas** | Base de datos NoSQL en la nube |
| **Tailwind CSS v4** | Framework CSS utility-first |
| **shadcn/ui** | Componentes UI de alta calidad |
| **Zustand** | State management ligero |
| **Embla Carousel** | Carruseles performantes |

---

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+ instalado
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/veilen3d.git
cd veilen3d
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/veilen3d
```

4. **Poblar la base de datos**
```bash
node scripts/seed-database.js
```

5. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

6. **Abrir en el navegador**
```
http://localhost:3000
```

---

## ⚙️ Configuración

### MongoDB Atlas Setup

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un nuevo cluster (M0 - Free tier)
3. Ve a **Database Access** y crea un usuario con permisos de lectura/escritura
4. Ve a **Network Access** y agrega tu IP (o `0.0.0.0/0` para desarrollo)
5. Copia tu connection string y reemplaza `<password>` con tu contraseña

### Configurar WhatsApp

El checkout se hace vía WhatsApp. El número está configurado en `components/cart-sheet.tsx`:

```typescript
const phoneNumber = "5492216387312" // +54 9 221 6387312
```

**Formato:** Código de país + código de área + número (sin espacios, guiones ni +)

### Personalizar Productos

Edita `scripts/seed-products.json` para agregar tus propios productos:

```json
{
  "name": "Miniatura de Dragón",
  "description": "Dragón épico para tus partidas de D&D",
  "price": 2500,
  "compareAtPrice": 3500,
  "category": "rpg",
  "images": [
    "URL_DE_TU_IMAGEN_1",
    "URL_DE_TU_IMAGEN_2",
    "URL_DE_TU_IMAGEN_3"
  ],
  "featured": true,
  "stock": 10
}
```

Luego ejecuta: `node scripts/seed-database.js`

---

## 📡 API Endpoints

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/products` | Obtener todos los productos |
| `POST` | `/api/products` | Crear un nuevo producto |
| `GET` | `/api/products/[id]` | Obtener un producto específico |
| `PUT` | `/api/products/[id]` | Actualizar un producto |
| `DELETE` | `/api/products/[id]` | Eliminar un producto |

### Ejemplo de Uso

**Crear un producto:**
```typescript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Token de Vida MTG',
    description: 'Token personalizado para Magic',
    price: 150,
    category: 'tcg',
    images: ['https://...'],
    stock: 50,
    featured: false
  }),
})
```

---

## 📂 Estructura del Proyecto

```
veilen3d/
├── app/
│   ├── api/
│   │   └── products/          # API REST de productos
│   ├── globals.css            # Estilos globales y variables CSS
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Página principal
├── components/
│   ├── cart-sheet.tsx         # Carrito lateral
│   ├── category-filter.tsx    # Filtros de categorías
│   ├── footer.tsx             # Footer con contacto
│   ├── header.tsx             # Header con logo y carrito
│   ├── hero.tsx               # Hero con carrusel infinito
│   ├── infinite-carousel.tsx  # Carrusel de productos destacados
│   ├── product-card.tsx       # Tarjeta de producto
│   ├── product-carousel.tsx   # Carrusel de imágenes del producto
│   └── product-grid.tsx       # Grid de productos
├── hooks/
│   └── use-cart.tsx           # Hook del carrito (Zustand)
├── lib/
│   ├── mongodb.ts             # Cliente de MongoDB
│   └── utils.ts               # Utilidades (cn, formatPrice)
├── scripts/
│   ├── seed-database.js       # Script para poblar la DB
│   └── seed-products.json     # Datos de productos de ejemplo
└── types/
    └── product.ts             # Tipos TypeScript
```

---

## 🎨 Personalización

### Colores y Tema

Edita las variables CSS en `app/globals.css`:

```css
@theme inline {
  --color-primary: oklch(0.6 0.2 270);      /* Color principal */
  --color-secondary: oklch(0.5 0.15 320);   /* Color secundario */
  --color-accent: oklch(0.7 0.18 45);       /* Color de acento */
  /* ... más variables */
}
```

### Categorías

Agrega o modifica categorías en `components/category-filter.tsx`.

### Fuentes

Cambia las fuentes en `app/layout.tsx` usando Google Fonts.

---

## 🚀 Deploy en Vercel

1. Push tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Agrega la variable de entorno `MONGODB_URI`
4. Deploy automático ✨

---

## 📝 Scripts Disponibles

```bash
npm run dev          # Ejecutar en desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar en producción
npm run lint         # Lint del código
```

---

## 📱 Contacto

**Veilen3D** - Impresiones 3D de Alta Calidad

- 💬 **WhatsApp:** [+54 9 221 6387312](https://wa.me/5492216387312)
- 📷 **Instagram:** [@veilen.3d](https://instagram.com/veilen.3d)
- 📧 **Email:** [devrientv@gmail.com](mailto:devrientv@gmail.com)

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

<div align="center">

**Hecho con ❤️ por [Veilen3D](https://github.com/tu-usuario)**

*¿Te gusta el proyecto? Dale una ⭐ en GitHub*

</div>
