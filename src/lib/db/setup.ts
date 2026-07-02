import "server-only";
import { getDb } from "./index";
import { provisionAndSeed, type ProvisionResult } from "./provision";

export type SetupResult = ProvisionResult;

export async function runSetup(): Promise<SetupResult> {
  return provisionAndSeed(getDb());
}
