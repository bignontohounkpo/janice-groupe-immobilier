/**
 * Script de création du compte Admin
 * Usage: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from "../src/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const ADMIN_EMAIL = "admin@horizonbenin.com"
const ADMIN_PASSWORD = "Admin@2026!"
const ADMIN_NAME = "Admin Horizon"

async function createAdmin() {
  console.log("🔐 Création du compte administrateur...\n")

  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  })

  if (existing) {
    console.log(`⏭️  L'admin "${ADMIN_EMAIL}" existe déjà.`)
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

  console.log(`✅ Compte admin créé avec succès !`)
  console.log(`   📧 Email : ${user.email}`)
  console.log(`   🔑 Mot de passe : ${ADMIN_PASSWORD}`)
  console.log(`   👤 Nom : ${user.name}`)
  console.log(`\n⚠️  Change le mot de passe dès ta première connexion !`)
}

createAdmin()
  .catch((e) => {
    console.error("❌ Erreur :", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
