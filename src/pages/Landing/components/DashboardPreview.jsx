import React from 'react';
import { motion } from 'framer-motion';

const DashboardPreview = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary-500/5 dark:bg-primary-900/10 blur-3xl -z-10 rounded-full"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Experience a Beautiful Interface
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Our dashboard is meticulously designed to provide all the information you need at a glance, without feeling cluttered or overwhelming.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring", stiffness: 50 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Main Dashboard Mockup */}
          <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden border-[8px] border-slate-100 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 group">
            {/* Window controls */}
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="mx-auto text-xs font-medium text-slate-400 dark:text-slate-500 flex-1 text-center pr-10">dashboard.eduadmin.com</div>
            </div>
            
            {/* The Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
               {/* Since we don't have a real screenshot, we will build a stylized mockup of the dashboard using divs */}
               <div className="absolute inset-0 flex">
                  {/* Sidebar */}
                  <div className="w-48 border-r border-slate-200 dark:border-slate-700 p-4 hidden md:block">
                     <div className="h-6 w-24 bg-primary-600/20 rounded mb-8"></div>
                     <div className="space-y-3">
                       {[...Array(6)].map((_, i) => (
                         <div key={i} className={`h-8 w-full rounded ${i === 0 ? 'bg-primary-600/20' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                       ))}
                     </div>
                  </div>
                  {/* Main Content */}
                  <div className="flex-1 p-6 flex flex-col">
                     <div className="h-8 w-full flex justify-between items-center mb-6">
                        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="flex space-x-2">
                           <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                           <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        </div>
                     </div>
                     <div className="grid grid-cols-4 gap-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-24 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4"></div>
                        ))}
                     </div>
                     <div className="flex-1 flex gap-4">
                        <div className="flex-[2] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4"></div>
                        <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4"></div>
                     </div>
                  </div>
               </div>
               
               {/* Hover Overlay */}
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                 <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-lg transform scale-95 group-hover:scale-100 transition-transform">
                   View Live Demo
                 </button>
               </div>
            </div>
          </div>

          {/* Floating elements for depth */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute -right-8 -bottom-8 md:-right-16 md:-bottom-12 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-48 md:w-64 z-10 hidden sm:block"
          >
             <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">📈</div>
                <div>
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
                  <div className="h-2 w-10 bg-slate-100 dark:bg-slate-600 rounded"></div>
                </div>
             </div>
             <div className="h-16 w-full bg-slate-50 dark:bg-slate-900 rounded-lg"></div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -left-8 top-1/4 md:-left-12 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-40 z-10 hidden sm:block"
          >
             <div className="space-y-3">
               {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-600 rounded"></div>
                  </div>
               ))}
             </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
