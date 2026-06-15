import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ message: 'GET newsroom' }); }
export async function POST() { return NextResponse.json({ message: 'POST newsroom' }); }
