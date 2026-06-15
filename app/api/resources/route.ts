import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ message: 'GET resources' }); }
export async function POST() { return NextResponse.json({ message: 'POST resources' }); }
