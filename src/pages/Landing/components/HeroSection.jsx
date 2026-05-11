import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowForward, MdPerson, MdAdminPanelSettings } from 'react-icons/md';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 transition-colors -z-20"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary-400/20 dark:bg-primary-900/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm mb-6 border border-primary-100 dark:border-primary-800/50">
              <span className="flex w-2 h-2 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
              v2.0 is now live!
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Smart College <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                Management System
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0">
              Streamline your institution's administration, boost productivity, and enhance the learning experience with our comprehensive all-in-one ERP platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center group"
              >
                Start for free
                <MdArrowForward className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <MdAdminPanelSettings className="text-xl" /> Admin Login
              </button>
            </div>

            {/* Student Login — separate prominent row */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-4">
              <button
                onClick={() => navigate('/login', { state: { role: 'student' } })}
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MdPerson className="text-lg" /> Student Login
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400 sm:ml-2">
                Students: use your college email to sign in
              </p>
            </div>
          </motion.div>

          {/* Illustration / Image */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-none relative"
          >
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
               <img src="/images/hero.png" alt="Indian College Campus" className="w-full h-full object-cover" />
            </div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg">↑</div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Efficiency</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">+ 45%</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
