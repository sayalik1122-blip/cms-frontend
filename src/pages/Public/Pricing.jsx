import React from 'react';
import Navbar from '../Landing/components/Navbar';
import Footer from '../Landing/components/Footer';
import { motion } from 'framer-motion';
import { MdCheckCircle } from 'react-icons/md';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "₹4,999",
      period: "/month",
      description: "Perfect for small training centers and local schools.",
      features: ["Up to 200 Students", "Student Management", "Basic Attendance", "Email Support"],
      button: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "₹14,999",
      period: "/month",
      description: "Best for growing colleges and private institutions.",
      features: ["Up to 1000 Students", "Faculty & Subject Mgmt", "Advanced Analytics", "Fee Management", "Priority Support"],
      button: "Choose Professional",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Full-scale solution for universities and large colleges.",
      features: ["Unlimited Students", "Multi-campus Support", "Exam & Result Module", "Dedicated Account Manager", "24/7 Phone Support"],
      button: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Simple, Transparent Pricing</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Choose the plan that best fits your institution's needs. Scale as you grow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`card p-8 flex flex-col relative ${plan.popular ? 'border-2 border-primary-500 shadow-xl scale-105 z-10' : ''}`}
            >
              {plan.popular && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">{plan.period}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">{plan.description}</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <MdCheckCircle className="text-primary-500 mr-3 text-lg" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-lg font-bold transition-all ${plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                {plan.button}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
