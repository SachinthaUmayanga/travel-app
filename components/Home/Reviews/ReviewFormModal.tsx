'use client'
import React, { useState, useEffect } from 'react'
import { FaStar, FaTimes } from 'react-icons/fa'
import { useSession } from 'next-auth/react'

interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReviewAdded: () => void;
}

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ isOpen, onClose, onReviewAdded }) => {
    const { data: session } = useSession()
    
    const [name, setName] = useState('')
    const [reviewText, setReviewText] = useState('')
    const [rating, setRating] = useState(5)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hover, setHover] = useState<number | null>(null)

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name)
        }
    }, [session])

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !reviewText) return

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    review: reviewText,
                    rating,
                    image: session?.user?.image || undefined
                }),
                credentials: 'include'
            })

            if (res.ok) {
                onReviewAdded()
                onClose()
                setReviewText('')
                setRating(5)
                // name remains the same as session name
            }
        } catch (error) {
            console.error("Failed to submit review", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 relative shadow-2xl">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-800">Leave a Review</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!!session?.user?.name}
                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#13357b] focus:border-transparent outline-none transition-all text-black ${session?.user?.name ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''}`}
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={`cursor-pointer w-6 h-6 transition-colors ${
                                        star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(null)}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                        <textarea 
                            required
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#13357b] focus:border-transparent outline-none transition-all resize-none text-black"
                            placeholder="Tell us about your experience..."
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-[#13357b] text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ReviewFormModal
