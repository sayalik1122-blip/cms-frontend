import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdHome, MdArrowBack, MdSchool } from 'react-icons/md';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-300/20 dark:bg-primary-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 mb-12"
      >
        <div className="p-2 bg-primary-600 rounded-xl">
          <MdSchool className="text-white text-2xl" />
        </div>
        <span className="text-2xl font-bold text-slate-800 dark:text-white">EduAdmin</span>
      </motion.div>

      {/* 404 big number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        className="relative mb-6 select-none"
      >
        <span className="text-[9rem] sm:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary-500 to-purple-600 drop-shadow-sm">
          404
        </span>
        {/* Floating dot decorations */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="absolute -top-4 -right-4 w-6 h-6 bg-primary-400 rounded-full opacity-60"
        />
        <motion.div
          animate={{ y: [8, -8, 8] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute bottom-4 -left-6 w-4 h-4 bg-purple-400 rounded-full opacity-50"
        />
        <motion.div
          animate={{ y: [-5, 10, -5] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute top-1/2 -right-10 w-3 h-3 bg-emerald-400 rounded-full opacity-50"
        />
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="text-center mb-10"
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm sm:text-base">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-7 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          <MdHome className="text-xl" />
          Go to Home
        </button>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <MdArrowBack className="text-xl" />
          Go Back
        </button>
      </motion.div>

      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 text-xs text-slate-400 dark:text-slate-600"
      >
        EduAdmin · College Management System
      </motion.p>
    </div>
  );
};

export default NotFound;
