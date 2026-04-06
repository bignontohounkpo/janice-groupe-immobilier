/**
 * Script de création du compte Admin
 * Usage: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from "../src/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin"

async function createAdmin() {
  console.log("Création du compte administrateur...\n")

  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  })

  if (existing) {
    console.log(`L'admin "${ADMIN_EMAIL}" existe déjà.`)
    return
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)

  const user = await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: ADMIN_NAME,
      role: "admin",
    },
  })

  console.log(`Compte admin créé avec succès !`)
}

createAdmin()
  .catch((e) => {
    console.error("Erreur :", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
