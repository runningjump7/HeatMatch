export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-emerald-100 mt-2">Last updated: June 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              HeatMatch ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <p className="font-semibold text-gray-900">Personal Information:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Name, phone number, and email address</li>
              <li>Property address and type</li>
              <li>Project details (service type, timeline, existing equipment)</li>
              <li>Photos of your property (optional)</li>
              <li>Any other information you provide directly</li>
            </ul>
            <p className="mt-4 font-semibold text-gray-900">Automatically Collected Information:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Browser type and IP address</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring website information</li>
              <li>Device information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Match you with appropriate installers for your project</li>
              <li>Share your project details with selected installers</li>
              <li>Facilitate communication between you and installers</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sharing Your Information</h2>
            <p>
              When you submit a quote request, we share your project information with licensed heat pump installers who service your area. These installers use your information to provide quotes and contact you about your project.
            </p>
            <p className="mt-4">
              We may also share information with service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.
            </p>
            <p className="mt-4">
              We will not sell your personal information to third parties. We may disclose information if required by law or to protect our rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Access your personal information</li>
              <li>Request corrections to inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of communications from us</li>
            </ul>
            <p className="mt-4">To exercise these rights, contact us at +64 21 024 45 890.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
            <p>
              Our website may use cookies to enhance your experience. You can choose to disable cookies through your browser settings, though this may affect your ability to use certain features of our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of external sites. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of our services constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at +64 21 024 45 890.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
