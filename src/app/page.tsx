'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

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
      time: 'Just now',
      image: '/images/project-1.jpg',
    },
    {
      suburb: 'TAKAPUNA',
      title: 'Replacement unit',
      desc: 'Existing heat pump upgrade',
      time: '1 hour ago',
      image: '/images/project-2.jpg',
    },
    {
      suburb: 'BROWNS BAY',
      title: 'Commercial installation',
      desc: 'Small office fit-out',
      time: '2 hours ago',
      image: '/images/project-3.jpg',
    },
    {
      suburb: 'MILFORD',
      title: 'Bedroom installation',
      desc: 'Single room heat pump',
      time: '3 hours ago',
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
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition">
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
                Find The Right<br/>Heat Pump Installer<br/><span className="text-emerald-600">In Minutes</span>
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
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex-1 h-2 bg-emerald-200 rounded-full"></div>
                  <span className="text-xs font-semibold text-gray-600">Step 1 of 5</span>
                </div>

                {/* Form Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-6">What do you need help with?</h2>

                {/* Service Options */}
                <div className="space-y-3 mb-8">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition ${
                        selectedService === service.id
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <img src={service.icon} alt="" className="w-6 h-6 flex-shrink-0" />
                      <span className={`text-left font-medium ${selectedService === service.id ? 'text-gray-900' : 'text-gray-700'}`}>
                        {service.label}
                      </span>
                      <svg className="w-5 h-5 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>

                {/* Continue Button */}
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition mb-4">
                  Continue →
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
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <svg width="80" height="80" viewBox="0 0 64 64" className="w-16 h-16">
                  <circle cx="32" cy="32" r="26" fill="#ECFDF5" stroke="#10B981" strokeWidth="2"/>
                  <rect x="20" y="16" width="24" height="32" rx="3" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <line x1="25" y1="26" x2="39" y2="26" stroke="#10B981" strokeWidth="3"/>
                  <line x1="25" y1="34" x2="39" y2="34" stroke="#10B981" strokeWidth="3"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tell Us About Your Project</h3>
              <p className="text-gray-600">Answer a few quick questions about your property and requirements.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <svg width="80" height="80" viewBox="0 0 64 64" className="w-16 h-16">
                  <circle cx="32" cy="32" r="26" fill="#ECFDF5" stroke="#10B981" strokeWidth="2"/>
                  <circle cx="28" cy="28" r="10" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <line x1="36" y1="36" x2="46" y2="46" stroke="#10B981" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">We Review Your Request</h3>
              <p className="text-gray-600">We assess your project and match it with the right installer.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <svg width="80" height="80" viewBox="0 0 64 64" className="w-16 h-16">
                  <circle cx="32" cy="32" r="26" fill="#ECFDF5" stroke="#10B981" strokeWidth="2"/>
                  <circle cx="24" cy="26" r="6" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <circle cx="40" cy="26" r="6" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <path d="M16 46c2-6 7-10 16-10s14 4 16 10" fill="none" stroke="#10B981" strokeWidth="3"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get Connected</h3>
              <p className="text-gray-600">A trusted local installer contacts you to discuss your options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY HEATMATCH */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            Why Homeowners Use HeatMatch
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Save Time */}
            <div className="bg-white rounded-lg p-8">
              <div className="mb-4 flex justify-center">
                <svg width="56" height="56" viewBox="0 0 64 64" className="w-12 h-12">
                  <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                  <circle cx="32" cy="32" r="18" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <path d="M32 22v12l8 5" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Save Time</h3>
              <p className="text-gray-600 text-center">No need to call multiple businesses.</p>
            </div>

            {/* Trusted Installers */}
            <div className="bg-white rounded-lg p-8">
              <div className="mb-4 flex justify-center">
                <svg width="56" height="56" viewBox="0 0 64 64" className="w-12 h-12">
                  <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                  <path d="M32 10l18 6v14c0 11-7 20-18 24-11-4-18-13-18-24V16z" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinejoin="round"/>
                  <path d="M24 32l6 6 12-14" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Trusted Installers</h3>
              <p className="text-gray-600 text-center">We only work with reputable local providers.</p>
            </div>

            {/* Free To Use */}
            <div className="bg-white rounded-lg p-8">
              <div className="mb-4 flex justify-center">
                <svg width="56" height="56" viewBox="0 0 64 64" className="w-12 h-12">
                  <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                  <circle cx="32" cy="32" r="16" fill="none" stroke="#10B981" strokeWidth="3.5"/>
                  <path d="M24 32h16" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
                  <path d="M28 28l-4 4 4 4" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Free To Use</h3>
              <p className="text-gray-600 text-center">No fees. No obligations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COVERAGE */}
      <section id="coverage" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Proudly Serving Auckland's North Shore
          </h2>
          <p className="text-center text-gray-600 mb-12">Specialists who know your local area</p>

          {/* Suburb Chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {suburbs.map((suburb) => (
              <div
                key={suburb}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-sm text-emerald-900 font-medium"
              >
                <svg width="16" height="16" viewBox="0 0 64 64" className="w-4 h-4 flex-shrink-0">
                  <path d="M32 54s14-14 14-24a14 14 0 10-28 0c0 10 14 24 14 24z" fill="none" stroke="#10B981" strokeWidth="3"/>
                  <circle cx="32" cy="30" r="4.5" fill="#10B981"/>
                </svg>
                {suburb}
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm">
            Expanding across Auckland soon.
          </p>
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
                  <p className="text-xs text-gray-600 mb-3">{project.desc}</p>
                  <p className="text-xs text-gray-500">{project.time}</p>
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
              {/* Left: Trust Badge */}
              <div>
                <svg width="56" height="56" viewBox="0 0 64 64" className="w-12 h-12 mb-6">
                  <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                  <path d="M32 10l16 6v12c0 10-6 18-16 24-10-6-16-14-16-24V16z" fill="none" stroke="#10B981" strokeWidth="3.5"/>
                  <path d="M24 31l5 5 11-12" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
                </svg>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Local Installers You Can Trust</h3>
                <p className="text-gray-700 leading-relaxed">
                  HeatMatch works with experienced installers serving Auckland's North Shore. Every enquiry is reviewed before being passed on, helping ensure businesses receive high-quality opportunities and homeowners receive the right support.
                </p>
              </div>

              {/* Right: 4 Trust Points */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <svg width="32" height="32" viewBox="0 0 64 64" className="w-8 h-8 flex-shrink-0 mt-1">
                    <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                    <path d="M32 10l16 6v12c0 10-6 18-16 24-10-6-16-14-16-24V16z" fill="none" stroke="#10B981" strokeWidth="3.5"/>
                    <path d="M24 31l5 5 11-12" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">Quality checked leads</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg width="32" height="32" viewBox="0 0 64 64" className="w-8 h-8 flex-shrink-0 mt-1">
                    <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                    <path d="M18 28h28v18H18z" fill="none" stroke="#10B981" strokeWidth="3"/>
                    <path d="M16 28l4-10h24l4 10" fill="none" stroke="#10B981" strokeWidth="3"/>
                    <path d="M28 46v-8h8v8" fill="none" stroke="#10B981" strokeWidth="3"/>
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">Trusted local businesses</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg width="32" height="32" viewBox="0 0 64 64" className="w-8 h-8 flex-shrink-0 mt-1">
                    <circle cx="32" cy="32" r="28" fill="#ECFDF5"/>
                    <circle cx="32" cy="32" r="16" fill="none" stroke="#10B981" strokeWidth="3"/>
                    <path d="M32 24v8l6 3" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
                    <path d="M46 18l4 4-4 4" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">Fast response times</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg width="32" height="32" viewBox="0 0 64 64" className="w-8 h-8 flex-shrink-0 mt-1">
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
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition">
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
              <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-8 mb-4" />
              <p className="text-sm">Connecting North Shore homeowners with trusted heat pump installers.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
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
    </main>
  );
}
