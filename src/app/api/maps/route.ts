import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { mindMapQueries } from '@/lib/db/client';
import { mindMapSchema } from '@/lib/utils/validation';

// GET all mind maps for current user
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const maps = mindMapQueries.findByUserId.all(user.userId);
        return NextResponse.json({ maps });
    } catch (error: any) {
        console.error('Error fetching mind maps:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mind maps' },
            { status: 500 }
        );
    }
}

// POST create new mind map
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = mindMapSchema.parse(body);

        const result = mindMapQueries.create.run(
            user.userId,
            validatedData.title,
            validatedData.description || null,
            validatedData.data,
            validatedData.isPublic ? 1 : 0
        );

        return NextResponse.json({
            success: true,
            mapId: result.lastInsertRowid,
        });
    } catch (error: any) {
        console.error('Error creating mind map:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create mind map' },
            { status: 400 }
        );
    }
}
