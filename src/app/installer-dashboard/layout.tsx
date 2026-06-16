import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function InstallerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('tradeev2_session');

  if (!session) {
    redirect('/installer-login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 fixed h-screen">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="text-xl font-bold text-blue-600">
            TRADEEV2
          </Link>
          <p className="text-xs text-gray-500 mt-1">Installer Portal</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/installer-dashboard"
            className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/installer-dashboard/leads"
            className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition"
          >
            📋 Leads
          </Link>
          <Link
            href="/installer-dashboard/profile"
            className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition"
          >
            🏢 Business Listing
          </Link>
          <Link
            href="/installer-dashboard/account"
            className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition"
          >
            ⚙️ Account
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 w-64">
          <form
            action="/api/auth/logout"
            method="POST"
            className="w-full"
          >
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-medium"
            >
              🚪 Logout
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
