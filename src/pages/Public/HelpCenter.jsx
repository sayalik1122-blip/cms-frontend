import React from 'react';
import Navbar from '../Landing/components/Navbar';
import Footer from '../Landing/components/Footer';
import { MdHelp, MdQuestionAnswer, MdVideoLibrary, MdChat } from 'react-icons/md';

const HelpCenter = () => {
  const categories = [
    { title: "User Guides", icon: <MdHelp />, desc: "Step-by-step instructions for all features." },
    { title: "FAQ", icon: <MdQuestionAnswer />, desc: "Quick answers to common questions." },
    { title: "Video Tutorials", icon: <MdVideoLibrary />, desc: "Watch and learn how to use the dashboard." },
    { title: "Community", icon: <MdChat />, desc: "Connect with other EduAdmin users." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">How can we help you?</h1>
          <div className="relative max-w-xl mx-auto">
            <input type="text" className="input-field py-4 pl-12 shadow-lg" placeholder="Search for articles, guides..." />
            <MdHelp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          {categories.map((cat, idx) => (
            <div key={idx} className="card p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                {cat.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{cat.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{cat.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Still need help?</h2>
            <p className="text-slate-600 dark:text-slate-400">Our support team is available 24/7 to assist you with any technical issues.</p>
          </div>
          <button className="btn-primary whitespace-nowrap px-8 py-4">Contact Support</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HelpCenter;
