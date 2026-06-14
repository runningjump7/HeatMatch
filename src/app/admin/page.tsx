import { query } from '@/lib/db';

export default async function AdminDashboard() {
  const approvedResult = await query(
    'SELECT COUNT(*) as count FROM installers WHERE approved = true'
  );
  const approvedCount = parseInt(approvedResult.rows[0].count);

  const leadsResult = await query(
    'SELECT COUNT(*) as count FROM leads WHERE created_at >= DATE_TRUNC(\'month\', CURRENT_DATE)'
  );
  const leadsCount = parseInt(leadsResult.rows[0].count);

  const leadssentResult = await query(
    'SELECT COUNT(*) as count FROM leads_sent'
  );
  const leadsSentCount = parseInt(leadssentResult.rows[0].count);

  const interestedResult = await query(
    'SELECT COUNT(*) as count FROM leads_sent WHERE installer_response = \'interested\''
  );
  const interestedCount = parseInt(interestedResult.rows[0].count);

  const conversionRate = leadsSentCount > 0
    ? ((interestedCount / leadsSentCount) * 100).toFixed(1)
    : 0;

  const newInstallersResult = await query(
    'SELECT COUNT(*) as count FROM installers WHERE created_at >= CURRENT_DATE - INTERVAL \'7 days\''
  );
  const newInstallersCount = parseInt(newInstallersResult.rows[0].count);

  const pendingResult = await query(
    'SELECT COUNT(*) as count FROM installers WHERE approved = false'
  );
  const pendingCount = parseInt(pendingResult.rows[0].count);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Installers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{approvedCount}</p>
            </div>
            <div className="text-4xl">✓</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leads This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{leadsCount}</p>
            </div>
            <div className="text-4xl">📧</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads Sent</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{leadsSentCount}</p>
            </div>
            <div className="text-4xl">📬</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lead Interest Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{conversionRate}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {interestedCount} of {leadsSentCount} interested
              </p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Installers (Week)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{newInstallersCount}</p>
            </div>
            <div className="text-4xl">🆕</div>
          </div>
        </div>

        <div className={`bg-white rounded-lg border-2 p-6 ${pendingCount > 0 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className={`text-3xl font-bold mt-2 ${pendingCount > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
                {pendingCount}
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
          {pendingCount > 0 && (
            <a
              href="/admin/installers/pending"
              className="mt-4 inline-block text-sm font-semibold text-yellow-600 hover:text-yellow-700"
            >
              Review pending →
            </a>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <a
            href="/admin/installers/pending"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Review Installer Applications
          </a>
          <a
            href="/admin/metrics"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            View Detailed Analytics
          </a>
          <a
            href="/"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            View Public Site
          </a>
        </div>
      </div>
    </div>
  );
}
