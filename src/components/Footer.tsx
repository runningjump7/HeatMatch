import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/">
              <img src="/icons/heatmatch-logo-white.svg" alt="HeatMatch" className="h-8 mb-4 cursor-pointer hover:opacity-80 transition" />
            </Link>
            <p className="text-sm">Connecting North Shore homeowners with trusted heat pump installers.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <p className="text-sm">hello@heatmatch.co.nz</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-sm text-center">
          <p>© HeatMatch 2026. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
