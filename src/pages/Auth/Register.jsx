import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff, MdEmail, MdLock, MdPerson, MdSchool, MdBusiness } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

// Each input field gets its own controlled state — no shared `form` object to avoid
// stale closures when Field is a local component.
const InputField = ({ label, value, onChange, type = 'text', placeholder, icon, error, suffix }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 ${suffix ? 'pr-12' : 'pr-4'} py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
          error
            ? 'border-red-400 focus:ring-red-300 dark:focus:ring-red-700'
            : 'border-slate-300 dark:border-slate-600 focus:ring-primary-400 focus:border-primary-400'
        }`}
      />
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
      )}
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
);

const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const strength = password.length < 6 ? 1 : password.length < 9 ? 2 : password.length < 12 ? 3 : 4;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength ? colors[strength] : 'bg-slate-200 dark:bg-slate-600'}`} />
        ))}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{labels[strength]} password</p>
    </div>
  );
};

const Register = () => {
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect already-logged-in users
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const clearErr = (field) => setErrors(e => ({ ...e, [field]: '', general: '' }));

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!institution.trim()) errs.institution = 'Institution name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register({ name, email, password, institution });
    if (result.success) {
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } else {
      toast.error(result.error || 'Registration failed');
      setErrors({ general: result.error });
    }
  };

  const EyeToggle = (
    <button
      type="button"
      onClick={() => setShowPassword(s => !s)}
      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
      tabIndex={-1}
    >
      {showPassword ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-slate-50 to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 px-4 py-10 relative overflow-hidden">
      <div className="absolute top-[-80px] right-[-80px] w-96 h-96 bg-primary-400 rounded-full filter blur-3xl opacity-20 dark:opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl opacity-20 dark:opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg shadow-primary-500/30 mb-4">
              <MdSchool className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Register your institution on EduAdmin</p>
          </div>

          {/* General error */}
          {errors.general && (
            <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-sm text-red-600 dark:text-red-300">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField
              label="Full Name *"
              value={name}
              onChange={e => { setName(e.target.value); clearErr('name'); }}
              placeholder="Dr. Rajesh Kumar"
              icon={<MdPerson />}
              error={errors.name}
            />

            <InputField
              label="Institution Name *"
              value={institution}
              onChange={e => { setInstitution(e.target.value); clearErr('institution'); }}
              placeholder="National Institute of Technology"
              icon={<MdBusiness />}
              error={errors.institution}
            />

            <InputField
              label="Email Address *"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); clearErr('email'); }}
              placeholder="admin@college.edu"
              icon={<MdEmail />}
              error={errors.email}
            />

            <div>
              <InputField
                label="Password *"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); clearErr('password'); }}
                placeholder="Min. 6 characters"
                icon={<MdLock />}
                error={errors.password}
                suffix={EyeToggle}
              />
              <PasswordStrength password={password} />
            </div>

            <InputField
              label="Confirm Password *"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); clearErr('confirmPassword'); }}
              placeholder="Repeat your password"
              icon={<MdLock />}
              error={errors.confirmPassword}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
