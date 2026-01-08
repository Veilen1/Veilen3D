// Script para crear índices en MongoDB
// Ejecutar con: node scripts/setup-indexes.js

import { MongoClient } from "mongodb"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

async function setupIndexes() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || "veilen3d"

  if (!uri) {
    console.error("❌ MONGODB_URI no está definido en .env.local")
    process.exit(1)
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Conectado a MongoDB")

    const db = client.db(dbName)
    
    // ========== ÍNDICES DE USUARIOS ==========
    const users = db.collection("users")
    await users.createIndex({ email: 1 }, { unique: true })
    console.log("✅ Índice único creado en users.email")

    // ========== ÍNDICES DE PRODUCTOS ==========
    const products = db.collection("products")
    
    // Índice para ordenar por featured y fecha (query principal)
    await products.createIndex({ featured: -1, createdAt: -1 })
    console.log("✅ Índice creado en products.featured + createdAt")
    
    // Índice para filtrar por categoría
    await products.createIndex({ category: 1 })
    console.log("✅ Índice creado en products.category")
    
    // Índice para búsqueda por nombre (texto)
    await products.createIndex({ name: "text", description: "text" })
    console.log("✅ Índice de texto creado en products.name + description")

    // ========== MOSTRAR ÍNDICES ==========
    console.log("\n📋 Índices actuales:")
    
    const userIndexes = await users.indexes()
    console.log("\n  USERS:")
    userIndexes.forEach((idx) => {
      console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}${idx.unique ? " (unique)" : ""}`)
    })
    
    const productIndexes = await products.indexes()
    console.log("\n  PRODUCTS:")
    productIndexes.forEach((idx) => {
      console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`)
    })

  } catch (error) {
    if (error.code === 11000 || error.codeName === "DuplicateKey") {
      console.log("⚠️  Algunos índices ya existen")
    } else if (error.code === 85) {
      console.log("⚠️  Índice de texto ya existe")
    } else {
      console.error("❌ Error:", error.message)
    }
  } finally {
    await client.close()
    console.log("\n🔌 Conexión cerrada")
  }
}

setupIndexes()
