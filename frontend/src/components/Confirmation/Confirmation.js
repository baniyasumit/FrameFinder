import React, { useEffect, useRef } from 'react'
import './Confirmation.css'

export const Confirmation = ({ title, message, extraInfo, onConfirm, setShowConfirmation }) => {
    const modelRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modelRef.current && !modelRef.current.contains(e.target)) {
                setShowConfirmation(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowConfirmation]);


    return (
        <div className="confirmation-overlay">
            <form className="confirmation-modal" ref={modelRef} onSubmit={onConfirm}>
                <button className="close-icon" onClick={() => setShowConfirmation(false)}>
                    ×
                </button>
                <div className="confirmation-header">
                    <h1 className="confirmation-title">{title}</h1>
                </div>

                <span className="confirmation-message">{message}</span>
                <span className="confirmation-extra">{extraInfo}</span>
                <div className='buttons-container'>
                    <button type="button" className="confirmation-button submit" onClick={onConfirm}>Proceed</button>
                    <button className="confirmation-button cancel" onClick={() => setShowConfirmation(false)}>Cancel</button>
                </div>
            </form>
        </div>
    )
}


export const PaymentInfo = ({ title, message, extraInfo, onConfirm, onCancel, onPayLater }) => {
    const modelRef = useRef();

    return (
        <div className="confirmation-overlay">
            <form className="confirmation-modal" ref={modelRef}>
                <div className="confirmation-header">
                    <h1 className="confirmation-title">{title}</h1>
                </div>

                <span className="confirmation-message">{message}</span>
                <span className="confirmation-extra">{extraInfo}</span>
                <div className='buttons-container'>
                    <button type="button" className="confirmation-button submit" onClick={onConfirm}>Proceed</button>
                    <button type="button" className="confirmation-button cancel" onClick={onPayLater}>Pay Later</button>
                    <button type="button" className="confirmation-button cancel" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
