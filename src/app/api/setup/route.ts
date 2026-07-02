import { NextRequest, NextResponse } from "next/server";
import { runSetup } from "@/lib/db/setup";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// One-time (idempotent) database setup endpoint.
//
// Protect it with the SETUP_SECRET env var, then call once after deploy:
//   https://<your-app>.vercel.app/api/setup?key=YOUR_SETUP_SECRET
//
// It creates the schema (IF NOT EXISTS), seeds the 543 collectible species,
// the head-admin account and sample products. Safe to run repeatedly.
async function handle(req: NextRequest) {
  const secret = process.env.SETUP_SECRET;
  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "SETUP_SECRET is not configured. Set it in your environment variables first.",
      },
      { status: 500 }
    );
  }

  const key =
    req.nextUrl.searchParams.get("key") ??
    req.headers.get("x-setup-key") ??
    "";
  if (key !== secret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized: invalid or missing key." },
      { status: 401 }
    );
  }

  try {
    const result = await runSetup();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
