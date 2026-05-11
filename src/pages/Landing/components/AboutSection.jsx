import React from 'react';
import { motion } from 'framer-motion';
import { MdCheckCircle } from 'react-icons/md';

const AboutSection = () => {
  const benefits = [
    "100% Cloud-based & Secure",
    "Real-time Data Synchronization",
    "Automated Reporting & Analytics",
    "Role-based Access Control",
    "Parent-Teacher Communication Portal",
    "24/7 Dedicated Support"
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 dark:bg-slate-800/50 transition-colors overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left side: Images/Grid */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 translate-y-8">
                <div className="h-48 md:h-64 rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-lg border-2 border-white dark:border-slate-800">
                  <img src="/images/study.png" alt="Students Studying" className="w-full h-full object-cover" />
                </div>
                <div className="h-32 md:h-48 rounded-2xl bg-primary-200 dark:bg-primary-900 overflow-hidden shadow-lg border-2 border-white dark:border-slate-800 flex items-center justify-center p-4">
                  <div className="text-center">
                    <h4 className="text-3xl font-bold text-primary-700 dark:text-primary-300">10+</h4>
                    <p className="text-sm font-medium text-primary-800 dark:text-primary-200">Years of Excellence</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-32 md:h-48 rounded-2xl bg-purple-200 dark:bg-purple-900 overflow-hidden shadow-lg border-2 border-white dark:border-slate-800">
                   <img src="/images/campus.png" alt="Campus Building" className="w-full h-full object-cover" />
                </div>
                <div className="h-48 md:h-64 rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-lg border-2 border-white dark:border-slate-800">
                  <img src="/images/graduation.png" alt="Graduation" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side: Text */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Transforming Education Through Technology
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Our mission is to bridge the gap between education and technology. We provide a robust, scalable, and intuitive platform designed specifically for modern educational institutions to handle their day-to-day administrative tasks seamlessly.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              From student enrollment to alumni management, EduAdmin brings all your stakeholders—students, teachers, parents, and management—onto a single unified platform.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <MdCheckCircle className="text-primary-500 text-xl flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <button className="mt-10 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg">
              Read Our Full Story
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
