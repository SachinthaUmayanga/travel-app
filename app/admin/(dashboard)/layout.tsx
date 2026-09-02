"use client";

import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-800">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-gray-800">
            Dashboard
          </Link>
          <Link href="/admin/destinations" className="block px-4 py-2 rounded hover:bg-gray-800">
            Destinations
          </Link>
          <Link href="/admin/hotels" className="block px-4 py-2 rounded hover:bg-gray-800">
            Hotels
          </Link>
          <Link href="/admin/tours" className="block px-4 py-2 rounded hover:bg-gray-800">
            Tours
          </Link>
          <Link href="/admin/reviews" className="block px-4 py-2 rounded hover:bg-gray-800">
            Reviews
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
