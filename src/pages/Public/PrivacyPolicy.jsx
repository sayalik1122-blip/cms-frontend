import React from 'react';
import Navbar from '../Landing/components/Navbar';
import Footer from '../Landing/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400">
          <p>Last updated: May 11, 2026</p>
          
          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">1. Information We Collect</h2>
            <p>At EduAdmin, we collect various types of information to provide and improve our Services to you, including personal data like names, email addresses, and institution details.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">2. How We Use Your Information</h2>
            <p>We use the collected data for various purposes: to provide and maintain our Service, to notify you about changes, to provide customer support, and to gather analysis to improve the Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">3. Data Security</h2>
            <p>The security of your data is important to us. We strive to use commercially acceptable means to protect your Personal Data, including encryption and regular security audits.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">4. Indian Data Laws</h2>
            <p>We comply with all relevant Indian data protection laws and guidelines issued by the Ministry of Electronics and Information Technology (MeitY).</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
