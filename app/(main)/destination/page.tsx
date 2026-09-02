"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';

type Destination = {
  id: number;
  image: string;
  country: string;
  travelers: string;
};

export default function DestinationPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
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
    const fetchDestinations = async () => {
      try {
        const res = await fetch('/api/destinations');
        if (res.ok) {
          const data = await res.json();
          setDestinations(data);
        }
      } catch (error) {
        console.error('Error fetching destinations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-[15vh] flex justify-center items-center"><p className="text-gray-500">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-[15vh] bg-gray-50 pb-16 overflow-hidden">
      <div className="w-[90%] xl:w-[80%] mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2" data-aos="fade-right">Explore Destinations</h1>
        <p className="text-gray-500 mb-10" data-aos="fade-right" data-aos-delay="100">Find your next adventure from our top-rated locations.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <div 
              key={dest.id} 
              className="relative group overflow-hidden rounded-xl shadow-lg cursor-pointer h-80"
              data-aos="fade-up"
              data-aos-delay={`${(index % 4) * 100}`}
            >
              <img 
                src={dest.image} 
                alt={dest.country} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300"></div>
              <div className="absolute bottom-6 left-6">
                <h2 className="text-white text-2xl font-bold">{dest.country}</h2>
                <p className="text-white text-sm opacity-90">{dest.travelers} Travelers</p>
              </div>
            </div>
          ))}
        </div>
        
        {destinations.length === 0 && (
          <div className="text-center py-20">
             <p className="text-gray-500 text-lg">No destinations available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
