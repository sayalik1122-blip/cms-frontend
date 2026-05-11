import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdSchool } from 'react-icons/md';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const location = useLocation();

  const scrollToSection = (id) => {
    // If we are not on the homepage, navigate there first
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-primary-600 rounded-lg">
                <MdSchool className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white">
                EduAdmin
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">
              A comprehensive college management system designed to simplify administration and enhance the educational experience.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary-400 transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary-400 transition-colors">
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-primary-400 transition-colors">Features</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-primary-400 transition-colors">About Us</button></li>
              <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-primary-400 transition-colors">Testimonials</button></li>
              <li><Link to="/pricing" className="hover:text-primary-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/docs" className="hover:text-primary-400 transition-colors">Documentation</Link></li>
              <li><Link to="/blog" className="hover:text-primary-400 transition-colors">Blog</Link></li>
              <li><Link to="/help" className="hover:text-primary-400 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/faq" className="hover:text-primary-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-500 text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} EduAdmin Inc. All rights reserved. Designed for Indian Institutions.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link to="/login" className="text-slate-500 hover:text-white transition-colors">Admin Login</Link>
            <Link to="/register" className="text-slate-500 hover:text-white transition-colors">Register Institution</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
