import React from 'react';
import Navbar from '../Landing/components/Navbar';
import Footer from '../Landing/components/Footer';
import { motion } from 'framer-motion';

const Blog = () => {
  const posts = [
    {
      title: "Digital Transformation in Indian Education",
      excerpt: "How modern ERP systems are changing the landscape of college administration in India.",
      date: "May 10, 2026",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      category: "Education"
    },
    {
      title: "Improving Student Engagement with Data",
      excerpt: "Using analytics to identify and support students who need extra academic assistance.",
      date: "May 5, 2026",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
      category: "Analytics"
    },
    {
      title: "The Future of Hybrid Learning",
      excerpt: "Preparing your institution for a seamless blend of online and offline education models.",
      date: "April 28, 2026",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
      category: "Technology"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">EduAdmin Blog</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Insights, trends, and news from the world of educational technology.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="card overflow-hidden group cursor-pointer"
            >
              <div className="h-48 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">{post.category}</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 mb-3">{post.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{post.excerpt}</p>
                <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                  <span>{post.date}</span>
                  <span className="font-bold text-primary-600 group-hover:underline">Read More</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
