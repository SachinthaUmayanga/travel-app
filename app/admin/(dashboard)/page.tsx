import React from 'react';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const destinationsCount = await prisma.destination.count();
  const hotelsCount = await prisma.hotel.count();
  const toursCount = await prisma.tour.count();
  const reviewsCount = await prisma.review.count();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-700">Destinations</h2>
          <p className="text-4xl font-bold mt-2 text-gray-900">{destinationsCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow border-t-4 border-green-500">
          <h2 className="text-lg font-semibold text-gray-700">Hotels</h2>
          <p className="text-4xl font-bold mt-2 text-gray-900">{hotelsCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow border-t-4 border-yellow-500">
          <h2 className="text-lg font-semibold text-gray-700">Tours</h2>
          <p className="text-4xl font-bold mt-2 text-gray-900">{toursCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500">
          <h2 className="text-lg font-semibold text-gray-700">Reviews</h2>
          <p className="text-4xl font-bold mt-2 text-gray-900">{reviewsCount}</p>
        </div>
      </div>
    </div>
  );
}
