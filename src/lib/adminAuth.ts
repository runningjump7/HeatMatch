import { cookies } from 'next/headers';

export async function getAdminSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  return session || null;
}

export function isAdminAuthenticated(session: string | null): boolean {
  return session === 'alex@alexvaz.org';
}
