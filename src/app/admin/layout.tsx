import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // Protect the entire admin section
  if (!userId) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">TRADEEV2 Admin</h1>
        </div>

        <nav className="p-6 space-y-2">
          <Link
            href="/admin"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/installers/pending"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            ✓ Approve Installers
          </Link>
          <Link
            href="/admin/metrics"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            📈 Analytics
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link
            href="/"
            className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-center text-sm"
          >
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
          <div className="text-sm text-gray-600">Logged in as: {userId}</div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
