import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { overviewReport } from "@/lib/overview-report";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  return NextResponse.json(await overviewReport());
}
