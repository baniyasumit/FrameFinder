import React, { useEffect } from 'react'
import './ImageFullScreenView.css'
import usePortfolioStore from '../../stateManagement/usePortfolioStore'
import { useNavigate } from 'react-router-dom';


const ImageFullScreenView = () => {
    const { fullImages, setPreviewIndex, previewIndex } = usePortfolioStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (fullImages.length === 0) {
            if (window.history.length > 1) {
                navigate(-1);
            } else {
                navigate('/');
            }
        }
    }, [fullImages, navigate]);
    return (
        <>
            <main className='full-screen-images-gallery'>
                <section className='full-screen-image-container'>
                    <img className='full-screen-image' src={fullImages[previewIndex].url} alt='full-image' />

                </section>
                <section className='image-navigation-container'>
                    {fullImages.map((image, index) => (
                        <div className={`image-navigation ${index === previewIndex ? "selected" : ""}`} key={index}>
                            < img src={image.url} alt='images-of-navigation' onClick={() => setPreviewIndex(index)} />
                        </div>
                    ))}


                </section>
            </main>
        </>)
}

export default ImageFullScreenView