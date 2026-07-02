// Runs at the end of the Vercel build (and via `npm run db:setup`).
// Creates the schema and seeds data using DATABASE_URL. Designed to NEVER fail
// the build: any error is logged and the process still exits 0.
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";
import { provisionAndSeed } from "../src/lib/db/provision";

async function main() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    console.warn(
      "[provision] DATABASE_URL not set — skipping DB provisioning. " +
        "Set it in your environment and redeploy, or call /api/setup."
    );
    return;
  }

  const db = drizzle(neon(url), { schema });
  const result = await provisionAndSeed(db);
  console.log(
    `[provision] OK — species: ${result.speciesCount}, ` +
      `admin: ${result.adminEmail} (${result.adminCreated ? "created" : "already existed"}), ` +
      `sample products: ${result.sampleProductsCreated}`
  );
}

main()
  .catch((err) => {
    // Never break the build on provisioning errors.
    console.warn(
      "[provision] skipped due to error:",
      err instanceof Error ? err.message : String(err)
    );
  })
  .finally(() => process.exit(0));
