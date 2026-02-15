import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { mindMapQueries } from '@/lib/db/client';
import { mindMapSchema } from '@/lib/utils/validation';

// GET specific mind map
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const map = await mindMapQueries.findById(id) as any;

        if (!map) {
            return NextResponse.json({ error: 'Mind map not found' }, { status: 404 });
        }

        // Check if user has access
        if (map.user_id !== user.userId && !map.is_public) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({ map });
    } catch (error: any) {
        console.error('Error fetching mind map:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mind map' },
            { status: 500 }
        );
    }
}

// PUT update mind map
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const validatedData = mindMapSchema.parse(body);

        const result = await mindMapQueries.update(
            validatedData.title,
            validatedData.description || null,
            validatedData.data,
            id,
            user.userId
        );

        if (result.changes === 0) {
            return NextResponse.json(
                { error: 'Mind map not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating mind map:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update mind map' },
            { status: 400 }
        );
    }
}

// DELETE mind map
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const result = await mindMapQueries.delete(id, user.userId);

        if (result.changes === 0) {
            return NextResponse.json(
                { error: 'Mind map not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting mind map:', error);
        return NextResponse.json(
            { error: 'Failed to delete mind map' },
            { status: 500 }
        );
    }
}
