import React, { useEffect } from 'react';
import Navbar from '../Landing/components/Navbar';
import AboutSection from '../Landing/components/AboutSection';
import StatsSection from '../Landing/components/StatsSection';
import Footer from '../Landing/components/Footer';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-20">
        <AboutSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
