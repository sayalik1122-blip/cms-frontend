import React from 'react';
import { motion } from 'framer-motion';
import { MdStar } from 'react-icons/md';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Principal, Modern Academy',
    image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=random',
    text: 'EduAdmin completely transformed how we manage our daily operations. The interface is incredibly intuitive, and our staff adopted it within days. Highly recommended!',
    rating: 5
  },
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Head of Computer Science',
    image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=random',
    text: 'The timetable generation feature alone saved us weeks of manual planning. The analytics dashboard gives me real-time insights into student performance.',
    rating: 5
  },
  {
    name: 'Aditi Patel',
    role: 'Student, Senior Year',
    image: 'https://ui-avatars.com/api/?name=Aditi+Patel&background=random',
    text: 'I love being able to check my attendance, grades, and fee status all in one place. It makes staying organized so much easier.',
    rating: 4
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-800/30 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Trusted by Educators & Students
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Don't just take our word for it. Here's what our users have to say about their experience with EduAdmin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <div className="flex space-x-1 mb-6 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <MdStar key={i} className={i < testimonial.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'} />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-8 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full ring-2 ring-primary-100 dark:ring-primary-900"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
