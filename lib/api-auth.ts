import { NextResponse } from "next/server";
import { canManageContent } from "@/lib/auth";

export async function requireAdmin() {
  return await canManageContent()
    ? null
    : NextResponse.json({ error: "Admin access required" }, { status: 401 });
}
