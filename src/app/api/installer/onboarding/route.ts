import { query } from '@/src/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { business_name, phone, years_in_business, bio, primary_suburb, service_suburbs, images } = body;

    if (!business_name || !phone || years_in_business === null || !primary_suburb) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get installer ID from session
    const sessionResult = await query(
      `SELECT installer_id FROM sessions WHERE token = $1`,
      [sessionCookie.value]
    );

    if (sessionResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const installer_id = sessionResult.rows[0].installer_id;

    // Update installer profile
    await query(
      `UPDATE installers SET
        business_name = $1,
        phone = $2,
        years_in_business = $3,
        bio = $4,
        primary_suburb = $5,
        service_suburbs = $6,
        images = $7,
        profile_active = true,
        updated_at = NOW()
       WHERE id = $8`,
      [
        business_name,
        phone,
        years_in_business,
        bio,
        primary_suburb,
        service_suburbs,
        images,
        installer_id,
      ]
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return new Response(JSON.stringify({ error: 'Failed to complete onboarding' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
