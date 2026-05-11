import React from 'react';
import Navbar from '../Landing/components/Navbar';
import Footer from '../Landing/components/Footer';
import { MdEmail, MdPhone, MdLocationOn, MdSend } from 'react-icons/md';
import { motion } from 'framer-motion';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Get in Touch</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Have questions about our CMS? Our team is here to help you digitize your institution.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-8 bg-primary-600 text-white">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MdPhone className="text-2xl mt-1" />
                  <div>
                    <p className="font-bold">Phone</p>
                    <p className="text-primary-100">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MdEmail className="text-2xl mt-1" />
                  <div>
                    <p className="font-bold">Email</p>
                    <p className="text-primary-100">support@eduadmin.in</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MdLocationOn className="text-2xl mt-1" />
                  <div>
                    <p className="font-bold">Office</p>
                    <p className="text-primary-100">123 Tech Park, HSR Layout, Bengaluru, Karnataka, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h4 className="font-bold text-slate-800 dark:text-white mb-4">Support Hours</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between"><span>Monday - Friday</span> <span>9:00 AM - 6:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 2:00 PM</span></li>
                <li className="flex justify-between font-bold text-primary-600"><span>Sunday</span> <span>Closed</span></li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-8 md:p-12">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                    <input type="text" className="input-field" placeholder="Aarav" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                    <input type="text" className="input-field" placeholder="Sharma" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input type="email" className="input-field" placeholder="aarav@college.edu" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                  <select className="input-field">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Billing Question</option>
                    <option>Demo Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                  <textarea className="input-field min-h-[150px]" placeholder="Tell us how we can help..."></textarea>
                </div>
                <button type="submit" className="btn-primary w-full md:w-auto px-10 py-4 flex items-center justify-center">
                  <MdSend className="mr-2" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
