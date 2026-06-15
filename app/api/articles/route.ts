import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ message: 'GET articles' }); }
export async function POST() { return NextResponse.json({ message: 'POST articles' }); }
