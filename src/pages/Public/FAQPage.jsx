import React, { useState } from 'react';
import Navbar from '../Landing/components/Navbar';
import Footer from '../Landing/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { MdExpandMore, MdSearch, MdQuestionAnswer } from 'react-icons/md';

const faqCategories = [
  {
    category: "General",
    questions: [
      { q: "What is EduAdmin?", a: "EduAdmin is a comprehensive College Management System designed to digitize and automate all institutional operations." },
      { q: "Is there a mobile app?", a: "Yes, our system is fully responsive and can be used on any mobile browser. A native mobile app is also available for Android and iOS." }
    ]
  },
  {
    category: "Admissions & Students",
    questions: [
      { q: "How do I enroll a new student?", a: "Admins can add students through the 'Students' module in the dashboard by providing their basic details and course information." },
      { q: "Can students view their own results?", a: "Yes, students have a dedicated login where they can view their results, attendance, and fee status." }
    ]
  },
  {
    category: "Technical Support",
    questions: [
      { q: "How secure is my data?", a: "We use bank-grade encryption and daily backups to ensure your institution's data is always safe and accessible." },
      { q: "Can we integrate with our existing website?", a: "Absolutely. We provide widgets and APIs to integrate login and admission forms directly into your current college website." }
    ]
  }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="text-base font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
          {question}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-xl text-slate-400">
          <MdExpandMore />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl mb-4">
            <MdQuestionAnswer size={32} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-600 dark:text-slate-400">Find answers to common questions about the EduAdmin platform.</p>
        </div>

        <div className="space-y-12">
          {faqCategories.map((cat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary-500 rounded-full mr-3"></span>
                {cat.category}
              </h2>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {cat.questions.map((item, qIdx) => (
                  <FAQItem key={qIdx} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;
