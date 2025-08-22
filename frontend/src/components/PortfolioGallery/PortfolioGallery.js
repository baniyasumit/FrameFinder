import React, { useEffect, useRef, useState } from 'react'
import './PortfolioGallery.css'
import { IoCloudUpload } from 'react-icons/io5';
import { toast } from 'sonner';
import { ImSpinner9 } from "react-icons/im";
import { getPortfolioPictures } from '../../services/PortfolioServices';
import { MdDeleteForever } from 'react-icons/md';
import usePortfolioStore from '../../stateManagement/usePortfolioStore';

const PortfolioGallery = (
    { showGalleryOverlay, setShowGalleryOverlay,
        galleryImages, setGalleryImages, setUploadFiles,
        hasMore, setHasMore, setFilteredPictures,
        isViewer = false, portfolioId }) => {

    const modalRef = useRef();
    const fileInputRef = useRef();
    const galleryRef = useRef();
    const lastScrollTop = useRef(0);

    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);

    const [selectedImages, setSelectedImages] = useState([])

    const { setPreviewIndex, setFullImages } = usePortfolioStore();

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
                const response = await getPortfolioPictures(pageNum, portfolioId);
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

    }, [page, setGalleryImages, setHasMore, hasMore, portfolioId]);


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
            validFiles.push({ url: blobUrl, file: file });
        }

        if (validImages.length > 0) {
            setGalleryImages((prev) => [...validImages, ...prev]);
            setUploadFiles((prev) => [...validFiles, ...prev]);
        }
    };

    const handleSelectChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedImages(prev => [...prev, value]);
        } else {
            setSelectedImages(prev => prev.filter(url => url !== value));
        }
    }

    const handleImagesRemove = async () => {
        if (selectedImages.length === 0) {
            toast.error("No Images selected")
            return;
        }
        setFilteredPictures(prev => [
            ...prev,
            ...galleryImages.filter(
                image => selectedImages.includes(image.url) && image._id
            )
        ]);

        const remainingImages = galleryImages.filter(img => !selectedImages.includes(img.url));
        setGalleryImages(remainingImages);
        setUploadFiles(prev => prev.filter(file => !(selectedImages.includes(file.url))))
        if (remainingImages.length <= 6) {
            setPage(prev => prev + 1);
        }
    }

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
                        <div className='gallery-image-container' key={index} /* onClick={() => handleSelectChange({
                            target: {
                                value: galleryImage.url,
                                checked: !selectedImages.includes(galleryImage.url)
                            }

                        })} */
                            onClick={() => {
                                setFullImages([...galleryImages])
                                setPreviewIndex(index);
                                window.open('/view-full-picture', '_blank');
                            }} >
                            <img src={galleryImage?.url} className='gallery-image' alt='gallery-image' />
                            {!isViewer &&
                                <input
                                    type='checkbox'
                                    className='image-select'
                                    value={galleryImage.url}
                                    checked={selectedImages.includes(galleryImage.url)}
                                    onChange={handleSelectChange}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            }
                        </div>
                    ))}
                    {loading && <div className='loading-container'><ImSpinner9 className='spinner gallery' /></div>}
                    {!hasMore && <div className='loading-container'><p>You have reached the end.</p></div>}
                </div>
                {!isViewer &&
                    <div className='multiple-upload-button-container'>
                        <button className='portfolio-button pictures-delete-button' onClick={handleImagesRemove} >
                            <MdDeleteForever className='delete-icon' />
                            <span>Delete</span>
                        </button>
                        <button className='portfolio-button pictures-upload-button' onClick={() => fileInputRef.current.click()} >
                            <IoCloudUpload />
                            <span>Upload New Photo</span>
                        </button>

                        <input type='file' onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} accept="image/*" multiple />


                    </div>
                }

            </div>
        </div >
    )
}

export default PortfolioGallery;