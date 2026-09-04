'use client'
import React, { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'
import ReviewSlider from './ReviewSlider'
import ReviewFormModal from './ReviewFormModal'
import { useSession } from 'next-auth/react'

const Review = () => {
    const { data: session } = useSession()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const [overallRating, setOverallRating] = useState(0)
    const [reviewCount, setReviewCount] = useState(0)

    useEffect(() => {
        const fetchReviewsStats = async () => {
            try {
                const res = await fetch('/api/reviews')
                if (res.ok) {
                    const data = await res.json()
                    setReviewCount(data.length)
                    if (data.length > 0) {
                        const total = data.reduce((acc: number, curr: any) => acc + (curr.rating || 5), 0)
                        setOverallRating(Number((total / data.length).toFixed(1)))
                    } else {
                        setOverallRating(5.0)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch review stats:", error)
            }
        }
        fetchReviewsStats()
    }, [refreshKey])

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
                        We pride ourselves on delivering unforgettable travel experiences. Read what our valued customers have to say about our world-class hotels and guided tours. Your satisfaction is our highest priority.
                    </p>

                    {/* Ratings */}
                    <div className='mt-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6'>
                        <div>
                            <p className='text-2xl font-bold text-white'>{overallRating.toFixed(1)}</p>
                            <p className='text-white mb-2'>Overall Rating ({reviewCount} Reviews)</p>
                            <div className='flex items-center'>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < Math.round(overallRating) ? 'text-yellow-400' : 'text-gray-400'} />
                                ))}
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
