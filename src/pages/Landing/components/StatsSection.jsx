import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.substring(0, value.length - 1)) || parseInt(value);
      const suffix = value.includes('+') ? '+' : '';
      if (start === end) return;

      let totalMilSecDur = parseInt(duration);
      let incrementTime = (totalMilSecDur / end) * 1000;

      let timer = setInterval(() => {
        start += 1;
        setCount(String(start) + suffix);
        if (start === end) clearInterval(timer);
      }, incrementTime);
      
      // Fallback for large numbers
      if(end > 100) {
          clearInterval(timer);
          let startTime = null;
          const step = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
              setCount(Math.floor(progress * end) + suffix);
              if (progress < 1) {
                  window.requestAnimationFrame(step);
              }
          };
          window.requestAnimationFrame(step);
      }
    }
  }, [value, duration, isInView]);

  return <span ref={ref}>{count || '0'}</span>;
};

const StatsSection = () => {
  const stats = [
    { label: 'Total Students', value: '1250+' },
    { label: 'Total Faculty', value: '85+' },
    { label: 'Departments', value: '12' },
    { label: 'Courses Offered', value: '45+' },
  ];

  return (
    <section className="py-16 bg-primary-600 dark:bg-primary-900 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                <Counter value={stat.value} />
              </div>
              <div className="text-primary-100 font-medium text-sm md:text-base uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
