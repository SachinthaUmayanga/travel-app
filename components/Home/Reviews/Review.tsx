'use client'
import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import ReviewSlider from './ReviewSlider'
import ReviewFormModal from './ReviewFormModal'
import { useSession } from 'next-auth/react'

const Review = () => {
    const { data: session } = useSession()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const handleReviewAdded = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <div className='pt-20 pb-20 flex items-center justify-center flex-col bg-[#13357b] relative'>
            <div className='w-[80%] mx-auto grid items-center grid-cols-1 lg:grid-cols-2 gap-10'>
                {/* Text Content */}
                <div>
                    <h1 className='text-2xl font-semibold text-white'>
                        What our customers are saying us?
                    </h1>
                    <p className='mt-6 text-gray-200'>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum saepe sit hic doloribus mollitia, itaque ratione autem assumenda consequatur, facere dolorem similique soluta, quaerat maxime dolor fugit! Optio, quisquam ipsam.
                    </p>

                    {/* Ratings */}
                    <div className='mt-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6'>
                        <div>
                            <p className='text-2xl font-bold text-white'>4.88</p>
                            <p className='text-white mb-2'>Overall Rating</p>
                            <div className='flex items-center'>
                                <FaStar className='text-white' />
                                <FaStar className='text-white' />
                                <FaStar className='text-white' />
                                <FaStar className='text-white' />
                                <FaStar className='text-white' />
                            </div>
                        </div>
                        {session?.user && (
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-white text-[#13357b] font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                            >
                                Leave a Review
                            </button>
                        )}
                    </div>
                </div>

                {/* Slider */}
                <div className='overflow-hidden'>
                    <ReviewSlider refreshKey={refreshKey} />
                </div>
            </div>

            <ReviewFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onReviewAdded={handleReviewAdded} 
            />
        </div>
    )
}

export default Review
