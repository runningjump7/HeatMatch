'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'homeowner',
    subject: '',
    message: '',
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message. We\'ll get back to you soon!',
        });
        setForm({
          name: '',
          email: '',
          phone: '',
          type: 'homeowner',
          subject: '',
          message: '',
          consent: false,
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: 'There was an error sending your message. Please try again.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'There was an error sending your message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
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
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <a href="mailto:hello@heatmatch.co.nz" className="text-emerald-600 hover:text-emerald-700">
                hello@heatmatch.co.nz
              </a>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Service Area</h3>
              <p className="text-gray-700">
                Auckland's North Shore, including suburbs from Albany to Long Bay
              </p>
            </div>
          </div>

          {/* Support Info */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">How We Can Help</h2>

            <div className="grid md:grid-cols-2 gap-8">
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

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">General Inquiries</h3>
                <p className="text-gray-700 text-sm">
                  Use the form below to send us a message, and we'll respond as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

          {submitStatus && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
                placeholder="09 123 4567"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">I am a *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
              >
                <option value="homeowner">Homeowner</option>
                <option value="installer">Heat Pump Installer</option>
                <option value="business">Business Owner</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Subject *</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
                placeholder="What is this about?"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900 resize-none"
                placeholder="Tell us what you need..."
              />
            </div>

            {/* Consent */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={handleChange}
                  required
                  className="mt-1 w-5 h-5 border border-gray-300 rounded accent-emerald-600"
                />
                <span className="text-sm text-gray-700">
                  I agree to be contacted regarding my inquiry. I understand my information will be used to respond to my message. *
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
