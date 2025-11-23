import React, { useEffect, useRef } from 'react'
import './PortfolioPreview.css'


const PortfolioPreview = (
    { url, setShowPreview }) => {

    const modalRef = useRef();



    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowPreview(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowPreview]);

    return (
        <div className="preview-overlay">
            <div className="preview-modal" ref={modalRef}>
                <button className="close-icon" onClick={() => setShowPreview(false)}>
                    ×
                </button>

                <iframe
                    src={url}
                    className="preview-iframe"
                    title="Portfolio Preview"
                />

            </div>
        </div >
    )
}

export default PortfolioPreview;