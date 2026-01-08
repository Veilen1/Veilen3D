import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Por favor agrega tu MONGODB_URI a las variables de entorno")
}

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "veilen3d"

// Opciones optimizadas para serverless (Vercel)
const options = {
  maxPoolSize: 10, // Máximo de conexiones en el pool
  minPoolSize: 1,  // Mínimo de conexiones mantenidas
  maxIdleTimeMS: 30000, // Cerrar conexiones inactivas después de 30s
  serverSelectionTimeoutMS: 5000, // Timeout para selección de servidor
  socketTimeoutMS: 45000, // Timeout de socket
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName)
}

export default clientPromise
