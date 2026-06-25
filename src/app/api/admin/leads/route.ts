import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession, isAdminAuthenticated } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    // Check auth
    const session = await getAdminSession();
    if (!isAdminAuthenticated(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const suburb = searchParams.get('suburb');
    const service_type = searchParams.get('service_type');
    const tier = searchParams.get('tier');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (status && status !== 'all') {
      conditions.push(`status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    if (suburb) {
      conditions.push(`suburb ILIKE $${paramCount}`);
      params.push(`%${suburb}%`);
      paramCount++;
    }

    if (service_type) {
      conditions.push(`service_type = $${paramCount}`);
      params.push(service_type);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM leads ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Get paginated leads
    params.push(limit);
    params.push(offset);
    const leadsResult = await query(
      `SELECT
        id,
        homeowner_name,
        email,
        phone,
        suburb,
        service_type,
        timeline,
        status,
        (photos IS NOT NULL AND array_length(photos, 1) > 0) as has_photos,
        created_at,
        assigned_installers
      FROM leads
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      params
    );

    // Calculate tier for each lead
    const leadsWithTier = leadsResult.rows.map((lead: any) => {
      const qualityScore =
        (lead.has_photos ? 25 : 0) +
        (lead.service_type === 'new_install' || lead.service_type === 'replace' ? 30 : 15) +
        (lead.timeline === 'asap' ? 30 : lead.timeline === 'two_weeks' ? 20 : 10) +
        10;
      const tierClass = qualityScore >= 80 ? 'A' : qualityScore >= 50 ? 'B' : 'C';
      return { ...lead, tier: tierClass, qualityScore };
    });

    // Filter by tier if specified
    let filteredLeads = leadsWithTier;
    if (tier && tier !== 'all') {
      filteredLeads = leadsWithTier.filter((lead: any) => lead.tier === tier);
    }

    return NextResponse.json({
      leads: filteredLeads,
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
