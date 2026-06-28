import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession, isAdminAuthenticated } from '@/lib/adminAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!isAdminAuthenticated(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const result = await query('SELECT * FROM leads WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!isAdminAuthenticated(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { admin_notes, status, assigned_installers } = await request.json();

    // Fetch current lead to check previous assignments
    const currentResult = await query('SELECT assigned_installers FROM leads WHERE id = $1', [id]);
    const currentAssignments = currentResult.rows[0]?.assigned_installers || [];
    const newAssignments = assigned_installers || [];

    // Find newly assigned installers (not in previous list)
    const newlyAssigned = newAssignments.filter(
      (id: string) => !currentAssignments.includes(id)
    );

    await query(
      `UPDATE leads
       SET completed_notes = $1, status = $2, assigned_installers = $3
       WHERE id = $4`,
      [admin_notes, status, newAssignments, id]
    );

    // Send emails to newly assigned installers
    for (const installer_id of newlyAssigned) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const emailUrl = `${baseUrl}/api/installer/send-lead-email`;

        console.log(`[DEBUG] Sending email to installer ${installer_id}. URL: ${emailUrl}`);

        const emailResponse = await fetch(emailUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lead_id: id, installer_id }),
        });

        const emailText = await emailResponse.text();

        if (!emailResponse.ok) {
          console.error(
            `[ERROR] Failed to send email to installer ${installer_id}. Status: ${emailResponse.status}. Response: ${emailText}`
          );
        } else {
          console.log(`[SUCCESS] Email sent to installer ${installer_id} for lead ${id}. Response: ${emailText}`);
        }
      } catch (error) {
        console.error(`[ERROR] Exception sending email to installer ${installer_id}:`, error);
      }
    }

    const result = await query('SELECT * FROM leads WHERE id = $1', [id]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
