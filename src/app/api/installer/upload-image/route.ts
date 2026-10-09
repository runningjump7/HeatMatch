import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('tradeev2_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const type = formData.get('type') as string; // 'cover' or 'logo'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!['cover', 'logo'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid image type (must be cover or logo)' },
        { status: 400 }
      );
    }

    // Validate file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Max 5MB.' },
        { status: 400 }
      );
    }

    // Get installer ID
    const userResult = await query(
      `SELECT installer_id FROM users WHERE id = $1`,
      [sessionCookie]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const installerId = userResult.rows[0].installer_id;

    // For now, store as base64 in database (Phase 5)
    // TODO: Integrate with Vercel Blob in Phase 5b
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Update installer with image URL
    const column = type === 'cover' ? 'cover_image_url' : 'logo_url';
    await query(
      `UPDATE installers SET ${column} = $1, updated_at = NOW() WHERE id = $2`,
      [dataUrl, installerId]
    );

    return NextResponse.json({
      success: true,
      message: `${type} image uploaded successfully`,
      url: dataUrl,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
