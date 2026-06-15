import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ message: 'GET inquiries' }); }
export async function POST() { return NextResponse.json({ message: 'POST inquiries' }); }
