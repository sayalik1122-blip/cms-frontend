import React from 'react';
import { motion } from 'framer-motion';
import { MdPeople, MdPerson, MdBook, MdSchedule, MdAttachMoney, MdAnalytics } from 'react-icons/md';

const features = [
  {
    title: 'Student Management',
    description: 'Easily manage student records, admissions, attendance, and performance tracking in one place.',
    icon: <MdPeople className="text-3xl text-blue-500" />,
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
  },
  {
    title: 'Faculty Dashboard',
    description: 'Empower educators with tools for grading, scheduling, and seamless student communication.',
    icon: <MdPerson className="text-3xl text-green-500" />,
    color: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800'
  },
  {
    title: 'Subject Management',
    description: 'Organize curriculum, assign faculty to subjects, and track syllabus completion effortlessly.',
    icon: <MdBook className="text-3xl text-purple-500" />,
    color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800'
  },
  {
    title: 'Timetable System',
    description: 'Automate class scheduling to avoid conflicts and optimize resource allocation across departments.',
    icon: <MdSchedule className="text-3xl text-amber-500" />,
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'
  },
  {
    title: 'Fee Management',
    description: 'Streamline fee collection, generate invoices, and send automated reminders for pending dues.',
    icon: <MdAttachMoney className="text-3xl text-emerald-500" />,
    color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800'
  },
  {
    title: 'Analytics Dashboard',
    description: 'Make data-driven decisions with real-time insights, visual charts, and comprehensive reports.',
    icon: <MdAnalytics className="text-3xl text-pink-500" />,
    color: 'bg-pink-50 dark:bg-pink-900/20 border-pink-100 dark:border-pink-800'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything you need to manage your institution
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Our modular platform provides all the essential tools required to run a modern educational organization efficiently.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className={`p-6 rounded-2xl border ${feature.color} hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-300 group`}
            >
              <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
