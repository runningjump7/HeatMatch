import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const VALID_LANGUAGES = ['en', 'zh-cn', 'zh-tw'];
const DEFAULT_LANGUAGE = 'en';
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

interface Installer {
  id: string;
  slug: string;
  business_name: string;
  bio: string | null;
  photo_url: string | null;
  suburb_primary: string;
  service_suburbs: string[];
  phone: string;
  email: string;
  years_in_business: number | null;
  status: string;
  verified_at: string | null;
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get('page') || '1', 10));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || DEFAULT_LIMIT.toString(), 10))
    );
    const suburb = request.nextUrl.searchParams.get('suburb')?.trim() || null;
    const lang = (request.nextUrl.searchParams.get('lang') || DEFAULT_LANGUAGE).toLowerCase();
    const status = request.nextUrl.searchParams.get('status');

    // Validate language
    if (!VALID_LANGUAGES.includes(lang)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported language. Use: en, zh-cn, zh-tw' },
        { status: 400 }
      );
    }

    // Validate page
    if (page < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid page number. Must be >= 1' },
        { status: 400 }
      );
    }

    // Validate status filter
    if (status && !['verified', 'unclaimed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status must be 'verified', 'unclaimed', or null" },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Build query with optional filters
    let whereConditions = ['i.profile_active = true'];
    const params: any[] = [];

    // Add suburb filter (matches primary suburb OR service suburbs)
    if (suburb) {
      const suburbPattern = `%${suburb}%`;
      whereConditions.push(
        `(i.suburb_primary ILIKE $${params.length + 1} OR EXISTS (
          SELECT 1 FROM unnest(COALESCE(i.service_suburbs, ARRAY[]::TEXT[])) AS service_suburb
          WHERE service_suburb ILIKE $${params.length + 1}
        ))`
      );
      params.push(suburbPattern);
    }

    // Add status filter
    if (status) {
      whereConditions.push(`i.status = $${params.length + 1}`);
      params.push(status);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM installers i ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(total / limit);

    // Get paginated installers
    const installersResult = await query(
      `SELECT i.id, i.slug, i.business_name, i.bio, i.photo_url, i.suburb_primary,
              i.service_suburbs, i.phone, i.email, i.years_in_business, i.status, i.verified_at
       FROM installers i
       ${whereClause}
       ORDER BY i.years_in_business DESC NULLS LAST, i.business_name ASC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    const installers: Installer[] = installersResult.rows;

    // Get translations for the requested language (with fallback)
    const installerIds = installers.map((i) => i.id);
    const translationsResult = await query(
      `SELECT installer_id, language, business_name, bio
       FROM installer_translations
       WHERE installer_id = ANY($1)
       ORDER BY
         CASE WHEN language = $2 THEN 0
              WHEN language = 'zh-tw' THEN 1
              WHEN language = 'zh-cn' THEN 2
              WHEN language = 'en' THEN 3
              ELSE 4 END,
         language ASC`,
      [installerIds, lang]
    );

    // Build translation map
    const translationMap = new Map<string, Map<string, string>>();
    for (const t of translationsResult.rows) {
      if (!translationMap.has(t.installer_id)) {
        translationMap.set(t.installer_id, new Map());
      }
      translationMap.get(t.installer_id)!.set(t.language, JSON.stringify({ business_name: t.business_name, bio: t.bio }));
    }

    // Apply translations with fallback
    const getTranslation = (installerId: string, field: 'business_name' | 'bio') => {
      const translations = translationMap.get(installerId);
      if (!translations) return null;

      // Try in order: requested lang, zh-tw, zh-cn, en
      const langs = lang === 'en' ? ['en'] : [lang, 'zh-tw', 'zh-cn', 'en'];
      for (const l of langs) {
        const data = translations.get(l);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed[field]) return parsed[field];
        }
      }
      return null;
    };

    const formattedInstallers = installers.map((installer) => ({
      id: installer.id,
      slug: installer.slug,
      businessName: getTranslation(installer.id, 'business_name') || installer.business_name,
      bio: getTranslation(installer.id, 'bio') || installer.bio,
      photoUrl: installer.photo_url,
      suburb: installer.suburb_primary,
      serviceSuburbs: installer.service_suburbs || [],
      phone: installer.phone,
      email: installer.email,
      yearsInBusiness: installer.years_in_business,
      status: installer.status,
      verifiedAt: installer.verified_at,
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          installers: formattedInstallers,
          pagination: {
            page,
            limit,
            total,
            pages: totalPages,
          },
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error listing installers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list installers' },
      { status: 500 }
    );
  }
}
