import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("user"), // 'user' | 'admin'
  coins: integer("coins").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  nameHu: varchar("name_hu", { length: 200 }).notNull(),
  nameEn: varchar("name_en", { length: 200 }).notNull(),
  descHu: text("desc_hu").notNull().default(""),
  descEn: text("desc_en").notNull().default(""),
  category: varchar("category", { length: 60 }).notNull().default("other"),
  priceHuf: integer("price_huf").notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url").notNull().default(""),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  change: integer("change").notNull(), // + receipt, - sale/correction
  type: varchar("type", { length: 20 }).notNull(), // 'receipt' | 'sale' | 'adjustment'
  note: text("note").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  // 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  totalHuf: integer("total_huf").notNull(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull().default(""),
  zip: varchar("zip", { length: 20 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  address: text("address").notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull(), // 'transfer' | 'cod' | 'card'
  coinsAwarded: boolean("coins_awarded").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  nameHu: varchar("name_hu", { length: 200 }).notNull(),
  nameEn: varchar("name_en", { length: 200 }).notNull(),
  priceHuf: integer("price_huf").notNull(),
  quantity: integer("quantity").notNull(),
});

export const animals = pgTable("animals", {
  id: serial("id").primaryKey(),
  nameHu: varchar("name_hu", { length: 200 }).notNull(),
  nameEn: varchar("name_en", { length: 200 }).notNull(),
  latinName: varchar("latin_name", { length: 200 }).notNull().default(""),
  descHu: text("desc_hu").notNull().default(""),
  descEn: text("desc_en").notNull().default(""),
  sex: varchar("sex", { length: 20 }).notNull().default("unknown"), // 'male' | 'female' | 'unknown'
  birthYear: integer("birth_year"),
  imageUrl: text("image_url").notNull().default(""),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  titleHu: varchar("title_hu", { length: 250 }).notNull(),
  titleEn: varchar("title_en", { length: 250 }).notNull(),
  excerptHu: text("excerpt_hu").notNull().default(""),
  excerptEn: text("excerpt_en").notNull().default(""),
  contentHu: text("content_hu").notNull().default(""),
  contentEn: text("content_en").notNull().default(""),
  category: varchar("category", { length: 60 }).notNull().default("care"),
  imageUrl: text("image_url").notNull().default(""),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Collectible species for the SaurusCoin pack (gacha) system
export const species = pgTable("species", {
  id: serial("id").primaryKey(),
  nameEn: varchar("name_en", { length: 200 }).notNull(),
  nameHu: varchar("name_hu", { length: 200 }).notNull(),
  latinName: varchar("latin_name", { length: 200 }).notNull().unique(),
  category: varchar("category", { length: 40 }).notNull(), // snake, lizard, gecko, turtle, amphibian, invertebrate, crocodilian
  rarity: varchar("rarity", { length: 20 }).notNull(), // 'common' | 'rare' | 'epic' | 'legendary'
  rating: integer("rating").notNull(), // 1-100 unique-ish score
});

export const userSpecies = pgTable(
  "user_species",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    speciesId: integer("species_id")
      .notNull()
      .references(() => species.id, { onDelete: "cascade" }),
    count: integer("count").notNull().default(1),
    firstObtainedAt: timestamp("first_obtained_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("user_species_unique").on(t.userId, t.speciesId)]
);

export const coinTransactions = pgTable("coin_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // + earn, - spend
  reason: varchar("reason", { length: 120 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Animal = typeof animals.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Species = typeof species.$inferSelect;
export type UserSpeciesRow = typeof userSpecies.$inferSelect;
