'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1324 },
    items: 5,
    slidesToSlide: 1
  },
  tablet: {
    breakpoint: { max: 1324, min: 764 },
    items: 2,
    slidesToSlide: 1
  },
  mobile: {
    breakpoint: { max: 764, min: 0 },
    items: 1,
    slidesToSlide: 1
  }
};

const DestinationSlider = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch('/api/destinations?popular=true');
        const data = await res.json();
        setDestinations(data);
      } catch (error) {
        console.error('Failed to fetch popular destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  if (loading) {
    return <div className="h-[400px] flex items-center justify-center">Loading...</div>;
  }

  if (destinations.length === 0) {
    return <div className="h-[400px] flex items-center justify-center text-gray-500">No popular destinations available. Please add them from the Admin dashboard.</div>;
  }

  return (
    <Carousel 
      responsive={responsive} 
      infinite={true} 
      autoPlay={true} 
      autoPlaySpeed={5000} 
      keyBoardControl={true}
    >
      {destinations.map((data) => {
        return (
          <div key={data.id} className='m-3'>
            {/* Image Div */}
            <div className='relative h-[400px]'>
              {/* Overlay */}
              <div className='absolute inset-0 bg-black opacity-25 rounded-lg'></div>

              {/* Image */}
              <Image 
                src={data.image} 
                alt={data.country} 
                width={500} 
                height={500} 
                className='h-full w-full object-cover rounded-lg' 
              />
            </div>
            {/* Text Content */}
            <h1 className='text-lg font-semibold mt-4'>{data.country}</h1>
            <p className='text-sm text-gray-600'>{data.travelers} Travelers</p>
          </div>
        )
      })}
    </Carousel>
  )
}

export default DestinationSlider
