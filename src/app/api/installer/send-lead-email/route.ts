import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
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

    // Format data
    const locations = Array.isArray(lead.location_to_install)
      ? lead.location_to_install.join(', ')
      : 'Not specified';
    const photoCount = Array.isArray(lead.photos) ? lead.photos.length : 0;
    const photoUrls = Array.isArray(lead.photos) ? lead.photos : [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const headerImageUrl = `${baseUrl}/email_header.png`;
    const logoUrl = `${baseUrl}/images/heatmap_logo_light.png`;

    // Format field values
    const formattedServiceType = lead.service_type?.replace(/_/g, ' ') || 'Not specified';
    const formattedPropertyType = lead.property_type?.charAt(0).toUpperCase() + lead.property_type?.slice(1) || 'Not specified';
    const formattedExistingUnit = lead.existing_unit?.replace(/_/g, ' ') || 'Not specified';
    const formattedTimeline = lead.timeline?.replace(/_/g, ' ') || 'Not specified';

    // Build email HTML with professional template
    const emailHtml = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>New Lead Assigned</title>
  <style>
    /* Basic email resets */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background: #f5f7fb;
      font-family: Arial, Helvetica, sans-serif;
      color: #1f2937;
    }
    * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      box-sizing: border-box;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
    }
    img {
      border: 0;
      display: block;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      max-width: 100%;
    }
    a {
      color: inherit;
      text-decoration: none;
    }

    .wrapper {
      width: 100%;
      background: #f5f7fb;
      padding: 24px 12px;
    }
    .container {
      width: 100%;
      max-width: 720px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
    }

    .hero {
      background: linear-gradient(135deg, #0f9d58 0%, #0f7a4d 100%);
      color: #ffffff;
      padding: 28px;
      position: relative;
    }
    .hero-image {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 0;
      margin-bottom: 20px;
    }
    .hero-badge {
      display: inline-block;
      background: rgba(255,255,255,0.16);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 8px 12px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    .hero-title {
      font-size: 34px;
      line-height: 1.1;
      font-weight: 800;
      margin: 0 0 10px 0;
      letter-spacing: -0.02em;
    }
    .hero-subtitle {
      font-size: 18px;
      line-height: 1.5;
      margin: 0;
      opacity: 0.96;
    }

    .content {
      padding: 28px;
    }
    .greeting {
      font-size: 22px;
      line-height: 1.35;
      font-weight: 800;
      color: #111827;
      margin: 0 0 14px 0;
    }
    .intro {
      font-size: 16px;
      line-height: 1.7;
      color: #374151;
      margin: 0 0 22px 0;
    }

    .card {
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      overflow: hidden;
      background: #fff;
      margin: 18px 0 0 0;
    }
    .card-inner {
      padding: 22px;
    }
    .card-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 14px 0;
    }

    .details-table {
      width: 100%;
    }
    .details-table td {
      vertical-align: top;
      padding: 8px 0;
      font-size: 15px;
      line-height: 1.5;
    }
    .label {
      width: 34%;
      color: #0f172a;
      font-weight: 700;
      padding-right: 14px;
    }
    .value {
      color: #4b5563;
      font-weight: 400;
    }

    .section-heading {
      font-size: 18px;
      line-height: 1.3;
      font-weight: 800;
      color: #0f172a;
      margin: 26px 0 14px 0;
    }

    .photos-grid {
      width: 100%;
    }
    .photos-grid td {
      width: 25%;
      padding: 0 6px 0 0;
      vertical-align: top;
    }
    .photo {
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
    }
    .photo img {
      width: 100%;
      height: 130px;
      object-fit: cover;
    }

    .cta-panel {
      border: 1px solid #c7ead9;
      background: #f5fffa;
      border-radius: 14px;
      padding: 24px 20px;
      text-align: center;
      margin: 22px 0 0 0;
    }
    .cta-icon {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      background: #0f9d58;
      color: #fff;
      font-size: 18px;
      line-height: 28px;
      margin: 0 auto 12px;
      font-weight: 700;
    }
    .cta-title {
      font-size: 20px;
      line-height: 1.35;
      font-weight: 800;
      color: #111827;
      margin: 0 0 12px 0;
    }
    .cta-note {
      font-size: 14px;
      line-height: 1.6;
      color: #6b7280;
      margin: 0 0 18px 0;
    }

    .btn {
      display: inline-block;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 800;
      line-height: 1;
      padding: 16px 22px;
      text-align: center;
      border: 0;
    }
    .btn-primary {
      background: linear-gradient(135deg, #0f9d58 0%, #0b7f49 100%);
      color: #ffffff !important;
      box-shadow: 0 10px 20px rgba(15, 157, 88, 0.22);
    }
    .btn-danger {
      background: #fef2f2;
      color: #dc2626 !important;
    }
    .btn-warning {
      background: #fff7ed;
      color: #d97706 !important;
    }

    .button-row {
      width: 100%;
      margin-top: 6px;
    }
    .button-row td {
      padding: 6px;
      text-align: center;
    }

    .info-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      border-radius: 12px;
      padding: 16px 18px;
      margin-top: 18px;
      font-size: 14px;
      line-height: 1.6;
    }

    .footer {
      padding: 20px 28px 28px 28px;
      color: #6b7280;
      font-size: 13px;
      line-height: 1.6;
      border-top: 1px solid #e5e7eb;
      background: #ffffff;
    }
    .footer-content {
      display: table;
      width: 100%;
    }
    .footer-col {
      display: table-cell;
      padding: 0 20px;
      vertical-align: top;
      width: 50%;
    }
    .footer-col:first-child {
      padding-left: 0;
    }
    .footer-col:last-child {
      padding-right: 0;
    }
    .footer strong {
      color: #111827;
    }

    @media only screen and (max-width: 640px) {
      .wrapper {
        padding: 0;
      }
      .container {
        border-radius: 0;
      }
      .hero,
      .content,
      .footer {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      .hero-title {
        font-size: 28px;
      }
      .hero-subtitle {
        font-size: 16px;
      }
      .label,
      .value {
        display: block;
        width: 100%;
      }
      .label {
        padding-right: 0;
        padding-bottom: 2px;
      }
      .photos-grid td {
        width: 50%;
        padding: 0 6px 10px 0;
      }
      .footer-content {
        display: block;
      }
      .footer-col {
        display: block;
        width: 100%;
        padding: 12px 0;
      }
      .button-row td {
        display: block;
        width: 100%;
        padding: 6px 0;
      }
      .btn {
        display: block;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" class="wrapper">
    <tr>
      <td>
        <table role="presentation" width="100%" class="container">
          <!-- HERO -->
          <tr>
            <td class="hero">
              <img src="${logoUrl}" alt="HeatMatch" style="height: 40px; margin-bottom: 20px;" />
              <div class="hero-badge">New Lead Assigned</div>
              <div class="hero-title">You've been assigned a new heat pump lead.</div>
              <p class="hero-subtitle">A homeowner is looking for help with a project in your service area.</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td class="content">
              <p class="greeting">Hi ${installer.business_name},</p>
              <p class="intro">
                A new homeowner enquiry has been assigned to you. Please review the details below and respond as soon as possible.
              </p>

              <!-- LEAD DETAILS -->
              <div class="card">
                <div class="card-inner">
                  <div class="card-title">Lead Details</div>

                  <table role="presentation" class="details-table">
                    <tr>
                      <td class="label">Name</td>
                      <td class="value">${lead.homeowner_name}</td>
                    </tr>
                    <tr>
                      <td class="label">Phone</td>
                      <td class="value"><a href="tel:${lead.phone}" style="color: #2563eb;">${lead.phone}</a></td>
                    </tr>
                    <tr>
                      <td class="label">Email</td>
                      <td class="value"><a href="mailto:${lead.email}" style="color: #2563eb;">${lead.email}</a></td>
                    </tr>
                    <tr>
                      <td class="label">Primary Location</td>
                      <td class="value">${lead.suburb}</td>
                    </tr>
                    <tr>
                      <td class="label">Service Locations</td>
                      <td class="value">${locations}</td>
                    </tr>
                    <tr>
                      <td class="label">Service Type</td>
                      <td class="value">${formattedServiceType}</td>
                    </tr>
                    <tr>
                      <td class="label">Property Type</td>
                      <td class="value">${formattedPropertyType}</td>
                    </tr>
                    <tr>
                      <td class="label">Bedrooms</td>
                      <td class="value">${lead.bedrooms || 'Not specified'}</td>
                    </tr>
                    <tr>
                      <td class="label">Heat Pumps Needed</td>
                      <td class="value">${lead.heat_pumps_needed || 'Not specified'}</td>
                    </tr>
                    <tr>
                      <td class="label">Rooms / Locations</td>
                      <td class="value">${locations}</td>
                    </tr>
                    <tr>
                      <td class="label">Existing Unit</td>
                      <td class="value">${formattedExistingUnit}</td>
                    </tr>
                    <tr>
                      <td class="label">Timeline</td>
                      <td class="value">${formattedTimeline}</td>
                    </tr>
                    <tr>
                      <td class="label">Photos</td>
                      <td class="value">${photoCount} photos included</td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- PHOTOS -->
              ${photoCount > 0 ? `
              <div class="section-heading">Project Photos (${photoCount})</div>

              <table role="presentation" class="photos-grid">
                <tr>
                  ${photoUrls.slice(0, 4).map((photoUrl: string) => `
                  <td>
                    <div class="photo">
                      <img src="${photoUrl}" alt="Project photo" />
                    </div>
                  </td>
                  `).join('')}
                </tr>
              </table>
              ` : ''}

              <!-- CTA -->
              <div class="cta-panel">
                <div class="cta-icon">✓</div>
                <div class="cta-title">Are you interested in this lead?</div>
                <a href="${responseLink}&response=accept" class="btn btn-primary">Yes, I'll Follow Up</a>

                <div style="height: 18px;"></div>
                <div class="cta-note">Not interested? You can also:</div>

                <table role="presentation" width="100%" class="button-row">
                  <tr>
                    <td>
                      <a href="${responseLink}&response=reject" class="btn btn-danger">Decline this lead</a>
                    </td>
                    <td>
                      <a href="${responseLink}&response=need_info" class="btn btn-warning">Request more info</a>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- INFO -->
              <div class="info-box">
                The homeowner has consented to be contacted about their heat pump project.
                <strong>Please reach out promptly to make the best impression.</strong>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="footer">
              <div class="footer-content">
                <div class="footer-col">
                  <strong>HeatMatch</strong><br />
                  Connecting homeowners with trusted heat pump installers.
                </div>
                <div class="footer-col">
                  <strong>Need help?</strong><br />
                  Reply to this email or contact<br />
                  <a href="mailto:support@heatmatch.co.nz" style="color: #2563eb;">support@heatmatch.co.nz</a>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
