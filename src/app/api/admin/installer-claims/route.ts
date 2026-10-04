import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending'; // pending, approved, rejected, all
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build query based on status filter
    let statusFilter = '';
    const params: any[] = [];

    if (status !== 'all') {
      statusFilter = 'WHERE ic.status = $1';
      params.push(status);
    }

    // Fetch claims with installer details
    const claimsQuery = `
      SELECT
        ic.id,
        ic.installer_id,
        ic.email,
        ic.full_name,
        ic.status,
        ic.submitted_at,
        ic.reviewed_at,
        i.business_name,
        i.slug
      FROM installer_claims ic
      JOIN installers i ON ic.installer_id = i.id
      ${statusFilter}
      ORDER BY ic.submitted_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);

    const claimsResult = await query(claimsQuery, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM installer_claims ic';
    if (status !== 'all') {
      countQuery += ` WHERE ic.status = $1`;
    }

    const countParams = status !== 'all' ? [status] : [];
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return NextResponse.json(
      {
        success: true,
        claims: claimsResult.rows.map((row) => ({
          id: row.id,
          installer_id: row.installer_id,
          installer_name: row.business_name,
          slug: row.slug,
          email: row.email,
          full_name: row.full_name,
          status: row.status,
          submitted_at: row.submitted_at,
          reviewed_at: row.reviewed_at,
        })),
        total,
        page,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch claims' },
      { status: 500 }
    );
  }
}
