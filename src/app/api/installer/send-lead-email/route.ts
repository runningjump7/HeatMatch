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

    // Build email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #10B981; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
    .header p { margin: 5px 0 0 0; opacity: 0.9; }
    .content { background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 8px 8px; }
    .lead-info { background-color: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; margin: 12px 0; }
    .info-label { font-weight: 600; color: #374151; width: 140px; flex-shrink: 0; }
    .info-value { color: #6b7280; }
    .actions { text-align: center; margin: 30px 0; }
    .button { display: inline-block; padding: 12px 28px; background-color: #10B981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
    .button:hover { background-color: #059669; }
    .divider { border-top: 1px solid #e5e7eb; margin: 20px 0; }
    .footer { font-size: 12px; color: #9ca3af; text-align: center; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔥 New Lead Assigned</h1>
      <p>You've been assigned a new heat pump lead</p>
    </div>

    <div class="content">
      <p>Hi ${installer.business_name || 'there'},</p>
      <p>A new homeowner is looking for help with a heat pump project. Here are the details:</p>

      <div class="lead-info">
        <div class="info-row">
          <div class="info-label">Homeowner</div>
          <div class="info-value">${lead.homeowner_name}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Phone</div>
          <div class="info-value">${lead.phone}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Email</div>
          <div class="info-value">${lead.email}</div>
        </div>
        <div class="divider"></div>
        <div class="info-row">
          <div class="info-label">Location</div>
          <div class="info-value">${lead.suburb}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Service Type</div>
          <div class="info-value">${lead.service_type?.replace(/_/g, ' ') || 'Not specified'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Property Type</div>
          <div class="info-value">${lead.property_type?.charAt(0).toUpperCase() + lead.property_type?.slice(1) || 'Not specified'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Bedrooms</div>
          <div class="info-value">${lead.bedrooms || 'Not specified'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Heat Pumps Needed</div>
          <div class="info-value">${lead.heat_pumps_needed || 'Not specified'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Locations</div>
          <div class="info-value">${locations}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Existing Unit</div>
          <div class="info-value">${lead.existing_unit?.replace(/_/g, ' ') || 'Not specified'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Timeline</div>
          <div class="info-value">${lead.timeline?.replace(/_/g, ' ') || 'Not specified'}</div>
        </div>
        ${photoCount > 0 ? `
        <div class="info-row">
          <div class="info-label">Photos</div>
          <div class="info-value">${photoCount} photo${photoCount !== 1 ? 's' : ''} included</div>
        </div>
        ` : ''}
      </div>

      <p style="margin-top: 30px; margin-bottom: 10px; font-weight: 600;">Are you interested in this lead?</p>

      <div class="actions">
        <a href="${responseLink}&response=accept" class="button">✅ Yes, I'll Follow Up</a>
      </div>

      <p style="text-align: center; font-size: 14px; color: #6b7280; margin-top: 20px;">
        Not interested? You can also:
      </p>
      <p style="text-align: center; margin-top: 10px;">
        <a href="${responseLink}&response=reject" style="color: #ef4444; text-decoration: none; font-weight: 600;">Decline this lead</a>
        &nbsp;•&nbsp;
        <a href="${responseLink}&response=need_info" style="color: #f59e0b; text-decoration: none; font-weight: 600;">Request more info</a>
      </p>

      <p style="margin-top: 40px; font-size: 14px; color: #9ca3af;">
        The homeowner has consented to be contacted about their heat pump project. Please reach out promptly to make the best impression.
      </p>
    </div>

    <div class="footer">
      <p>HeatMatch • Connecting homeowners with trusted heat pump installers</p>
      <p>© ${new Date().getFullYear()} HeatMatch. All rights reserved.</p>
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
