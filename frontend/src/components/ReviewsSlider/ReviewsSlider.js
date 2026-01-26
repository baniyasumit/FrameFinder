import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Rating } from "react-simple-star-rating";
import { GoStar, GoStarFill } from "react-icons/go";
import "./ReviewsSlider.css";

const ReviewsSlider = ({ reviews }) => {
    // Determine slides per view based on screen width
    const breakpoints = {
        0: { slidesPerView: 1, spaceBetween: 10 },
        600: { slidesPerView: 2, spaceBetween: 15 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
    };

    return (
        <div className="reviews-container">
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                loop={reviews.length > 1}
                breakpoints={breakpoints}
            >

                {reviews.map((review, index) => (
                    <SwiperSlide key={index}>
                        <div className="review-container">
                            <div className="photographer-profile-information review">
                                <div className="profile-picture-container review">
                                    <img src={review.user?.picture} alt="Profile" />
                                </div>
                                <div className="profile-information review">
                                    <h3 className="full-name review">
                                        {review.user?.firstname} {review.user?.lastname}
                                    </h3>
                                    <Rating
                                        className="rating-stat review"
                                        initialValue={review.rating}
                                        size={20}
                                        allowFraction={true}
                                        emptyIcon={<GoStar color="rgba(255,255,255,0.5)" size={20} />}
                                        fillIcon={<GoStarFill color="#FACC15" size={20} />}
                                        readonly
                                    />
                                </div>
                            </div>
                            <p>"{review.description}"</p>
                        </div>

                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ReviewsSlider;
