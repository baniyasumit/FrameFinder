import React, { useEffect, useRef, useState } from 'react'
import './ServiceModal.css'
import { MdOutlineCancel } from 'react-icons/md';
import { IoAddCircle } from 'react-icons/io5';
import { FaDollarSign } from 'react-icons/fa';

const ServiceModal = ({ services, setServices, editIndex, setShowServiceModal }) => {
    const modelRef = useRef();
    const [serviceData, setServiceData] = useState({
        _id: '',
        title: '',
        description: '',
        price: '',
        duration: '',
        features: [],
    })
    const [featureInput, setFeatureInput] = useState('')

    useEffect(() => {
        if (editIndex === null || editIndex === undefined || !services) {
            return;
        }

        setServiceData(prev => ({
            ...prev,
            _id: services[editIndex]._id,
            title: services[editIndex].title,
            description: services[editIndex].description || '',
            price: services[editIndex].price,
            duration: services[editIndex].duration,
            features: services[editIndex].features
        }))

    }, [editIndex, services])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modelRef.current && !modelRef.current.contains(e.target)) {
                setShowServiceModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowServiceModal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData((prev) => ({ ...prev, [name]: value }));
    }

    const updateFeature = (e, index) => {
        e.preventDefault();
        setServiceData(prev => {
            const updatedFeatures = [...prev.features];
            updatedFeatures[index] = e.target.value;
            return {
                ...prev,
                features: updatedFeatures,
            };
        });
    };

    const handleAddFeature = () => {
        if (featureInput.trim() !== '') {
            setServiceData(prev => ({
                ...prev,
                features: [...prev.features, featureInput.trim()],
            }));
            setFeatureInput('');
        }
    };

    const handleRemoveFeature = (e, index) => {
        e.preventDefault();
        setServiceData((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setServices(prev => {
            const updatedServices = [...prev];
            if (editIndex !== null) {
                updatedServices[editIndex] = serviceData;
            } else {
                updatedServices.push(serviceData);
            }

            return updatedServices;
        });
        setShowServiceModal(false);
    }


    return (
        <div className="service-overlay">
            <form className="service-modal" ref={modelRef} onSubmit={handleSubmit}>
                <button className="close-icon" onClick={() => setShowServiceModal(false)}>
                    ×
                </button>
                <div className="service-header">
                    <h1 className="service-title">{editIndex !== null ? <>Edit Service</> : <>Add Service</>}</h1>
                </div>

                <input
                    className="service-inputs"
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={serviceData.title}
                    onChange={handleChange}
                />
                <input
                    className="service-inputs"
                    type="text"
                    placeholder="Short Description"
                    name="description"
                    value={serviceData.description}
                    onChange={handleChange}
                />
                <div className='service-inputs-container'>
                    <input type='number'
                        className='service-inputs' name='price'
                        placeholder="Price"
                        value={serviceData.price}
                        onChange={handleChange}
                    />

                    <span className='service-input-icons'><FaDollarSign /></span>
                </div>
                <div className='service-inputs-container'>
                    <input type='number'
                        className='service-inputs' name='duration'
                        placeholder="Duration"
                        value={serviceData.duration}
                        onChange={handleChange}
                    />
                    <span className='service-input-icons'>hr</span>
                </div>

                <h3>Includes</h3>
                {serviceData.features.map((feature, index) => (
                    <div className='service-inputs-container' key={index}>
                        <input className='service-inputs' name='feature' value={feature} onChange={(e) => updateFeature(e, index)} />
                        <button type="button" className='service-input-icons' onClick={(e) => handleRemoveFeature(e, index)}><MdOutlineCancel /></button>
                    </div>
                ))}
                <div className='service-inputs-container'>
                    <input className='service-inputs ' placeholder='Add feature...' value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} />
                    <button type="button" className='service-input-icons' name='feature' onClick={handleAddFeature}><IoAddCircle /></button>
                </div>
                <div className='submit-button-container'>
                    <button type='submit' className='submit-button'>
                        {editIndex !== null ? <>Save</> : <>Add New</>}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ServiceModal;