export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-emerald-100 mt-2">Get in touch with the HeatMatch team</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <a href="tel:+64210244590" className="text-emerald-600 hover:text-emerald-700 text-lg">
                +64 21 024 45 890
              </a>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Service Area</h3>
              <p className="text-gray-700">
                Auckland's North Shore, including suburbs from Albany to Long Bay
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Homeowners</h3>
              <p className="text-gray-700 mb-4">
                Ready to get matched with installers? Use our quick quote form on the home page.
              </p>
            </div>
          </div>

          {/* Support Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">How We Can Help</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">For Homeowners</h3>
                <p className="text-gray-700 text-sm">
                  Have questions about your project? Need help with your quote request? Contact us and we'll get back to you quickly.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">For Installers</h3>
                <p className="text-gray-700 text-sm">
                  Interested in becoming a partner installer? We're always looking to expand our network of trusted professionals. Reach out to discuss partnership opportunities.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Feedback</h3>
                <p className="text-gray-700 text-sm">
                  We'd love to hear about your experience with HeatMatch. Your feedback helps us improve our service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
