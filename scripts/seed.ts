import { config } from "dotenv";
config({ path: ".env.local" });
config();

import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";
import { buildFullSpeciesList, ratingFor } from "../src/lib/species-data";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  const db = drizzle(neon(url), { schema });

  console.log("Seeding species...");
  const speciesList = buildFullSpeciesList();
  console.log(`  ${speciesList.length} species to insert`);

  // Insert in chunks; skip duplicates on latin name.
  const chunkSize = 100;
  for (let i = 0; i < speciesList.length; i += chunkSize) {
    const chunk = speciesList.slice(i, i + chunkSize).map((s) => ({
      latinName: s.latinName,
      nameEn: s.nameEn,
      nameHu: s.nameHu,
      category: s.category,
      rarity: s.rarity,
      rating: ratingFor(s),
    }));
    await db.insert(schema.species).values(chunk).onConflictDoNothing();
  }
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.species);
  console.log(`  species table now has ${count} rows`);

  // Head admin account
  const adminEmail = (process.env.ADMIN_EMAILS || "terrarisztika1@gmail.com")
    .split(",")[0]
    .trim()
    .toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "saurus-admin-2026";
  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(sql`lower(${schema.users.email}) = ${adminEmail}`);
  if (existing.length === 0) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.insert(schema.users).values({
      email: adminEmail,
      passwordHash,
      name: "Saurus Admin",
      role: "admin",
      coins: 100000,
    });
    console.log(`  created admin: ${adminEmail} / ${adminPassword}`);
  } else {
    await db
      .update(schema.users)
      .set({ role: "admin" })
      .where(sql`lower(${schema.users.email}) = ${adminEmail}`);
    console.log(`  admin already exists, ensured admin role: ${adminEmail}`);
  }

  // Sample products
  const [{ count: productCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.products);
  if (productCount === 0) {
    console.log("Seeding sample products...");
    await db.insert(schema.products).values([
      {
        slug: "exo-terra-terrarium-60",
        nameHu: "Exo Terra terrárium 60x45x45",
        nameEn: "Exo Terra Terrarium 60x45x45",
        descHu: "Prémium üvegterrárium trópusi és sivatagi fajokhoz.",
        descEn: "Premium glass terrarium for tropical and desert species.",
        category: "terrarium",
        priceHuf: 45990,
        stock: 8,
        active: true,
      },
      {
        slug: "uvb-lampa-10",
        nameHu: "UVB 10.0 fénycső",
        nameEn: "UVB 10.0 Bulb",
        descHu: "Sivatagi fajokhoz ajánlott UVB fényforrás.",
        descEn: "UVB light source recommended for desert species.",
        category: "equipment",
        priceHuf: 8990,
        stock: 25,
        active: true,
      },
      {
        slug: "kokusz-alom-9l",
        nameHu: "Kókusz alom 9L",
        nameEn: "Coconut Substrate 9L",
        descHu: "Természetes kókuszrost talaj a páratartalom fenntartásához.",
        descEn: "Natural coconut fibre substrate for maintaining humidity.",
        category: "substrate",
        priceHuf: 3490,
        stock: 40,
        active: true,
      },
      {
        slug: "cvrkek-tap-tucsok",
        nameHu: "Élő tücsök doboz (közepes)",
        nameEn: "Live Crickets Box (medium)",
        descHu: "Táplálékrovar leopárdgekkóknak és agámáknak.",
        descEn: "Feeder insects for leopard geckos and dragons.",
        category: "food",
        priceHuf: 1990,
        stock: 3,
        active: true,
      },
    ]);
    console.log("  4 sample products created");
  }

  console.log("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
