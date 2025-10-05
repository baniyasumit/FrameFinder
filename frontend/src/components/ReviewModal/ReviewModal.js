import React, { useEffect, useRef, useState } from 'react'
import './ReviewModal.css'
import { Rating } from 'react-simple-star-rating';
import { GoStar, GoStarFill } from 'react-icons/go';
import { createReview } from '../../services/ReviewService';
import { toast } from 'sonner';

const ReviewModal = ({ bookingId, setShowReviewModal }) => {
    const modelRef = useRef();
    const [reviewData, setReviewData] = useState({
        description: '',
    })

    const [rating, setRating] = useState(2.5)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modelRef.current && !modelRef.current.contains(e.target)) {
                setShowReviewModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowReviewModal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReviewData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalReview = {
            ...reviewData,
            rating,
        }
        try {
            const response = await createReview(bookingId, finalReview);
            console.log(response.message);
            toast.success('Thank you for your review.');
        } catch (err) {
            console.error("Save error:", err);
            toast.error(err, {
                position: 'top-center',
            });
        } finally {
            setShowReviewModal(false);
        }
    }

    return (
        <div className="review-overlay">
            <form className="review-modal" ref={modelRef} onSubmit={handleSubmit}>
                <button className="close-icon" onClick={() => setShowReviewModal(false)}>
                    ×
                </button>
                <div className="review-header">
                    <h1 className="review-title">Leave a Review</h1>
                </div>
                <div className='rating-container'>
                    <Rating
                        name='rating'
                        className='rating-stat'
                        onClick={setRating}
                        initialValue={rating}
                        size={50}
                        allowFraction
                        emptyIcon={<GoStar color="rgba(255,255,255,0.5)" size={50} />}
                        fillIcon={<GoStarFill color="#FACC15" size={50} />}
                    />
                </div>
                <textarea
                    className="review-inputs"
                    type="text"
                    placeholder="Describe your experience."
                    name="description"
                    value={reviewData.description}
                    onChange={handleChange}
                />

                <div className='submit-button-container'>
                    <button type='submit' className='submit-button'>
                        Send Review
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ReviewModal;