import "server-only";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { getDb } from "./index";
import { products, species, users } from "./schema";
import { buildFullSpeciesList, ratingFor } from "../species-data";
import { adminEmails } from "../auth";

// Idempotent DDL — safe to run repeatedly. Mirrors drizzle/0000_*.sql but with
// IF NOT EXISTS guards so it can run from a serverless setup endpoint.
const DDL: string[] = [
  `CREATE TABLE IF NOT EXISTS "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "email" varchar(255) NOT NULL,
    "password_hash" text NOT NULL,
    "name" varchar(120) NOT NULL,
    "role" varchar(20) DEFAULT 'user' NOT NULL,
    "coins" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "users_email_unique" UNIQUE("email")
  )`,
  `CREATE TABLE IF NOT EXISTS "products" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar(160) NOT NULL,
    "name_hu" varchar(200) NOT NULL,
    "name_en" varchar(200) NOT NULL,
    "desc_hu" text DEFAULT '' NOT NULL,
    "desc_en" text DEFAULT '' NOT NULL,
    "category" varchar(60) DEFAULT 'other' NOT NULL,
    "price_huf" integer NOT NULL,
    "stock" integer DEFAULT 0 NOT NULL,
    "image_url" text DEFAULT '' NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "products_slug_unique" UNIQUE("slug")
  )`,
  `CREATE TABLE IF NOT EXISTS "stock_movements" (
    "id" serial PRIMARY KEY NOT NULL,
    "product_id" integer NOT NULL,
    "change" integer NOT NULL,
    "type" varchar(20) NOT NULL,
    "note" text DEFAULT '' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "orders" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL,
    "status" varchar(20) DEFAULT 'pending' NOT NULL,
    "total_huf" integer NOT NULL,
    "customer_name" varchar(120) NOT NULL,
    "email" varchar(255) NOT NULL,
    "phone" varchar(40) DEFAULT '' NOT NULL,
    "zip" varchar(20) NOT NULL,
    "city" varchar(120) NOT NULL,
    "address" text NOT NULL,
    "payment_method" varchar(30) NOT NULL,
    "coins_awarded" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "order_items" (
    "id" serial PRIMARY KEY NOT NULL,
    "order_id" integer NOT NULL,
    "product_id" integer NOT NULL,
    "name_hu" varchar(200) NOT NULL,
    "name_en" varchar(200) NOT NULL,
    "price_huf" integer NOT NULL,
    "quantity" integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "animals" (
    "id" serial PRIMARY KEY NOT NULL,
    "name_hu" varchar(200) NOT NULL,
    "name_en" varchar(200) NOT NULL,
    "latin_name" varchar(200) DEFAULT '' NOT NULL,
    "desc_hu" text DEFAULT '' NOT NULL,
    "desc_en" text DEFAULT '' NOT NULL,
    "sex" varchar(20) DEFAULT 'unknown' NOT NULL,
    "birth_year" integer,
    "image_url" text DEFAULT '' NOT NULL,
    "visible" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "articles" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar(160) NOT NULL,
    "title_hu" varchar(250) NOT NULL,
    "title_en" varchar(250) NOT NULL,
    "excerpt_hu" text DEFAULT '' NOT NULL,
    "excerpt_en" text DEFAULT '' NOT NULL,
    "content_hu" text DEFAULT '' NOT NULL,
    "content_en" text DEFAULT '' NOT NULL,
    "category" varchar(60) DEFAULT 'care' NOT NULL,
    "image_url" text DEFAULT '' NOT NULL,
    "published" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "articles_slug_unique" UNIQUE("slug")
  )`,
  `CREATE TABLE IF NOT EXISTS "species" (
    "id" serial PRIMARY KEY NOT NULL,
    "name_en" varchar(200) NOT NULL,
    "name_hu" varchar(200) NOT NULL,
    "latin_name" varchar(200) NOT NULL,
    "category" varchar(40) NOT NULL,
    "rarity" varchar(20) NOT NULL,
    "rating" integer NOT NULL,
    CONSTRAINT "species_latin_name_unique" UNIQUE("latin_name")
  )`,
  `CREATE TABLE IF NOT EXISTS "user_species" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL,
    "species_id" integer NOT NULL,
    "count" integer DEFAULT 1 NOT NULL,
    "first_obtained_at" timestamp DEFAULT now() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "coin_transactions" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL,
    "amount" integer NOT NULL,
    "reason" varchar(120) NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "user_species_unique" ON "user_species" USING btree ("user_id","species_id")`,
];

