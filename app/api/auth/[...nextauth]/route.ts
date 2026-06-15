import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ message: 'GET auth/[...nextauth]' }); }
export async function POST() { return NextResponse.json({ message: 'POST auth/[...nextauth]' }); }
