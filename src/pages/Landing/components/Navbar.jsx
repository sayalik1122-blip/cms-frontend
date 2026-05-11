import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdMenu, MdClose, MdSchool, MdPerson } from 'react-icons/md';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'About', href: '/about' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleNavClick = (link) => {
    setMobileMenuOpen(false);
    navigate(link.href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-primary-600 rounded-lg">
              <MdSchool className="text-white text-2xl" />
            </div>
            <span className={`text-2xl font-bold ${isScrolled ? 'text-slate-800 dark:text-white' : 'text-slate-800 dark:text-white'}`}>
              EduAdmin
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => handleNavClick(link)}
                className={`text-sm font-medium hover:text-primary-600 transition-colors cursor-pointer ${
                  isScrolled ? 'text-slate-600 dark:text-slate-300' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Student Login */}
            <Link
              to="/login"
              state={{ role: 'student' }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
            >
              <MdPerson className="text-base" /> Student Login
            </Link>
            {/* Admin Log in */}
            <Link
              to="/login"
              className={`text-sm font-medium transition-colors ${isScrolled ? 'text-slate-700 dark:text-slate-200 hover:text-primary-600' : 'text-slate-800 dark:text-white hover:text-primary-600'}`}
            >
              Admin Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${isScrolled ? 'text-slate-800 dark:text-white' : 'text-slate-800 dark:text-white'}`}
            >
              {mobileMenuOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => handleNavClick(link)}
                className="block text-base font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 cursor-pointer"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-3">
              <button
                onClick={() => { navigate('/login', { state: { role: 'student' } }); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg"
              >
                <MdPerson /> Student Login
              </button>
              <button
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                className="w-full text-center px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                Admin Login
              </button>
              <button
                onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                className="w-full text-center px-5 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