// Foreign keys wrapped so re-running is a no-op (ADD CONSTRAINT has no IF NOT
// EXISTS in Postgres).
const FKS: { name: string; ddl: string }[] = [
  {
    name: "coin_transactions_user_id_users_id_fk",
    ddl: `ALTER TABLE "coin_transactions" ADD CONSTRAINT "coin_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade`,
  },
  {
    name: "order_items_order_id_orders_id_fk",
    ddl: `ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade`,
  },
  {
    name: "order_items_product_id_products_id_fk",
    ddl: `ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id")`,
  },
  {
    name: "orders_user_id_users_id_fk",
    ddl: `ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")`,
  },
  {
    name: "stock_movements_product_id_products_id_fk",
    ddl: `ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade`,
  },
  {
    name: "user_species_user_id_users_id_fk",
    ddl: `ALTER TABLE "user_species" ADD CONSTRAINT "user_species_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade`,
  },
  {
    name: "user_species_species_id_species_id_fk",
    ddl: `ALTER TABLE "user_species" ADD CONSTRAINT "user_species_species_id_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE cascade`,
  },
];

export type SetupResult = {
  createdTables: boolean;
  speciesCount: number;
  adminEmail: string;
  adminCreated: boolean;
  sampleProductsCreated: number;
};

export async function runSetup(): Promise<SetupResult> {
  const db = getDb();

  for (const stmt of DDL) {
    await db.execute(sql.raw(stmt));
  }
  for (const fk of FKS) {
    await db.execute(
      sql.raw(
        `DO $$ BEGIN ${fk.ddl}; EXCEPTION WHEN duplicate_object THEN null; WHEN duplicate_table THEN null; END $$;`
      )
    );
  }

  // Seed species (idempotent on latin_name)
  const speciesList = buildFullSpeciesList();
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
    await db.insert(species).values(chunk).onConflictDoNothing();
  }
  const [{ count: speciesCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(species);

  // Head admin
  const adminEmail = adminEmails()[0] ?? "terrarisztika1@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "saurus-admin-2026";
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`lower(${users.email}) = ${adminEmail}`);
  let adminCreated = false;
  if (existing.length === 0) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.insert(users).values({
      email: adminEmail,
      passwordHash,
      name: "Saurus Admin",
      role: "admin",
      coins: 100000,
    });
    adminCreated = true;
  } else {
    await db
      .update(users)
      .set({ role: "admin" })
      .where(sql`lower(${users.email}) = ${adminEmail}`);
  }

  // Sample products (only if the catalog is empty)
  const [{ count: productCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);
  let sampleProductsCreated = 0;
  if (productCount === 0) {
    const samples = [
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
        slug: "elo-tucsok-kozepes",
        nameHu: "Élő tücsök doboz (közepes)",
        nameEn: "Live Crickets Box (medium)",
        descHu: "Táplálékrovar leopárdgekkóknak és agámáknak.",
        descEn: "Feeder insects for leopard geckos and dragons.",
        category: "food",
        priceHuf: 1990,
        stock: 3,
        active: true,
      },
    ];
    await db.insert(products).values(samples).onConflictDoNothing();
    sampleProductsCreated = samples.length;
  }

  return {
    createdTables: true,
    speciesCount,
    adminEmail,
    adminCreated,
    sampleProductsCreated,
  };
}
