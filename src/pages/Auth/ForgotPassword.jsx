import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdArrowBack } from 'react-icons/md';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Forgot Password?</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MdEmail className="text-slate-400 text-xl" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10" 
                  placeholder="name@college.edu" 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3">
              Reset Password
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm">
              We've sent a password reset link to <strong>{email}</strong>
            </div>
            <button onClick={() => setSubmitted(false)} className="text-primary-600 dark:text-primary-400 font-medium hover:underline text-sm">
              Didn't receive the email? Click to resend
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <MdArrowBack className="mr-2" /> Back to Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
