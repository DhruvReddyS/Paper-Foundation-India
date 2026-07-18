import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { glossaryData } from "@/content/glossary";
import { connectDB } from "@/lib/db";
import { Glossary } from "@/lib/models/Glossary";

const schema = z.object({
  term: z.string().min(1),
  definition: z.string().min(1),
  letter: z.string().length(1).transform(value => value.toUpperCase()),
  status: z.enum(["draft", "published"]).default("published"),
  order: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  if (!process.env.MONGODB_URI) {
    const items = Object.entries(glossaryData).flatMap(([letter, terms]) => terms.map((item, order) => ({ ...item, letter, order, status: "published" })));
    return NextResponse.json({ items, source: "editorial-manifest" });
  }
  await connectDB();
  const status = request.nextUrl.searchParams.get("status") ?? "published";
  const items = await Glossary.find(status === "all" ? {} : { status }).sort({ letter: 1, order: 1, term: 1 }).lean();
  return NextResponse.json({ items, source: "cms" });
}

export async function POST(request: NextRequest) {
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid glossary entry", issues: parsed.error.flatten() }, { status: 400 });
  await connectDB();
  return NextResponse.json({ item: await Glossary.create(parsed.data) }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const payload = await request.json();
  const parsed = schema.partial().safeParse(payload);
  if (!payload.id || !parsed.success) return NextResponse.json({ error: "Invalid glossary update" }, { status: 400 });
  await connectDB();
  const item = await Glossary.findByIdAndUpdate(payload.id, parsed.data, { new: true, runValidators: true });
  return item ? NextResponse.json({ item }) : NextResponse.json({ error: "Glossary entry not found" }, { status: 404 });
}

export async function DELETE(request: NextRequest) {
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing glossary id" }, { status: 400 });
  await connectDB();
  const item = await Glossary.findByIdAndDelete(id);
  return item ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: "Glossary entry not found" }, { status: 404 });
}
