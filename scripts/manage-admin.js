// Script para gestionar administradores
// Uso:
//   node scripts/manage-admin.js add usuario@email.com
//   node scripts/manage-admin.js remove usuario@email.com
//   node scripts/manage-admin.js list

import { MongoClient } from "mongodb"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "veilen3d"

if (!uri) {
  console.error("❌ MONGODB_URI no está definido en .env.local")
  process.exit(1)
}

const [, , action, email] = process.argv

async function main() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(dbName)
    const users = db.collection("users")

    switch (action) {
      case "add": {
        if (!email) {
          console.error("❌ Debes proporcionar un email: node scripts/manage-admin.js add usuario@email.com")
          break
        }
        const result = await users.updateOne(
          { email: email.toLowerCase() },
          { $set: { isAdmin: true, updatedAt: new Date() } }
        )
        if (result.matchedCount === 0) {
          console.error(`❌ Usuario con email "${email}" no encontrado`)
        } else {
          console.log(`✅ Usuario "${email}" ahora es administrador`)
        }
        break
      }

      case "remove": {
        if (!email) {
          console.error("❌ Debes proporcionar un email: node scripts/manage-admin.js remove usuario@email.com")
          break
        }
        const result = await users.updateOne(
          { email: email.toLowerCase() },
          { $set: { isAdmin: false, updatedAt: new Date() } }
        )
        if (result.matchedCount === 0) {
          console.error(`❌ Usuario con email "${email}" no encontrado`)
        } else {
          console.log(`✅ Usuario "${email}" ya no es administrador`)
        }
        break
      }

      case "list": {
        const admins = await users.find({ isAdmin: true }).toArray()
        if (admins.length === 0) {
          console.log("📋 No hay administradores registrados")
        } else {
          console.log(`📋 Administradores (${admins.length}):`)
          admins.forEach((admin) => {
            console.log(`   - ${admin.name} <${admin.email}>`)
          })
        }
        break
      }

      case "list-all": {
        const allUsers = await users.find({}).toArray()
        if (allUsers.length === 0) {
          console.log("📋 No hay usuarios registrados")
        } else {
          console.log(`📋 Todos los usuarios (${allUsers.length}):`)
          allUsers.forEach((user) => {
            const role = user.isAdmin ? "👑 Admin" : "👤 Usuario"
            console.log(`   ${role} - ${user.name} <${user.email}>`)
          })
        }
        break
      }

      default:
        console.log(`
📌 Gestión de Administradores
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Comandos disponibles:

  node scripts/manage-admin.js add <email>      Hacer admin a un usuario
  node scripts/manage-admin.js remove <email>   Quitar admin a un usuario  
  node scripts/manage-admin.js list             Listar todos los admins
  node scripts/manage-admin.js list-all         Listar todos los usuarios
        `)
    }
  } catch (error) {
    console.error("❌ Error:", error.message)
  } finally {
    await client.close()
  }
}

main()
