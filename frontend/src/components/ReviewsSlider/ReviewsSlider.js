import React from 'react'
import './ReviewsSlider.css'

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Rating } from 'react-simple-star-rating';
import { GoStar, GoStarFill } from 'react-icons/go';

const ReviewsSlider = ({ reviews }) => {

    const settings = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 2000,
    };


    return (
        <div className='reviews-container'>
            <Slider {...settings}>
                {reviews.map((review, index) => (
                    <div className='review-container' key={index}>
                        <div className='photographer-profile-information review'>
                            <div className='profile-picture-container review'>
                                <img src={review.user.picture} alt="Profile" />
                            </div>
                            <div className='profile-information review' >
                                <h3 className='full-name review'>{review.user.firstname} {review.user.lastname}</h3>
                                <Rating
                                    className='rating-stat review'
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
                ))}

                <div className='review-container'>
                    <div className='photographer-profile-information review'>
                        <div className='profile-picture-container review'>
                            <img src='https://res.cloudinary.com/dcplldqtr/image/upload/v1754678707/portfolio-pictures/gbrq8ieigcokh2ozciag.jpg' alt="Profile" />
                        </div>
                        <div className='profile-information review' >
                            <h3 className='full-name review'>Amit Baniya</h3>
                            <Rating
                                className='rating-stat review'
                                initialValue={3}
                                size={20}
                                allowFraction={true}
                                emptyIcon={<GoStar color="rgba(255,255,255,0.5)" size={20} />}
                                fillIcon={<GoStarFill color="#FACC15" size={20} />}
                                readonly
                            />
                        </div>
                    </div>
                    <p>"Sarah captured our wedding day perfectly! Her attention to detail and ability to capture candid moments was incredible. We couldn't be happier with our photos!"</p>
                </div>

                <div className='review-container'>
                    <div className='photographer-profile-information review'>
                        <div className='profile-picture-container review'>
                            <img src='https://res.cloudinary.com/dcplldqtr/image/upload/v1754678707/portfolio-pictures/gbrq8ieigcokh2ozciag.jpg' alt="Profile" />
                        </div>
                        <div className='profile-information review' >
                            <h3 className='full-name review'>Amit Baniya</h3>
                            <Rating
                                className='rating-stat review'
                                initialValue={3}
                                size={20}
                                allowFraction={true}
                                emptyIcon={<GoStar color="rgba(255,255,255,0.5)" size={20} />}
                                fillIcon={<GoStarFill color="#FACC15" size={20} />}
                                readonly
                            />
                        </div>
                    </div>
                    <p>"Sarah captured our wedding day perfectly! Her attention to detail and ability to capture candid moments was incredible. We couldn't be happier with our photos!"</p>
                </div>

                <div className='review-container'>
                    <div className='photographer-profile-information review'>
                        <div className='profile-picture-container review'>
                            <img src='https://res.cloudinary.com/dcplldqtr/image/upload/v1754678707/portfolio-pictures/gbrq8ieigcokh2ozciag.jpg' alt="Profile" />
                        </div>
                        <div className='profile-information review' >
                            <h3 className='full-name review'>Amit Baniya</h3>
                            <Rating
                                className='rating-stat review'
                                initialValue={3}
                                size={20}
                                allowFraction={true}
                                emptyIcon={<GoStar color="rgba(255,255,255,0.5)" size={20} />}
                                fillIcon={<GoStarFill color="#FACC15" size={20} />}
                                readonly
                            />
                        </div>
                    </div>
                    <p>"Sarah captured our wedding day perfectly! Her attention to detail and ability to capture candid moments was incredible. We couldn't be happier with our photos!"</p>
                </div>

                <div className='review-container'>
                    <div className='photographer-profile-information review'>
                        <div className='profile-picture-container review'>
                            <img src='https://res.cloudinary.com/dcplldqtr/image/upload/v1754678707/portfolio-pictures/gbrq8ieigcokh2ozciag.jpg' alt="Profile" />
                        </div>
                        <div className='profile-information review' >
                            <h3 className='full-name review'>Amit Baniya</h3>
                            <Rating
                                className='rating-stat review'
                                initialValue={3}
                                size={20}
                                allowFraction={true}
                                emptyIcon={<GoStar color="rgba(255,255,255,0.5)" size={20} />}
                                fillIcon={<GoStarFill color="#FACC15" size={20} />}
                                readonly
                            />
                        </div>
                    </div>
                    <p>"Sarah captured our wedding day perfectly! Her attention to detail and ability to capture candid moments was incredible. We couldn't be happier with our photos!"</p>
                </div>
                <div className='review-container'>
                    <div className='photographer-profile-information review'>
                        <div className='profile-picture-container review'>
                            <img src='https://res.cloudinary.com/dcplldqtr/image/upload/v1754678707/portfolio-pictures/gbrq8ieigcokh2ozciag.jpg' alt="Profile" />
                        </div>
                        <div className='profile-information review' >
                            <h3 className='full-name review'>Amit Baniya</h3>
                            <Rating
                                className='rating-stat review'
                                initialValue={3}
                                size={20}
                                allowFraction={true}
                                emptyIcon={<GoStar color="rgba(255,255,255,0.5)" size={20} />}
                                fillIcon={<GoStarFill color="#FACC15" size={20} />}
                                readonly
                            />
                        </div>
                    </div>
                    <p>"Sarah captured our wedding day perfectly! Her attention to detail and ability to capture candid moments was incredible. We couldn't be happier with our photos!"</p>
                </div>

                <div className='review-container'>
                    <div className='photographer-profile-information review'>
                        <div className='profile-picture-container review'>
                            <img src='https://res.cloudinary.com/dcplldqtr/image/upload/v1754678707/portfolio-pictures/gbrq8ieigcokh2ozciag.jpg' alt="Profile" />
                        </div>
                        <div className='profile-information review' >
                            <h3 className='full-name review'>Amit Baniya</h3>
                            <Rating
                                className='rating-stat review'
                                initialValue={3}
                                size={20}
                                allowFraction={true}
                                emptyIcon={<GoStar color="rgba(255,255,255,0.5)" size={20} />}
                                fillIcon={<GoStarFill color="#FACC15" size={20} />}
                                readonly
                            />
                        </div>
                    </div>
                    <p>"Sarah captured our wedding day perfectly! Her attention to detail and ability to capture candid moments was incredible. We couldn't be happier with our photos!"</p>
                </div>
            </Slider>


        </div>
    )
}

export default ReviewsSlider;