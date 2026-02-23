# Veilen 3D 🎲

Tienda online de impresiones 3D especializadas en miniaturas, accesorios TCG, fichas RPG y decoraciones únicas.

**[🌐 veilen3d.vercel.app](https://veilen3d.vercel.app)**

## Tech Stack

- **Framework:** Next.js 16 (App Router, ISR)
- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **UI:** shadcn/ui + Radix UI
- **Base de datos:** MongoDB Atlas
- **Auth:** JWT (jose) + bcrypt
- **Email:** Nodemailer (Gmail SMTP / Resend)
- **Deploy:** Vercel
- **State:** Zustand (carrito persistente)

## Features

- 🛒 Carrito de compras con persistencia en localStorage
- 👤 Sistema de autenticación completo (registro, login, recuperación de contraseña)
- 🔐 Panel de administración para gestión de productos
- 📱 Diseño responsive
- 🔒 Headers de seguridad (CSP, CSRF protection)
- ⚡ ISR para performance óptima
- 🎨 Temas claro/oscuro

## Setup local

```bash
# Clonar
git clone https://github.com/Veilen1/Veilen3D.git
cd Veilen3D

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Correr en desarrollo
npm run dev
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Iniciar en modo producción |
| `npm run lint` | Linter |

## Estructura

```
├── app/                  # Pages y API routes (App Router)
│   ├── admin/            # Panel de administración
│   ├── api/              # Endpoints REST
│   ├── login/            # Autenticación
│   └── ...
├── components/           # Componentes React
│   └── ui/               # shadcn/ui base components
├── hooks/                # Custom hooks (auth, cart)
├── lib/                  # Utilidades (MongoDB, auth, email)
├── types/                # TypeScript types
├── scripts/              # Scripts de BD (seed, admin)
└── public/               # Assets estáticos
```

## Licencia

Proyecto privado — Veilen3D © 2025
