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
        property_type,
        heat_pumps_needed,
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

    // Calculate tier for each lead based on job size
    const leadsWithTier = leadsResult.rows.map((lead: any) => {
      const isCommercial = ['office', 'commercial'].includes(lead.property_type);
      const heatsUnits = parseInt(lead.heat_pumps_needed) || 0;
      const isInstallOrReplace = ['new_install', 'replace'].includes(lead.service_type);
      const isService = lead.service_type === 'service';

      let tierClass = 'C';

      // Tier A: Installation/Replace + 3+ units
      if (isInstallOrReplace && heatsUnits >= 3) {
        tierClass = 'A';
      }
      // Tier B: Installation/Replace + 1-2 units, OR Service + 3+ units, OR Commercial Service
      else if (
        (isInstallOrReplace && heatsUnits >= 1 && heatsUnits <= 2) ||
        (isService && heatsUnits >= 3) ||
        (isService && isCommercial)
      ) {
        tierClass = 'B';
      }
      // Tier C: Service/Advice with 1-2 units residential (default)

      return { ...lead, tier: tierClass };
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
