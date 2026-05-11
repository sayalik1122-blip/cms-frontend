import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdExpandMore } from 'react-icons/md';

const faqs = [
  {
    question: "Is this system suitable for all types of colleges?",
    answer: "Yes, our CMS is highly modular and customizable. Whether you are an Engineering college, Medical school, or Arts & Science institution, the system adapts to your specific requirements."
  },
  {
    question: "How secure is student and faculty data?",
    answer: "We prioritize security with industry-standard encryption, role-based access control, and regular data backups to ensure all sensitive information remains protected."
  },
  {
    question: "Can we integrate existing biometric attendance systems?",
    answer: "Absolutely. Our system features a robust API layer that allows seamless integration with most biometric and RFID hardware for automated attendance tracking."
  },
  {
    question: "Does the system support mobile access?",
    answer: "Yes, the entire platform is built with a mobile-first responsive design, allowing students and faculty to access the dashboard from any smartphone or tablet."
  },
  {
    question: "Is there a dedicated support team for technical issues?",
    answer: "We offer 24/7 technical support through chat, email, and phone to ensure your institution's operations run smoothly without any downtime."
  }
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button 
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-2xl text-slate-400"
        >
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
            <p className="pb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="w-20 h-1.5 bg-primary-600 mx-auto rounded-full"></div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 md:p-8 border border-slate-100 dark:border-slate-700">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
