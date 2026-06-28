'use client';

import { useState } from 'react';
import QuoteFormStepper from '@/components/QuoteFormStepper';

export default function Home() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showStepper, setShowStepper] = useState(false);

  const services = [
    { id: 'new_install', label: 'New Heat Pump Installation', icon: '/icons/service-new-installation.svg' },
    { id: 'replace', label: 'Replace Existing Heat Pump', icon: '/icons/service-replace-existing.svg' },
    { id: 'service', label: 'Heat Pump Service', icon: '/icons/service-heat-pump-service.svg' },
    { id: 'advice', label: 'Not Sure / Need Advice', icon: '/icons/service-need-advice.svg' },
  ];

  const suburbs = [
    'Albany', 'Takapuna', 'Milford', 'Browns Bay',
    'Glenfield', 'Birkenhead', 'Devonport', 'Mairangi Bay',
    'Northcote', 'Long Bay'
  ];

  const recentProjects = [
    {
      suburb: 'ALBANY',
      title: 'New installation',
      desc: '3-bedroom family home',
      image: '/images/project-1.jpg',
    },
    {
      suburb: 'TAKAPUNA',
      title: 'Replacement unit',
      desc: 'Existing heat pump upgrade',
      image: '/images/project-2.jpg',
    },
    {
      suburb: 'BROWNS BAY',
      title: 'Commercial installation',
      desc: 'Small office fit-out',
      image: '/images/project-3.jpg',
    },
    {
      suburb: 'MILFORD',
      title: 'Bedroom installation',
      desc: 'Single room heat pump',
      image: '/images/project-4.jpg',
    },
  ];

  const faqItems = [
    {
      q: 'Do I pay anything?',
      a: 'No. HeatMatch is completely free for homeowners.',
    },
    {
      q: 'How many installers will contact me?',
      a: 'Typically between one and three depending on your project and location.',
    },
    {
      q: 'Can I upload photos?',
      a: 'Yes. Photos help installers understand your project and provide better advice.',
    },
    {
      q: 'How quickly will I hear back?',
      a: 'Most enquiries receive a response within 24 hours.',
    },
    {
      q: 'Do I need to create an account?',
      a: 'No. Simply submit your project details and we\'ll handle the rest.',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-10" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm">How It Works</a>
            <a href="#coverage" className="text-gray-600 hover:text-gray-900 text-sm">Areas We Service</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 text-sm">FAQ</a>
          </div>
          <button
            onClick={() => { setSelectedService(null); setShowStepper(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition">
            Get Quote
          </button>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <svg width="16" height="16" viewBox="0 0 64 64" className="w-4 h-4">
                  <path d="M32 56s16-16 16-28a16 16 0 10-32 0c0 12 16 28 16 28z" fill="none" stroke="#10B981" strokeWidth="4"/>
                  <circle cx="32" cy="28" r="5" fill="#10B981"/>
                </svg>
                <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">North Shore Specialists</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Get Matched With<br/>Trusted Local Installers<br/><span className="text-emerald-600">Without Calling Around</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Tell us about your project and we'll connect you with trusted local heat pump installers serving Auckland's North Shore.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <svg width="24" height="24" viewBox="0 0 64 64" className="w-5 h-5 flex-shrink-0">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#10B981" strokeWidth="4"/>
                    <path d="M20 34l8 8 16-20" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm text-gray-700">Free service</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="24" height="24" viewBox="0 0 64 64" className="w-5 h-5 flex-shrink-0">
                    <rect x="14" y="10" width="36" height="44" rx="4" fill="none" stroke="#10B981" strokeWidth="4"/>
                    <path d="M22 30l8 8 12-16" fill="none" stroke="#10B981" strokeWidth="4"/>
                  </svg>
                  <span className="text-sm text-gray-700">No obligation quotes</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="24" height="24" viewBox="0 0 64 64" className="w-5 h-5 flex-shrink-0">
                    <path d="M32 8l18 6v14c0 12-8 22-18 28-10-6-18-16-18-28V14z" fill="none" stroke="#10B981" strokeWidth="4"/>
                  </svg>
                  <span className="text-sm text-gray-700">Trusted local installers</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="24" height="24" viewBox="0 0 64 64" className="w-5 h-5 flex-shrink-0">
                    <path d="M32 56s16-16 16-28a16 16 0 10-32 0c0 12 16 28 16 28z" fill="none" stroke="#10B981" strokeWidth="4"/>
                    <circle cx="32" cy="28" r="5" fill="#10B981"/>
                  </svg>
                  <span className="text-sm text-gray-700">North Shore specialists</span>
                </div>
              </div>
            </div>

            {/* Right: Form Card */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                {/* Progress Bar */}
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-emerald-600" style={{ width: '20%' }} />
                </div>

                {/* Form Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-6">What do you need help with?</h2>

                {/* Service Options */}
                <div className="space-y-3 mb-8">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition ${
                        selectedService === service.id
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-gray-50'
                      }`}
                    >
                      <img src={service.icon} alt="" className="w-8 h-8 flex-shrink-0" />
                      <span className={`text-left font-semibold text-lg ${selectedService === service.id ? 'text-gray-900' : 'text-gray-700'}`}>
                        {service.label}
                      </span>
                      <svg className={`w-6 h-6 ml-auto ${selectedService === service.id ? 'text-emerald-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>

                {/* Continue Button */}
                <button
                  onClick={() => setShowStepper(true)}
                  disabled={!selectedService}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition mb-4"
                >
                  Select an option to continue
                </button>

                {/* Average Response Time */}
                <p className="text-center text-sm text-gray-500">
                  ⏱️ Average response time: Under 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image - Behind content on mobile, visible on desktop */}
          <div className="hidden md:block absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full opacity-40 blur-3xl"></div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="px-4">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">How HeatMatch Works</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
              Finding a heat pump installer doesn't need to be complicated.
            </h2>
            <p className="text-lg text-gray-600">From request to installer in three simple steps.</p>
          </div>

          {/* Steps */}
          <div className="mb-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mb-12">
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="mb-3 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Tell Us About Your Project</h3>
                <p className="text-gray-600 text-center text-sm">Answer a few quick questions about your home and requirements.</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center gap-2 text-gray-400 mb-8">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="mb-3 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">We Match You With<br/><span className="font-bold">The Right Installer</span></h3>
                <p className="text-gray-600 text-center text-sm">We review your project and connect you with trusted local professionals.</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center gap-2 text-gray-400 mb-8">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="mb-3 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Get Your Quote</h3>
                <p className="text-gray-600 text-center text-sm">Your installer gets in touch to discuss your project and next steps.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: WHY HEATMATCH */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            Why Homeowners Use HeatMatch
          </h2>

          <div className="grid md:grid-cols-6 gap-6">
            {/* Stop Calling Around */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 64 64" className="w-12 h-12">
                  <circle cx="32" cy="32" r="18" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <path d="M32 20v12l8 8" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Stop Calling Around</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Tell us about your project once and we'll do the rest.</p>
            </div>

            {/* Trusted Local Installers */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 64 64" className="w-12 h-12">
                  <path d="M32 10l16 6v12c0 10-6 18-16 24-10-6-16-14-16-24V16z" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <path d="M24 31l6 6 10-12" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Trusted Local Installers</h3>
              <p className="text-xs text-gray-600 leading-relaxed">We work with reputable North Shore businesses experienced in heat pump installation.</p>
            </div>

            {/* Free To Use */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 64 64" className="w-12 h-12">
                  <circle cx="32" cy="32" r="18" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <path d="M32 20v24" stroke="#10B981" strokeWidth="3"/>
                  <path d="M26 24c0-3 3-5 6-5s6 2 6 5-2 4-6 5-6 2-6 5 3 5 6 5 6-2 6-5" fill="none" stroke="#10B981" strokeWidth="3"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Free To Use</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Our service is completely free for homeowners.</p>
            </div>

            {/* No Obligation */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 64 64" className="w-12 h-12">
                  <rect x="20" y="14" width="24" height="36" rx="2" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <path d="M25 24h14M25 32h14M25 40h10" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">No Obligation</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Get connected with installers at no cost and decide if you'd like to proceed.</p>
            </div>

            {/* North Shore Experts */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 64 64" className="w-12 h-12">
                  <path d="M32 52s12-12 12-22a12 12 0 10-24 0c0 10 12 22 12 22z" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <circle cx="32" cy="30" r="4" fill="#10B981"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">North Shore Experts</h3>
              <p className="text-xs text-gray-600 leading-relaxed">We only work with installers who service Auckland's North Shore.</p>
            </div>

            {/* One Request Multiple Options */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 64 64" className="w-12 h-12">
                  <circle cx="24" cy="24" r="8" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <circle cx="42" cy="24" r="8" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <path d="M12 48c2-8 8-12 12-12s10 4 12 12" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <path d="M30 48c2-8 8-12 12-12s10 4 12 12" fill="none" stroke="#10B981" strokeWidth="3"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Multiple Options</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Receive multiple quotes to compare and choose from.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COVERAGE */}
      <section id="coverage" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">Local Installers, Local Knowledge</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
              Local Installers Across<br/>Auckland's North Shore
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We connect homeowners with trusted installers<br/>who service their local area.
            </p>
          </div>

          {/* Suburb Chips - 2 Rows */}
          <div className="max-w-4xl mx-auto mb-16">
            {/* Row 1 */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {suburbs.slice(0, 5).map((suburb) => (
                <div
                  key={suburb}
                  className="flex items-center gap-2 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-full text-sm text-emerald-900 font-medium hover:bg-emerald-100 transition"
                >
                  <svg width="18" height="18" viewBox="0 0 64 64" className="w-4 h-4 flex-shrink-0">
                    <path d="M32 54s14-14 14-24a14 14 0 10-28 0c0 10 14 24 14 24z" fill="none" stroke="#10B981" strokeWidth="3"/>
                    <circle cx="32" cy="30" r="4.5" fill="#10B981"/>
                  </svg>
                  {suburb}
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap justify-center gap-4">
              {suburbs.slice(5, 10).map((suburb) => (
                <div
                  key={suburb}
                  className="flex items-center gap-2 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-full text-sm text-emerald-900 font-medium hover:bg-emerald-100 transition"
                >
                  <svg width="18" height="18" viewBox="0 0 64 64" className="w-4 h-4 flex-shrink-0">
                    <path d="M32 54s14-14 14-24a14 14 0 10-28 0c0 10 14 24 14 24z" fill="none" stroke="#10B981" strokeWidth="3"/>
                    <circle cx="32" cy="30" r="4.5" fill="#10B981"/>
                  </svg>
                  {suburb}
                </div>
              ))}
            </div>
          </div>

          {/* Expansion Notice */}
          <div className="bg-gray-50 rounded-lg p-8 flex items-start gap-6">
            <div className="flex-shrink-0">
              <svg width="64" height="64" viewBox="0 0 64 64" className="w-12 h-12">
                <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                <path d="M16 20l12-4 8 4 12-4v28l-12 4-8-4-12 4z" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinejoin="round"/>
                <path d="M28 16v28M36 20v28" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expanding Across Auckland Soon</h3>
              <p className="text-gray-600">We're growing our network to help more homeowners across Auckland find the right heat pump installer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: RECENT PROJECTS */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            Recent Project Requests
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {recentProjects.map((project, idx) => (
              <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                {/* Image */}
                <div className="relative h-48 w-full bg-gray-300 overflow-hidden">
                  <img
                    src={project.image}
                    alt={`${project.suburb} - ${project.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="p-4">
                  <p className="text-xs font-bold text-emerald-600 mb-2">{project.suburb}</p>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{project.title}</h4>
                  <p className="text-xs text-gray-600">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: TRUST */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-emerald-200">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Trust Badge + Text */}
              <div className="flex gap-6 items-start">
                <svg width="56" height="56" viewBox="0 0 64 64" className="w-14 h-14 flex-shrink-0">
                  <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                  <path d="M32 10l16 6v12c0 10-6 18-16 24-10-6-16-14-16-24V16z" fill="none" stroke="#10B981" strokeWidth="3.5"/>
                  <path d="M24 31l5 5 11-12" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
                </svg>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Local Installers You Can Trust</h3>
                  <p className="text-gray-700 leading-relaxed">
                    HeatMatch works with experienced installers serving Auckland's North Shore. Every enquiry is reviewed before being passed on, helping ensure businesses receive high-quality opportunities and homeowners receive the right support.
                  </p>
                </div>
              </div>

              {/* Right: 4 Trust Points */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <svg width="32" height="32" viewBox="0 0 64 64" className="w-8 h-8 flex-shrink-0">
                    <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                    <path d="M32 10l16 6v12c0 10-6 18-16 24-10-6-16-14-16-24V16z" fill="none" stroke="#10B981" strokeWidth="3.5"/>
                    <path d="M24 31l5 5 11-12" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">Quality checked leads</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="32" height="32" viewBox="0 0 64 64" className="w-8 h-8 flex-shrink-0">
                    <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                    <path d="M18 28h28v18H18z" fill="none" stroke="#10B981" strokeWidth="3"/>
                    <path d="M16 28l4-10h24l4 10" fill="none" stroke="#10B981" strokeWidth="3"/>
                    <path d="M28 46v-8h8v8" fill="none" stroke="#10B981" strokeWidth="3"/>
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">Trusted local businesses</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="32" height="32" viewBox="0 0 64 64" className="w-8 h-8 flex-shrink-0">
                    <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                    <circle cx="32" cy="32" r="16" fill="none" stroke="#10B981" strokeWidth="3"/>
                    <path d="M32 24v8l6 3" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
                    <path d="M46 18l4 4-4 4" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">Fast response times</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="32" height="32" viewBox="0 0 64 64" className="w-8 h-8 flex-shrink-0">
                    <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                    <circle cx="32" cy="32" r="16" fill="none" stroke="#10B981" strokeWidth="3.5"/>
                    <path d="M24 33l6 6 10-12" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 18l2 4 4 .5-3 3 .8 4.5-3.8-2-3.8 2 .8-4.5-3-3 4-.5z" fill="#10B981"/>
                    <path d="M44 18l2 4 4 .5-3 3 .8 4.5-3.8-2-3.8 2 .8-4.5-3-3 4-.5z" fill="#10B981"/>
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">High customer satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ */}
      <section id="faq" className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <details key={idx} className="group border border-gray-200 rounded-lg">
                <summary className="flex justify-between items-center w-full p-4 cursor-pointer hover:bg-gray-50 transition">
                  <span className="font-semibold text-gray-900">{item.q}</span>
                  <svg className="w-5 h-5 text-gray-600 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-gray-600">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready To Find A Heat Pump Installer?
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Tell us about your project and get connected with a trusted local installer today.
              </p>
              <button
                onClick={() => { setSelectedService(null); setShowStepper(true); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition"
              >
                Get My Free Quote →
              </button>
              <div className="flex items-center gap-6 mt-6 text-sm text-gray-400">
                <span>✓ Free • No obligation • North Shore specialists</span>
              </div>
            </div>

            {/* Right: Heat Pump Image */}
            <div className="hidden md:block rounded-lg h-64 overflow-hidden">
              <img
                src="/images/final-cta-heatpump.jpg"
                alt="Heat Pump Installation"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/icons/heatmatch-logo-white.svg" alt="HeatMatch" className="h-8 mb-4" />
              <p className="text-sm">Connecting North Shore homeowners with trusted heat pump installers.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white transition">About</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <p className="text-sm">hello@heatmatch.nz</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>© HeatMatch 2026. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Quote Form Stepper Modal */}
      <QuoteFormStepper
        isOpen={showStepper}
        onClose={() => setShowStepper(false)}
        initialServiceType={selectedService || undefined}
      />
    </main>
  );
}
