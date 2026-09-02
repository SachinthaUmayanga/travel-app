"use client";

import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutPage() {
  const [content, setContent] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAOS = async () => {
      await import('aos');
      AOS.init({
        duration: 1000,
        easing: 'ease',
        once: true,
        anchorPlacement: 'top-bottom'
      });
    };
    initAOS();
  }, []);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/pages?pageName=about');
        if (res.ok) {
          const data = await res.json();
          setContent({ title: data.title || 'About Us', content: data.content || 'Welcome to our travel agency!' });
        }
      } catch (error) {
        console.error('Error fetching about page', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-[15vh] flex justify-center items-center"><p className="text-gray-500">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-[15vh] bg-gray-50 pb-16 overflow-hidden">
      <div 
        className="w-[90%] xl:w-[80%] mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100"
        data-aos="fade-up"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 border-b pb-4" data-aos="fade-right" data-aos-delay="200">{content.title}</h1>
        <div 
          className="prose max-w-none text-gray-700 leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: content.content.replace(/\n/g, '<br />') }}
          data-aos="fade-up" 
          data-aos-delay="400"
        />
      </div>
    </div>
  );
}
