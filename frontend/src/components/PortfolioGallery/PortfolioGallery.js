import React, { useEffect, useRef, useState } from 'react'
import './PortfolioGallery.css'
import { IoCloudUpload } from 'react-icons/io5';
import { toast } from 'sonner';
import { ImSpinner9 } from "react-icons/im";
import { getPortfolioPictures } from '../../services/PortfolioServices';

const PortfolioGallery = ({ showGalleryOverlay, setShowGalleryOverlay, galleryImages, setGalleryImages, setUploadFiles, hasMore, setHasMore }) => {
    const modalRef = useRef();
    const fileInputRef = useRef();
    const galleryRef = useRef();
    const lastScrollTop = useRef(0);

    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showGalleryOverlay) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showGalleryOverlay]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowGalleryOverlay(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowGalleryOverlay]);

    const handleScroll = () => {
        if (!galleryRef.current || loading || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = galleryRef.current;

        if (scrollTop <= lastScrollTop.current) {
            lastScrollTop.current = scrollTop;
            return;
        }

        if (scrollHeight - scrollTop <= clientHeight + 5) {
            setPage(prev => prev + 1);
        }

        lastScrollTop.current = scrollTop;
    };

    useEffect(() => {
        if (page === 1 || !hasMore) return;

        const fetchImages = async (pageNum) => {
            setLoading(true);
            try {
                const response = await getPortfolioPictures(pageNum);
                console.log(response.message);
                if (response.pictures.length < 9) setHasMore(false);
                setGalleryImages(prev => [...prev, ...response.pictures]);
            } catch (error) {
                console.error('Failed to load images', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages(page);

    }, [page, setGalleryImages, setHasMore, hasMore]);


    const handleImageChange = async (event) => {
        const files = event.target.files;
        const MAX_SIZE = 10 * 1024 * 1024;

        const validImages = [];
        const validFiles = [];

        for (const file of files) {
            if (file.size > MAX_SIZE) {
                toast.error(`File ${file.name} is too large, max size is 10MB`);
                continue;
            }
            const blobUrl = URL.createObjectURL(file);
            validImages.push({ url: blobUrl });
            validFiles.push(file);
        }

        if (validImages.length > 0) {
            setGalleryImages((prev) => [...validImages, ...prev]);
            setUploadFiles((prev) => [...validFiles, ...prev]);
        }
    };

    return (
        <div className="gallery-overlay">
            <div className="gallery-modal" ref={modalRef}>
                <button className="close-icon" onClick={() => setShowGalleryOverlay(false)}>
                    ×
                </button>
                <div className="gallery-header">
                    <h1 className="gallery-title">Gallery</h1>
                </div>
                <div className='images-gallery' ref={galleryRef} onScroll={handleScroll}>
                    {galleryImages.map((galleryImage, index) => (
                        <div className='gallery-image-container' key={index}>
                            <img src={galleryImage?.url} className='gallery-image' alt='gallery-image' />
                        </div>
                    ))}
                    {loading && <div className='loading-container'><ImSpinner9 className='spinner gallery' /></div>}
                    {!hasMore && <div className='loading-container'><p>You have reached the end.</p></div>}
                </div>
                <div className='multiple-upload-button-container'>
                    <button className='portfolio-button pictures-upload-button' onClick={() => fileInputRef.current.click()} >
                        <IoCloudUpload />
                        <span>Upload New Photo</span>
                    </button>

                    <input type='file' onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} accept="image/*" multiple />

                </div>

            </div>
        </div>
    )
}

export default PortfolioGallery;