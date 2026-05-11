import React from 'react';
import Navbar from '../Landing/components/Navbar';
import Footer from '../Landing/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400">
          <p>By accessing or using EduAdmin, you agree to be bound by these Terms of Service.</p>
          
          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">1. Use of Service</h2>
            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">2. Subscription and Payments</h2>
            <p>Access to certain features of the Service requires a paid subscription. All fees are non-refundable unless otherwise specified in writing.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">3. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of EduAdmin Inc. and its licensors.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
