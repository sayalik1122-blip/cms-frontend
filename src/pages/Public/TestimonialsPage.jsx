import React, { useEffect } from 'react';
import Navbar from '../Landing/components/Navbar';
import TestimonialsSection from '../Landing/components/TestimonialsSection';
import Footer from '../Landing/components/Footer';

const TestimonialsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-20">
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
