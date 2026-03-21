import { PrismaClient } from "../src/generated/prisma";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { CATEGORY_LABELS } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("⏳ Seeding categories...");
  let cats = 0;
  for (const [slug, name] of Object.entries(CATEGORY_LABELS)) {
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    });
    cats++;
  }
  console.log(`✅ ${cats} Categories seeded.`);

  console.log("⏳ Seeding districts from JSON (this may take a minute)...");
  const dataPath = path.join(process.cwd(), "decoupage_territorial_benin.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const districtsToInsert = [];

  for (const dep of data) {
    for (const com of dep.communes) {
      const cityName = com.lib_com;
      for (const arr of com.arrondissements) {
        for (const quart of arr.quartiers) {
          const quartName = quart.lib_quart;
          districtsToInsert.push({
            name: quartName,
            city: cityName,
          });
        }
      }
    }
  }

  const chunkSize = 5000;
  let districtCount = 0;
  for (let i = 0; i < districtsToInsert.length; i += chunkSize) {
    const chunk = districtsToInsert.slice(i, i + chunkSize);
    await prisma.district.createMany({
      data: chunk,
      skipDuplicates: true, // Ignorer les conflits d'unicité
    });
    districtCount += chunk.length;
    console.log(`... Inserted ${districtCount} districts`);
  }

  console.log(`✅ successfully seeded ${districtCount} districts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
