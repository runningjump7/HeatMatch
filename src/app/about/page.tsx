import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold">About HeatMatch</h1>
          <p className="text-emerald-100 mt-2">Making heat pump installation simple and transparent</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            HeatMatch connects homeowners and businesses across Auckland's North Shore with trusted, local heat pump installers. We simplify the process of finding the right professional for your heating and cooling needs, whether you're installing a new system, replacing an existing unit, or scheduling routine maintenance.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose HeatMatch?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Local Expertise:</strong> All our installers service Auckland's North Shore and know the region inside out.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Free Service:</strong> Getting matched with installers is completely free for homeowners.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>No Obligation:</strong> Receive quotes and compare options before making any commitments.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Trusted Partners:</strong> All installers are vetted professionals committed to quality service.</span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Service</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Whether you need a new heat pump installation, are replacing an existing system, require maintenance and servicing, or simply need professional advice, HeatMatch connects you with qualified installers ready to help.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Tell us about your project, and we'll match you with installers in your area. You'll receive quotes and can choose the installer that's right for you.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
