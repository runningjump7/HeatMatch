import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession, isAdminAuthenticated } from '@/lib/adminAuth';
import { signToken } from '@/lib/jwt';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { lead_id, installer_id } = await request.json();

    if (!lead_id || !installer_id) {
      return NextResponse.json(
        { error: 'Missing lead_id or installer_id' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    // Fetch lead details
    const leadResult = await query('SELECT * FROM leads WHERE id = $1', [lead_id]);
    if (leadResult.rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    const lead = leadResult.rows[0];

    // Fetch installer details
    const installerResult = await query('SELECT * FROM installers WHERE id = $1', [installer_id]);
    if (installerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Installer not found' }, { status: 404 });
    }
    const installer = installerResult.rows[0];

    // Generate signed token for response link
    const token = signToken(lead_id, installer_id, installer.email);
    const responseBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://heat-match.vercel.app';
    const responseLink = `${responseBaseUrl}/installer/respond?token=${token}`;

    // Format location_to_install for display
    const locations = Array.isArray(lead.location_to_install)
      ? lead.location_to_install.join(', ')
      : 'Not specified';

    // Format photos count
    const photoCount = Array.isArray(lead.photos) ? lead.photos.length : 0;

    // Build email HTML - simplified for better email client compatibility
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1f2937; margin: 0; padding: 0;">

  <!-- Header -->
  <div style="background-color: #10B981; color: white; padding: 30px 20px; text-align: center;">
    <h1 style="margin: 0 0 10px 0; font-size: 28px;">🔥 New Lead Assigned</h1>
    <p style="margin: 0; opacity: 0.9; font-size: 16px;">You've been assigned a new heat pump lead</p>
  </div>

  <!-- Main Content -->
  <div style="max-width: 600px; margin: 0 auto; padding: 30px 20px; background-color: #ffffff;">

    <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${installer.business_name || 'there'},</p>
    <p style="margin: 0 0 20px 0; font-size: 16px;">A new homeowner is looking for help with a heat pump project. Here are the details:</p>

    <!-- Lead Details -->
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 0 0 25px 0;">

      <table cellpadding="0" cellspacing="0" style="width: 100%; font-size: 14px;">
        <!-- Contact Info -->
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #374151; width: 130px; vertical-align: top;">Homeowner:</td>
          <td style="padding: 10px 0; color: #374151;">${lead.homeowner_name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #374151;">Phone:</td>
          <td style="padding: 10px 0; color: #374151;"><a href="tel:${lead.phone}" style="color: #10B981; text-decoration: none;">${lead.phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #374151;">Email:</td>
          <td style="padding: 10px 0; color: #374151;"><a href="mailto:${lead.email}" style="color: #10B981; text-decoration: none;">${lead.email}</a></td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 15px 0; border-top: 1px solid #e5e7eb;"></td>
        </tr>

        <!-- Project Details -->
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #374151;">Location:</td>
          <td style="padding: 10px 0; color: #374151;">${lead.suburb}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #374151;">Service Type:</td>
          <td style="padding: 10px 0; color: #374151;">${lead.service_type?.replace(/_/g, ' ') || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #374151;">Property Type:</td>
          <td style="padding: 10px 0; color: #374151;">${lead.property_type?.charAt(0).toUpperCase() + lead.property_type?.slice(1) || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #374151;">Bedrooms:</td>
          <td style="padding: 10px 0; color: #374151;">${lead.bedrooms || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #374151;">Heat Pumps:</td>
          <td style="padding: 10px 0; color: #374151;">${lead.heat_pumps_needed || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #374151; vertical-align: top;">Locations:</td>
          <td style="padding: 10px 0; color: #374151;">${locations}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #374151;">Existing Unit:</td>
          <td style="padding: 10px 0; color: #374151;">${lead.existing_unit?.replace(/_/g, ' ') || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #374151;">Timeline:</td>
          <td style="padding: 10px 0; color: #374151;">${lead.timeline?.replace(/_/g, ' ') || 'Not specified'}</td>
        </tr>
        ${photoCount > 0 ? `
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #374151;">Photos:</td>
          <td style="padding: 10px 0; color: #374151;">${photoCount} photo${photoCount !== 1 ? 's' : ''}</td>
        </tr>
        ` : ''}
      </table>

    </div>

    <!-- Photos Section -->
    ${photoCount > 0 ? `
    <div style="margin: 0 0 25px 0;">
      <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111827;">Project Photos</h3>
      <table cellpadding="0" cellspacing="10" style="width: 100%;">
        <tr>
          ${Array.isArray(lead.photos) ? lead.photos.slice(0, 2).map((photoUrl: string) => `
          <td style="width: 50%; vertical-align: top;">
            <img src="${photoUrl}" alt="Project photo" style="width: 100%; height: auto; border-radius: 6px; display: block;" />
          </td>
          `).join('') : ''}
        </tr>
        ${Array.isArray(lead.photos) && lead.photos.length > 2 ? `
        <tr>
          ${lead.photos.slice(2, 4).map((photoUrl: string) => `
          <td style="width: 50%; vertical-align: top;">
            <img src="${photoUrl}" alt="Project photo" style="width: 100%; height: auto; border-radius: 6px; display: block;" />
          </td>
          `).join('')}
        </tr>
        ` : ''}
      </table>
    </div>
    ` : ''}

    <!-- Call to Action -->
    <div style="text-align: center; margin: 30px 0;">
      <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">Are you interested in this lead?</p>
      <a href="${responseLink}&response=accept" style="display: inline-block; padding: 14px 32px; background-color: #10B981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16;">✅ Yes, I'll Follow Up</a>
    </div>

    <!-- Alternative Actions -->
    <div style="text-align: center; margin: 20px 0; font-size: 14px; color: #6b7280;">
      <p style="margin: 0 0 10px 0;">Not interested?</p>
      <p style="margin: 0;">
        <a href="${responseLink}&response=reject" style="color: #ef4444; text-decoration: none; font-weight: 600;">Decline this lead</a>
        &nbsp;&nbsp;•&nbsp;&nbsp;
        <a href="${responseLink}&response=need_info" style="color: #f59e0b; text-decoration: none; font-weight: 600;">Request more info</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
      <p style="margin: 0;">The homeowner has consented to be contacted about their heat pump project. Please reach out promptly to make the best impression.</p>
      <p style="margin: 10px 0 0 0;">HeatMatch • Connecting homeowners with trusted heat pump installers</p>
      <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} HeatMatch. All rights reserved.</p>
    </div>

  </div>

</body>
</html>
    `;

    // Send email
    const resend = new Resend(process.env.RESEND_API_KEY);
    const emailResult = await resend.emails.send({
      from: 'HeatMatch <onboarding@resend.dev>',
      to: installer.email,
      subject: `New Lead: ${lead.homeowner_name} in ${lead.suburb}`,
      html: emailHtml,
    });

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      email_id: emailResult.data?.id,
    });
  } catch (error) {
    console.error('Error sending lead email:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
