import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userQueries } from '@/lib/db/client';
import { signToken, setAuthCookie } from '@/lib/auth/jwt';
import { registerSchema } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await userQueries.findByEmail(validatedData.email) as any;
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(validatedData.password, 10);

        // Create user
        const result = await userQueries.create(
            validatedData.email,
            passwordHash,
            validatedData.name
        );

        // Generate JWT
        const token = signToken({
            userId: Number(result.lastInsertRowid),
            email: validatedData.email,
            name: validatedData.name,
        });

        // Set cookie
        await setAuthCookie(token);

        return NextResponse.json({
            success: true,
            user: {
                id: Number(result.lastInsertRowid),
                email: validatedData.email,
                name: validatedData.name,
            },
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: error.message || 'Registration failed' },
            { status: 400 }
        );
    }
}
