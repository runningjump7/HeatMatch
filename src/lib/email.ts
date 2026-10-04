import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  // Development: Log to console instead of sending
  if (process.env.NODE_ENV === 'development') {
    console.log('\n[EMAIL]', {
      to: options.to,
      subject: options.subject,
      preview: options.html?.substring(0, 100) || options.text?.substring(0, 100),
    });
    return { success: true };
  }

  // Production: Send via Resend
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@heatmatch.co.nz';

    const result = await resend.emails.send({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (result.error) {
      console.error('Email send error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('Email sent:', result.id);
    return { success: true };
  } catch (error) {
    console.error('Email service error:', error);
    // Don't throw - graceful degradation
    return { success: false, error: String(error) };
  }
}
