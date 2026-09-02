"use client";

import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ContactPage() {
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
    const fetchContact = async () => {
      try {
        const res = await fetch('/api/pages?pageName=contact');
        if (res.ok) {
          const data = await res.json();
          setContent({ title: data.title || 'Contact Us', content: data.content || 'Reach out to us at contact@travel.com' });
        }
      } catch (error) {
        console.error('Error fetching contact page', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-[15vh] flex justify-center items-center"><p className="text-gray-500">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-[15vh] bg-gray-50 pb-16 overflow-hidden">
      <div className="w-[90%] xl:w-[80%] mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-12">
        <div className="flex-1" data-aos="fade-right">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 border-b pb-4">{content.title}</h1>
          <div 
            className="prose max-w-none text-gray-700 leading-relaxed text-lg mb-8"
            dangerouslySetInnerHTML={{ __html: content.content.replace(/\n/g, '<br />') }}
          />
        </div>
        <div className="flex-1 bg-gray-100 p-8 rounded-lg shadow-inner" data-aos="fade-left" data-aos-delay="200">
           <h2 className="text-2xl font-bold mb-6 text-gray-800">Send us a message</h2>
           <form className="space-y-4">
             <div>
               <label className="block text-gray-700 font-semibold mb-2">Name</label>
               <input type="text" className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Your Name" />
             </div>
             <div>
               <label className="block text-gray-700 font-semibold mb-2">Email</label>
               <input type="email" className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Your Email" />
             </div>
             <div>
               <label className="block text-gray-700 font-semibold mb-2">Message</label>
               <textarea className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 h-32" placeholder="How can we help you?"></textarea>
             </div>
             <button type="button" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">Send Message</button>
           </form>
        </div>
      </div>
    </div>
  );
}
