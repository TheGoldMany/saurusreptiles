CREATE TABLE "animals" (
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
);
--> statement-breakpoint
CREATE TABLE "articles" (
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
);
--> statement-breakpoint
CREATE TABLE "coin_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"reason" varchar(120) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"name_hu" varchar(200) NOT NULL,
	"name_en" varchar(200) NOT NULL,
	"price_huf" integer NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
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
);
--> statement-breakpoint
CREATE TABLE "products" (
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
);
--> statement-breakpoint
CREATE TABLE "species" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_en" varchar(200) NOT NULL,
	"name_hu" varchar(200) NOT NULL,
	"latin_name" varchar(200) NOT NULL,
	"category" varchar(40) NOT NULL,
	"rarity" varchar(20) NOT NULL,
	"rating" integer NOT NULL,
	CONSTRAINT "species_latin_name_unique" UNIQUE("latin_name")
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"change" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_species" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"species_id" integer NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"first_obtained_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(120) NOT NULL,
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"coins" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "coin_transactions" ADD CONSTRAINT "coin_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_species" ADD CONSTRAINT "user_species_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_species" ADD CONSTRAINT "user_species_species_id_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_species_unique" ON "user_species" USING btree ("user_id","species_id");