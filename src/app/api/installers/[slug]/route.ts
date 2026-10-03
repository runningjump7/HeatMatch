import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const VALID_LANGUAGES = ['en', 'zh-cn', 'zh-tw'];
const DEFAULT_LANGUAGE = 'en';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    const lang = (request.nextUrl.searchParams.get('lang') || DEFAULT_LANGUAGE).toLowerCase();

    // Validate language
    if (!VALID_LANGUAGES.includes(lang)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported language. Use: en, zh-cn, zh-tw' },
        { status: 400 }
      );
    }

    // Get installer by slug
    const installerResult = await query(
      `SELECT id, slug, business_name, bio, photo_url, clerk_user_id, email, phone,
              business_number, suburb_primary, service_suburbs, years_in_business,
              status, verified_at, created_at, updated_at, profile_active
       FROM installers
       WHERE slug = $1`,
      [slug]
    );

    if (installerResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Installer not found' },
        { status: 404 }
      );
    }

    const installer = installerResult.rows[0];

    // Get translations with fallback order
    const translationsResult = await query(
      `SELECT language, business_name, bio
       FROM installer_translations
       WHERE installer_id = $1
       ORDER BY
         CASE WHEN language = $2 THEN 0
              WHEN language = 'zh-tw' THEN 1
              WHEN language = 'zh-cn' THEN 2
              WHEN language = 'en' THEN 3
              ELSE 4 END`,
      [installer.id, lang]
    );

    // Get translated field with fallback
    const getTranslatedField = (field: 'business_name' | 'bio') => {
      // Try in order: requested lang, zh-tw, zh-cn, en
      const langs = lang === 'en' ? ['en'] : [lang, 'zh-tw', 'zh-cn', 'en'];

      for (const l of langs) {
        const translation = translationsResult.rows.find((t: any) => t.language === l);
        if (translation && translation[field]) {
          return translation[field];
        }
      }

      return null;
    };

    const businessName = getTranslatedField('business_name') || installer.business_name;
    const bio = getTranslatedField('bio') || installer.bio;

    // Determine which languages were tried for fallback
    const fallbackLangs = lang === 'en' ? ['en'] : [lang, 'zh-tw', 'zh-cn', 'en'];

    return NextResponse.json(
      {
        success: true,
        data: {
          id: installer.id,
          slug: installer.slug,
          businessName,
          bio,
          photoUrl: installer.photo_url,
          clerkUserId: installer.clerk_user_id,
          email: installer.email,
          phone: installer.phone,
          businessNumber: installer.business_number,
          suburb: installer.suburb_primary,
          serviceSuburbs: installer.service_suburbs || [],
          yearsInBusiness: installer.years_in_business,
          status: installer.status,
          verifiedAt: installer.verified_at,
          createdAt: installer.created_at,
          updatedAt: installer.updated_at,
          profileActive: installer.profile_active,
          language: lang,
          fallbackLangs,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=600',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error getting installer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get installer' },
      { status: 500 }
    );
  }
}
