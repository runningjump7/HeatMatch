'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const t = useTranslations();
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
          message: t('contactForm.successMessage'),
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
          message: t('contactForm.errorMessage'),
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: t('contactForm.errorMessage'),
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
          <h1 className="text-4xl font-bold">{t('pages.contact.heading')}</h1>
          <p className="text-emerald-100 mt-2">{t('pages.contact.subheading')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('pages.contact.getInTouch')}</h2>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">{t('pages.contact.phone')}</h3>
              <a href="tel:+64210244590" className="text-emerald-600 hover:text-emerald-700 text-lg">
                +64 21 024 45 890
              </a>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">{t('pages.contact.email')}</h3>
              <a href="mailto:hello@heatmatch.nz" className="text-emerald-600 hover:text-emerald-700">
                hello@heatmatch.nz
              </a>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">{t('pages.contact.serviceArea')}</h3>
              <p className="text-gray-700">
                {t('pages.contact.serviceAreaText')}
              </p>
            </div>
          </div>

          {/* Support Info */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('pages.contact.howWeCanHelp')}</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('pages.contact.forHomeowners.title')}</h3>
                <p className="text-gray-700 text-sm">
                  {t('pages.contact.forHomeowners.text')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('pages.contact.forInstallers.title')}</h3>
                <p className="text-gray-700 text-sm">
                  {t('pages.contact.forInstallers.text')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('pages.contact.feedback.title')}</h3>
                <p className="text-gray-700 text-sm">
                  {t('pages.contact.feedback.text')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('pages.contact.generalInquiries.title')}</h3>
                <p className="text-gray-700 text-sm">
                  {t('pages.contact.generalInquiries.text')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pages.contact.sendMessage')}</h2>

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
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('contactForm.nameLabel')} *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
                placeholder={t('contactForm.namePlaceholder')}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('contactForm.emailLabel')} *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
                placeholder={t('contactForm.emailPlaceholder')}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('contactForm.phoneLabel')}</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
                placeholder={t('contactForm.phonePlaceholder')}
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('contactForm.typeLabel')} *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
              >
                <option value="homeowner">{t('contactForm.typeHomeowner')}</option>
                <option value="installer">{t('contactForm.typeInstaller')}</option>
                <option value="business">{t('contactForm.typeBusiness')}</option>
                <option value="other">{t('contactForm.typeOther')}</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('contactForm.subjectLabel')} *</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
                placeholder={t('contactForm.subjectPlaceholder')}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('contactForm.messageLabel')} *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900 resize-none"
                placeholder={t('contactForm.messagePlaceholder')}
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
                  {t('contactForm.consentLabel')} *
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
            >
              {isSubmitting ? t('pages.contact.sending') : t('pages.contact.sendButton')}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
