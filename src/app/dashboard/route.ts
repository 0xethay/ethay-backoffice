import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect(new URL('/dashboard/seller', 'http://localhost:3000'));
} 