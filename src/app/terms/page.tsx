export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Terms and Conditions</h1>
          <p className="text-emerald-100 mt-2">Last updated: June 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using HeatMatch, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on HeatMatch for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the site</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Disclaimer</h2>
            <p>
              The materials on HeatMatch are provided on an 'as is' basis. HeatMatch makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitations</h2>
            <p>
              In no event shall HeatMatch or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on HeatMatch, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on HeatMatch could include technical, typographical, or photographic errors. HeatMatch does not warrant that any of the materials on the website are accurate, complete, or current. HeatMatch may make changes to the materials contained on the website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Links</h2>
            <p>
              HeatMatch has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by HeatMatch of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modifications</h2>
            <p>
              HeatMatch may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of New Zealand, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. User Responsibilities</h2>
            <p>
              When using HeatMatch, you agree to:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Provide accurate and truthful information in your quote request</li>
              <li>Not misrepresent your property or project details</li>
              <li>Not engage in any unlawful or fraudulent activity</li>
              <li>Respect the intellectual property rights of HeatMatch and installers</li>
              <li>Not use the service to spam or harass installers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Installer Independence</h2>
            <p>
              Installers using HeatMatch are independent contractors and not employees or agents of HeatMatch. HeatMatch does not control the quality, safety, or legality of services provided by installers. You are responsible for verifying installer credentials, licenses, and insurance before engaging their services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p>
              HeatMatch shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
            <p>
              HeatMatch reserves the right to terminate or suspend your access to the service at any time, with or without cause, with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at +64 21 024 45 890.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
