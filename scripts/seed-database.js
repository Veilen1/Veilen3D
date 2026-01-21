import { MongoClient } from "mongodb"
import seedData from "./seed-products.json" with { type: "json" }

// INSTRUCCIONES:
// 1. Agrega tu MONGODB_URI a las variables de entorno
// 2. Ejecuta este script para poblar la base de datos con productos de ejemplo
// 3. Puedes modificar seed-products.json para agregar más productos

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || "veilen3d"

async function seedDatabase() {
  try {
    console.log("Conectando a MongoDB Atlas...")
    const client = await MongoClient.connect(MONGODB_URI)
    const db = client.db(MONGODB_DB)

    console.log("Limpiando colección de productos...")
    await db.collection("products").deleteMany({})

    console.log("Insertando productos de ejemplo...")
    const productsWithDates = seedData.map((product) => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    const result = await db.collection("products").insertMany(productsWithDates)

    console.log(`✅ ${result.insertedCount} productos insertados exitosamente!`)

    await client.close()
    console.log("Conexión cerrada")
  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error)
    process.exit(1)
  }
}

seedDatabase()
