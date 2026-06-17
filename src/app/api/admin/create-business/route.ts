import { NextRequest, NextResponse } from 'next/server';
import { transaction } from '@/lib/db';
import { hashPassword, validateEmail, validatePassword } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get('tradeev2_session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      email,
      password,
      phone,
      business_name,
      business_number,
      suburb_primary,
      service_suburbs,
      photo_url,
      bio,
      years_in_business,
      images,
      profile_active,
    } = await request.json();

    if (!email || !password || !business_name) {
      return NextResponse.json(
        { error: 'Email, password, and business name are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join('; ') },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase();

    const result = await transaction(async (client) => {
      const adminResult = await client.query(
        `SELECT id FROM users WHERE id = $1 AND role = 'admin'`,
        [session]
      );

      if (!adminResult.rows.length) {
        throw new Error('UNAUTHORIZED');
      }

      const existingUser = await client.query(
        `SELECT id FROM users WHERE email = $1`,
        [emailLower]
      );

      if (existingUser.rows.length) {
        throw new Error('EMAIL_EXISTS');
      }

      const installerId = uuidv4();
      const userId = uuidv4();
      const passwordHash = await hashPassword(password);

      await client.query(
        `INSERT INTO installers (
          id,
          business_name,
          business_number,
          email,
          phone,
          suburb_primary,
          service_suburbs,
          photo_url,
          bio,
          approved,
          approved_at,
          years_in_business,
          profile_active,
          images,
          created_at,
          updated_at
        )
         VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, true, CURRENT_TIMESTAMP,
          $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
         )`,
        [
          installerId,
          business_name,
          business_number || null,
          emailLower,
          phone || null,
          suburb_primary || null,
          Array.isArray(service_suburbs) ? service_suburbs : [],
          photo_url || null,
          bio || null,
          years_in_business || null,
          Boolean(profile_active),
          Array.isArray(images) ? images : [],
        ]
      );

      await client.query(
        `INSERT INTO users (
          id,
          email,
          password_hash,
          role,
          installer_id,
          created_at,
          updated_at
        )
         VALUES ($1, $2, $3, 'installer', $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [userId, emailLower, passwordHash, installerId]
      );

      return { installerId, userId };
    });

    return NextResponse.json(
      {
        success: true,
        installerId: result.installerId,
        userId: result.userId,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      if (error.message === 'EMAIL_EXISTS') {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }
    }

    console.error('Error creating business:', error);
    return NextResponse.json({ error: 'Failed to create business' }, { status: 500 });
  }
}