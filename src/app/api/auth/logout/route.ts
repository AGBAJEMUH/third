import { NextRequest, NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
    await removeAuthCookie();
    return NextResponse.json({ success: true });
}
