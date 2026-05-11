import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import StatsSection from './components/StatsSection';
import AboutSection from './components/AboutSection';
import DashboardPreview from './components/DashboardPreview';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

const Landing = () => {
  // Ensure we start at the top of the page when loading
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-primary-500/30">
      <Navbar />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <AboutSection />
        <DashboardPreview />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <Footer />
      
      {/* Scroll to top button - simple implementation */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-colors z-50 focus:outline-none"
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </div>
  );
};

export default Landing;
