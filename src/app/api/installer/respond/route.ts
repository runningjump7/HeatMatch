import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { token, response } = await request.json();

    if (!token || !response) {
      return NextResponse.json(
        { error: 'Missing token or response' },
        { status: 400 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { lead_id, installer_id } = payload;
    const validResponses = ['accept', 'reject', 'need_info'];

    if (!validResponses.includes(response)) {
      return NextResponse.json(
        { error: 'Invalid response value' },
        { status: 400 }
      );
    }

    // Update lead with installer response
    // Store response details in a new column or notes
    const now = new Date().toISOString();

    await query(
      `UPDATE leads
       SET installer_response = $1,
           installer_response_at = $2,
           installer_response_from = $3
       WHERE id = $4`,
      [response, now, installer_id, lead_id]
    );

    // Return success with human-readable message
    const messages: Record<string, string> = {
      accept: 'Thanks! We\'ve noted that you\'re interested. The homeowner will be contacted shortly.',
      reject: 'Thanks for letting us know. We\'ll keep this in mind for future leads.',
      need_info: 'Thanks! We\'ll reach out to you with more details as soon as possible.',
    };

    return NextResponse.json({
      success: true,
      message: messages[response],
      response,
    });
  } catch (error) {
    console.error('Error handling installer response:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
