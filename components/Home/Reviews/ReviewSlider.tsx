'use client'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper/modules'
import { FaStar } from 'react-icons/fa'
import Image from 'next/image'

interface Review {
    id: number;
    name: string;
    review: string;
    image: string;
    rating: number;
}

interface ReviewSliderProps {
    refreshKey?: number;
}

const ReviewSlider: React.FC<ReviewSliderProps> = ({ refreshKey = 0 }) => {
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setIsLoading(true)
                const res = await fetch('/api/reviews')
                if (res.ok) {
                    const data = await res.json()
                    setReviews(data)
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchReviews()
    }, [refreshKey])

    if (isLoading) {
        return <div className="text-white text-center py-10">Loading reviews...</div>
    }

    if (reviews.length === 0) {
        return <div className="text-white text-center py-10">No reviews yet. Be the first to leave one!</div>
    }

    return (
        <div>
            <Swiper 
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards]}
                className='md:w-[450px] md:h-[350px] w-[90%] h-[300px]'
            >
                {reviews.map((data) => {
                    return (
                        <SwiperSlide 
                            key={data.id} 
                            className='bg-white rounded-3xl block text-black'
                        >
                            <div className='w-[80%] mx-auto mt-16'>
                                {/* Review text */}
                                <p className='text-xs sm:text-sm md:text-base font-semibold text-gray-800 line-clamp-4'>
                                    {data.review}
                                </p>

                                {/* Icons */}
                                <div className='flex items-center mt-4'>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar 
                                            key={i} 
                                            className={`md:w-6 md:h-6 w-3 h-3 ${i < (data.rating || 5) ? 'text-yellow-600' : 'text-gray-300'}`} 
                                        />
                                    ))}
                                </div>

                                {/* User profile */}
                                <div className='mt-10'>
                                    <div className='flex items-center space-x-4'>
                                        <Image 
                                            src={data.image || '/images/u1.jpg'} 
                                            width={60} 
                                            height={60} 
                                            alt='Client' 
                                            className='rounded-full' 
                                        />
                                        <div>
                                            <p className='text-sm sm:text-lg font-semibold text-gray-900'>
                                                {data.name}
                                            </p>
                                            <p className='text-gray-600 text-xs sm:text-base'>
                                                Customer
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    )
}

export default ReviewSlider
