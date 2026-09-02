"use client";

import React, { useState, useEffect } from 'react';

export default function PagesAdmin() {
  const [activeTab, setActiveTab] = useState('about');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchPage = async (pageName: string) => {
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`/api/pages?pageName=${pageName}`);
      const data = await res.json();
      if (res.ok) {
        setTitle(data.title || '');
        setContent(data.content || '');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPage(activeTab);
  }, [activeTab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageName: activeTab, title, content }),
      });

      if (res.ok) {
        setMessage({ text: 'Page saved successfully!', type: 'success' });
      } else {
        const data = await res.json();
        setMessage({ text: data.error || 'Failed to save', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Static Pages</h1>
      
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('about')}
          className={`pb-2 px-4 font-semibold text-lg ${activeTab === 'about' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          About Page
        </button>
        <button 
          onClick={() => setActiveTab('contact')}
          className={`pb-2 px-4 font-semibold text-lg ${activeTab === 'contact' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Contact Page
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {message.text && (
          <div className={`p-4 mb-4 rounded-lg font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Page Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. About Us"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Page Content (HTML supported)</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-64"
            placeholder="Enter the page content here..."
            required
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Page Content'}
        </button>
      </form>
    </div>
  );
}
