import React, { useEffect } from 'react'
import './ImageFullScreenView.css'
import usePortfolioStore from '../../stateManagement/usePortfolioStore'
import { useNavigate } from 'react-router-dom';
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";


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

    const handlePrev = () => {
        const newPreviewIndex = previewIndex !== 0 ? previewIndex - 1 : 0
        setPreviewIndex(newPreviewIndex)
    }

    const handleNext = () => {
        const newPreviewIndex = previewIndex !== fullImages.length - 1 ? previewIndex + 1 : fullImages.length - 1
        setPreviewIndex(newPreviewIndex)

    }

    if (fullImages.length === 0) return null;

    return (
        <main className='full-screen-images-gallery'>
            <section className='full-screen-image-container'>
                {previewIndex !== 0 &&
                    <button className="nav-button prev" onClick={handlePrev}><MdOutlineNavigateBefore />
                    </button>
                }
                <img className='full-screen-image' src={fullImages[previewIndex]?.url} alt='full-image' />
                {fullImages.length - 1 !== previewIndex &&
                    <button className="nav-button next" onClick={handleNext}><MdOutlineNavigateNext />
                    </button>
                }

            </section>

            <section className='image-navigation-container'>
                {fullImages.map((image, index) => (
                    <div className={`image-navigation ${index === previewIndex ? "selected" : ""}`} key={index}>
                        <img className={`${index === previewIndex ? "selected" : ""}`} src={image.url} alt='images-of-navigation' onClick={() => setPreviewIndex(index)} />
                    </div>
                ))}
            </section>
        </main>
    )
}

export default ImageFullScreenView
