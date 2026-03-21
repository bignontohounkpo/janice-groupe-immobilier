/**
 * Script d'import des propriétés MOCK vers Neon (Prisma)
 * Usage: pnpm import:properties
 */

import { PrismaClient } from "../src/generated/prisma"
import { MOCK_PROPERTIES } from "../src/lib/mockData"

const prisma = new PrismaClient()

async function importProperties() {
  console.log("📦 Importation des propriétés vers Neon...\n")

  let created = 0
  let skipped = 0
  let errors = 0

  for (const property of MOCK_PROPERTIES) {
    try {
      const existing = await prisma.property.findUnique({
        where: { slug: property.slug }
      })

      if (existing) {
        console.log(`⏭️  Skip: ${property.title} (déjà existant)`)
        skipped++
        continue
      }

      const { id, category, district, city, coordinates, ...data } = property as any

      await prisma.property.create({
        data: {
          ...data,
          lat: coordinates?.lat,
          lng: coordinates?.lng,
          city: city || "Cotonou",
          status: "active",
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.createdAt),
          category: category ? { connect: { slug: category } } : undefined,
          district: district ? {
            connectOrCreate: {
              where: { name_city: { name: district, city: city || "Cotonou" } },
              create: { name: district, city: city || "Cotonou" }
            }
          } : undefined,
        }
      })

      console.log(`✅ Created: ${property.title}`)
      created++
    } catch (error) {
      console.error(`❌ Error creating ${property.title}:`, error)
      errors++
    }
  }

  console.log("\n" + "=".repeat(50))
  console.log(`📊 Résumé:`)
  console.log(`   ✅ Créées: ${created}`)
  console.log(`   ⏭️  Ignorées: ${skipped}`)
  console.log(`   ❌ Erreurs: ${errors}`)
  console.log("=".repeat(50))
  console.log("\n✨ Import terminé!")
}

// Run
importProperties()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
