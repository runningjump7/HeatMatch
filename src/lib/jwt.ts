import crypto from 'crypto';

// Simple JWT-like token without external dependency
// Format: header.payload.signature

interface TokenPayload {
  lead_id: string;
  installer_id: string;
  installer_email: string;
  iat: number;
  exp: number;
}

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export function signToken(lead_id: string, installer_id: string, installer_email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = {
    lead_id,
    installer_id,
    installer_email,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const message = `${header}.${body}`;
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(message)
    .digest('base64url');

  return `${message}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const message = `${header}.${body}`;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(message)
      .digest('base64url');

    if (signature !== expectedSignature) {
      console.error('Invalid token signature');
      return null;
    }

    // Decode and verify payload
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      console.error('Token expired');
      return null;
    }

    return payload as TokenPayload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
