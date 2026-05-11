import React from 'react';
import Navbar from '../Landing/components/Navbar';
import Footer from '../Landing/components/Footer';
import { MdSearch, MdBook, MdCode, MdSettings, MdDashboard } from 'react-icons/md';

const Documentation = () => {
  const sections = [
    { title: "Getting Started", icon: <MdDashboard />, items: ["Introduction", "Quick Start Guide", "System Requirements"] },
    { title: "Admin Features", icon: <MdSettings />, items: ["Managing Students", "Faculty Onboarding", "Subject Allocation"] },
    { title: "Financials", icon: <MdBook />, items: ["Fee Structure", "Transaction Reports", "Invoicing"] },
    { title: "API Reference", icon: <MdCode />, items: ["Authentication", "Endpoints", "Webhooks"] },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-8">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" className="input-field pl-10 text-sm" placeholder="Search docs..." />
            </div>
            {sections.map((section, idx) => (
              <div key={idx}>
                <h4 className="flex items-center text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
                  <span className="mr-2 text-primary-500">{section.icon}</span>
                  {section.title}
                </h4>
                <ul className="space-y-2 pl-6 border-l border-slate-100 dark:border-slate-800">
                  {section.items.map((item, iIdx) => (
                    <li key={iIdx}>
                      <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Documentation</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">Learn how to configure, use, and extend the EduAdmin College Management System.</p>
            
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Introduction</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EduAdmin is a state-of-the-art College Management System (CMS) designed specifically for the needs of Indian higher education institutions. It provides a comprehensive suite of tools for student lifecycle management, faculty administration, and financial operations.</p>
              </section>

              <section className="p-6 bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary-500 rounded-r-lg">
                <h4 className="font-bold text-primary-800 dark:text-primary-400 mb-2">Pro Tip</h4>
                <p className="text-sm text-primary-700 dark:text-primary-300/80">You can use the keyboard shortcut <kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded border border-primary-200 dark:border-primary-800">Cmd + K</kbd> to search documentation from anywhere.</p>
              </section>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Documentation;
