import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('tradeev2_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user and installer data
    const userResult = await query(
      `SELECT id, email, installer_id FROM users WHERE id = $1`,
      [sessionCookie]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    const installerResult = await query(
      `SELECT
        id, business_name, email, phone, website, description,
        cover_image_url, logo_url,
        service_installation, service_maintenance, service_repairs,
        slug, verified_at, status
       FROM installers WHERE id = $1`,
      [user.installer_id]
    );

    if (installerResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Installer profile not found' },
        { status: 404 }
      );
    }

    const installer = installerResult.rows[0];

    return NextResponse.json({
      installer_id: installer.id,
      business_name: installer.business_name,
      email: user.email,
      phone: installer.phone,
      website: installer.website,
      description: installer.description,
      cover_image_url: installer.cover_image_url,
      logo_url: installer.logo_url,
      services: {
        installation: installer.service_installation,
        maintenance: installer.service_maintenance,
        repairs: installer.service_repairs,
      },
      slug: installer.slug,
      verified_at: installer.verified_at,
      status: installer.status,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('tradeev2_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { phone, website, description, services } = await request.json();

    // Get user
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

    // Validate inputs
    if (description && description.length > 500) {
      return NextResponse.json(
        { error: 'Description must be 500 characters or less' },
        { status: 400 }
      );
    }

    if (website && !isValidUrl(website)) {
      return NextResponse.json(
        { error: 'Invalid website URL' },
        { status: 400 }
      );
    }

    // Update installer
    await query(
      `UPDATE installers SET
        phone = $1,
        website = $2,
        description = $3,
        service_installation = $4,
        service_maintenance = $5,
        service_repairs = $6,
        updated_at = NOW()
       WHERE id = $7`,
      [
        phone || null,
        website || null,
        description || null,
        services?.installation ?? true,
        services?.maintenance ?? false,
        services?.repairs ?? false,
        installerId,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function isValidUrl(url: string): boolean {
  try {
    // Handle URLs without protocol
    const urlToTest = url.startsWith('http') ? url : `https://${url}`;
    new URL(urlToTest);
    return true;
  } catch {
    return false;
  }
}
