import React, { useEffect, useRef, useState } from 'react'
import './Portfolio.css'
import profileImage from '../../assets/images/defaultProfile.jpg';
import useAuthStore from '../../stateManagement/useAuthStore';
import UploadUserPicture from '../../components/UploadUserPicture/UploadUserPicture';
import { IoAdd, IoAddCircle, IoCloudUpload, IoLocation, IoPersonSharp } from 'react-icons/io5';
import { FaDollarSign, FaEdit, FaPhoneAlt, FaSpinner } from "react-icons/fa";
import { HiCalendarDateRange } from 'react-icons/hi2';
import { MdEmail, MdOutlineCancel, MdOutlineMyLocation, MdWork } from 'react-icons/md';
import { getLocation, getPortfolio, getSearchedLocations, savePortfolio, uploadPortfolioPictures } from '../../services/PortfolioServices.js';
import { toast } from 'sonner';
import { refreshUser } from '../../services/AuthServices.js';
import ServiceModal from '../../components/ServiceModal/ServiceModal.js';
import PortfolioGallery from '../../components/PortfolioGallery/PortfolioGallery.js';
import { Confirmation } from '../../components/Confirmation/Confirmation.js';
import { useNavigate } from 'react-router-dom';
import usePortfolioStore from '../../stateManagement/usePortfolioStore.js';
import Mapbox from '../../components/Mapbox/Mapbox.js';
import { GrMapLocation } from "react-icons/gr";

const Portfolio = () => {
    const { user } = useAuthStore();
    const fileInputRef = useRef();
    const navigate = useNavigate();

    const [userImage, setUserImage] = useState(profileImage);

    const [portfolioId, setPortfolioId] = useState('');
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        specialization: '',
        bio: '',
        about: '',
        experienceYears: '',
        happyClients: '',
        photosTaken: '',
        standardCharge: ''
    });

    const [locationResults, setLocationResults] = useState('');
    const [location, setLocation] = useState({
        name: '',
        coordinates: [],
    });
    const [currentLocationLoading, setCurrentLocationLoading] = useState(false)
    const [showMapboxModal, setShowMapboxModal] = useState(false)
    const locationRef = useRef();

    const [equipments, setEquipments] = useState([]);
    const [skills, setSkills] = useState([]);
    const [newEquipment, setNewEquipment] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [types, setTypes] = useState([]);
    const [newType, setNewType] = useState('');

    const [services, setServices] = useState([])
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const [showGalleryOverlay, setShowGalleryOverlay] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [filteredPictures, setFilteredPictures] = useState([])

    const [isSaving, setIsSaving] = useState(false);

    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

    const { setFullImages, setPreviewIndex } = usePortfolioStore();

    useEffect(() => {
        if (user) {
            user.picture && setUserImage(user.picture)
            setFormData((prev) => ({
                ...prev,
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || ''
            }));
        }
    }, [user])

    useEffect(() => {
        const loadPortfolio = async () => {
            try {
                const portfolio = await getPortfolio();
                setPortfolioId(portfolio._id);
                setFormData((prev) => ({
                    ...prev,
                    specialization: portfolio.specialization || '',
                    bio: portfolio.bio || '',
                    about: portfolio.about || '',
                    experienceYears: portfolio.experienceYears || '0',
                    happyClients: portfolio.happyClients || '0',
                    photosTaken: portfolio.photosTaken || '0',
                    standardCharge: portfolio.standardCharge || '0',
                }));
                setEquipments(portfolio.equipments);
                setSkills(portfolio.skills);
                setServices(portfolio.services)
                setGalleryImages(portfolio.pictures)
                setLocation({
                    name: portfolio.location.name || '',
                    coordinates: portfolio.location.coordinates || []
                }) //modify locations accordingly 
                portfolio.serviceTypes ? setTypes(portfolio.serviceTypes) : setTypes([])
            } catch (error) {
                console.error("Load User Error: ", error)

            }
        };
        loadPortfolio();
    }, [setFormData]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (locationRef.current && !locationRef.current.contains(e.target)) {
                setLocationResults([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setLocationResults]);

    const handleLocationChange = async (e) => {
        const value = e.target.value;
        setLocation({ ...location, name: value });

        if (value.length < 3) {
            setLocationResults([]);
            return;
        }

        const data = await getSearchedLocations(value);
        setLocationResults(data.features);
    };

    const handleLocationClick = (e) => {
        handleLocationChange(e);
    }

    const handleCoordinatesLocationChange = async (longitude, latitude) => {
        try {
            setCurrentLocationLoading(true);
            const data = await getLocation(longitude, latitude);
            if (data.features.length > 0) {
                const placeName = data.features[0].place_name;
                const coordinates = data.features[0].geometry.coordinates;

                setLocation({
                    ...location,
                    name: placeName,
                    coordinates: coordinates,
                });
                setLocationResults([]);
            }
        } catch (err) {
            console.error("Error fetching address:", err);
        }
        finally {
            setCurrentLocationLoading(false);
        }
    }

    const handleCurrentLocation = () => {
        if ("geolocation" in navigator) {
            setCurrentLocationLoading(true);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    handleCoordinatesLocationChange(longitude, latitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setCurrentLocationLoading(false); // only stop if error occurs
                }
            );
        }
    };


    const handleLocationStore = (place) => {
        setLocation({
            ...location,
            name: place.place_name,
            coordinates: [
                place.center[0],
                place.center[1]
            ],
        });
        setLocationResults([]);
    }


    const handleEquipmentSkillChange = (e, index) => {

        const { name, value } = e.target;
        if (name === "equipment") {
            const newEquipments = [...equipments];
            newEquipments[index] = value;
            setEquipments(newEquipments);

        } else if (name === 'skill') {
            const newSkills = [...skills];
            newSkills[index] = value;
            setSkills(newSkills);
        }
    };

    const addEquipmentSkill = (type) => {
        if (type === "equipment") {

            setEquipments([...equipments, newEquipment]);
            setNewEquipment('');

        } else if (type === 'skill') {
            setSkills([...skills, newSkill]);
            setNewSkill('');
        }
    }

    const cancelEquipmentSkill = (type, index) => {
        if (type === "equipment") {
            setEquipments(equipments.filter((_, i) => i !== index));

        } else if (type === 'skill') {
            setSkills(skills.filter((_, i) => i !== index));
        }
    }

    const handleAddType = (e) => {
        if (e.key === 'Enter') {
            const type = newType;
            setTypes([...types, type]);
            setNewType('');
        }
    }


    const handleRemoveType = (index) => {
        setTypes(types.filter((_, i) => i !== index));
    }

    const handleSave = async (e) => {
        e.preventDefault();
        setShowSaveConfirmation(false);
        if (isSaving) {
            toast.info("Previous changes are being saved")
            return;
        }
        const finalFormData = {
            ...formData,
            equipments,
            skills,
            services,
            filteredPictures,
            types,
            location
        }
        try {
            setIsSaving(true);
            const response = await savePortfolio(finalFormData);
            console.log(response.message);
            toast.success('Portfolio saved successfully.');
            await refreshUser();
            setFilteredPictures([]);

            if (uploadFiles.length) {
                const toastId = toast('Uploading images! This may take a few moments.', {
                    duration: Infinity,
                    icon: <FaSpinner className='spinner' />,
                    position: 'top-right',
                });
                const imageUploadResult = await uploadPortfolioPictures(uploadFiles);
                console.log(imageUploadResult.message)
                toast.success('Images uploaded successfully!', { id: toastId, duration: 5000, icon: <></> });

            }

        } catch (err) {
            console.error("Save error:", err);
            toast.error(err, {
                position: 'top-center',
            });
        } finally {
            setIsSaving(false);

        }
    }

    const handleIsSaving = () => {
        if (isSaving) {
            toast.info("Previous changes are being saved")
            return;
        }
    }
    const handleCancel = () => {
        navigate('/dashboard')

    }

    return (
        <>
            {showServiceModal &&
                <ServiceModal
                    services={services}
                    setServices={setServices}
                    editIndex={editIndex}
                    setShowServiceModal={setShowServiceModal}
                />
            }
            {showGalleryOverlay &&
                < PortfolioGallery
                    showGalleryOverlay={showGalleryOverlay}
                    setShowGalleryOverlay={setShowGalleryOverlay}
                    galleryImages={galleryImages}
                    setGalleryImages={setGalleryImages}
                    setUploadFiles={setUploadFiles}
                    hasMore={hasMore}
                    setHasMore={setHasMore}
                    setFilteredPictures={setFilteredPictures}
                    portfolioId={portfolioId}
                />}
            {showCancelConfirmation && <Confirmation title="Are you sure you want to cancel?"
                message="If you cancel now, all the changes made will return to previous save & you will be navigated to homepage."
                setShowConfirmation={setShowCancelConfirmation}
                onConfirm={handleCancel} />}
            {showSaveConfirmation && <Confirmation title="Are you sure you want to save the changes made?"
                message="If you save the changes made currently. You will not be able to return to previous state."
                setShowConfirmation={setShowSaveConfirmation}
                onConfirm={handleSave} />}
            {showMapboxModal && <Mapbox setShowMapboxModal={setShowMapboxModal} location={location} handleLocationChangeFromMap={handleCoordinatesLocationChange} />}
            <main className='portfolio'>
                <div className='portfolio-content-container'>
                    <section className='portfolio-content portfolio-header'>
                        <h1>Edit Portfolio</h1>
                        <span>Update your portfolio and profile information.</span>
                    </section>
                    <section className='portfolio-content portfolio-basic-info'>
                        <h2 className='portfolio-section-headers'>Basic Information</h2>
                        <div className='portfolio-basic-info-line portfolio-content-line'>
                            <div className='portfolio-labeled-input '>
                                <label className='portfolio-label'>
                                    First Name:
                                </label>
                                <div className='portfolio-inputs-container'>
                                    <input
                                        className='portfolio-input'
                                        type="text"
                                        name="firstname"
                                        placeholder="First Name"
                                        value={formData.firstname}
                                        onChange={handleChange}

                                    />
                                    <span className='portfolio-input-icons'><IoPersonSharp /></span>
                                </div>
                            </div>
                            <div className='portfolio-labeled-input'>
                                <label className='portfolio-label'>
                                    Last Name:
                                </label>
                                <div className='portfolio-inputs-container'>
                                    <input
                                        className='portfolio-input'
                                        type="text"
                                        name='lastname'
                                        placeholder='Last Name'
                                        value={formData.lastname}
                                        onChange={handleChange}
                                    />
                                    <span className='portfolio-input-icons'><HiCalendarDateRange /></span>

                                </div>
                            </div>

                        </div>
                        <div className='portfolio-basic-info-line  portfolio-content-line'>
                            <div className='portfolio-labeled-input '>
                                <label className='portfolio-label'>
                                    Email:
                                </label>
                                <div className='portfolio-inputs-container'>
                                    <input
                                        className='portfolio-input'
                                        type="text"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <span className='portfolio-input-icons'><MdEmail /></span>
                                </div>
                            </div>
                            <div className='portfolio-labeled-input'>
                                <label className='portfolio-label'>
                                    Phone Number:
                                </label>
                                <div className='portfolio-inputs-container'>
                                    <input
                                        className='portfolio-input'
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                    <span className='portfolio-input-icons'><FaPhoneAlt /></span>
                                </div>
                            </div>
                        </div>
                        <div className='portfolio-basic-info-line  portfolio-content-line'>
                            <div className='portfolio-labeled-input '>
                                <label className='portfolio-label'>
                                    Location:
                                </label>
                                <div className='portfolio-inputs-container location' ref={locationRef}>

                                    <input
                                        className='portfolio-input'
                                        type="text"
                                        name="location"
                                        placeholder="Location"
                                        value={location.name}
                                        onChange={handleLocationChange}
                                        onClick={handleLocationClick}
                                        disabled={currentLocationLoading}

                                    />
                                    <span className='portfolio-input-icons'><IoLocation /></span>
                                    {locationResults.length > 0 && (
                                        <ul className="portfolio-suggestions">
                                            <>
                                                <li onClick={handleCurrentLocation} className='current-location'>Current Location <span><MdOutlineMyLocation /></span></li>
                                                <li onClick={() => setShowMapboxModal(true)} className='current-location choose'>Choose on Map <span><GrMapLocation /></span></li>
                                                {locationResults.map((place) => (
                                                    <li
                                                        key={place.id}
                                                        onClick={() => {
                                                            handleLocationStore(place)
                                                        }}
                                                    >
                                                        {place.place_name}
                                                    </li>
                                                ))}
                                            </>
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className='portfolio-labeled-input'>
                                <label className='portfolio-label'>
                                    Specialization:
                                </label>
                                <div className='portfolio-inputs-container'>
                                    <input
                                        className='portfolio-input'
                                        type="text"
                                        name="specialization"
                                        placeholder="Only write one word. eg.(Potrait), (Wedding). ."
                                        value={formData.specialization}
                                        onChange={handleChange}
                                    />
                                    <span className='portfolio-input-icons'><MdWork /></span>
                                </div>
                            </div>
                        </div>

                    </section>
                    <section className='portfolio-content portfolio-profile-picture'>
                        <h2 className='portfolio-section-headers'>Profile Picture</h2>
                        <div className='profile-picture-content'>
                            <div className='profile-picture-container'>
                                <img src={userImage} alt="Profile" />
                            </div>
                            <div className='profile-picture-upload-container' >
                                <button className='portfolio-button' onClick={() => fileInputRef.current.click()}><IoCloudUpload /> <span>Upload New Photo</span></button>
                                <UploadUserPicture fileInputRef={fileInputRef} setUserImage={setUserImage} />
                                <span>JPG,PNG or GIF. Max size 2MB</span>
                            </div>
                        </div>
                    </section>
                    <section className='portfolio-content portfolio-photography-types'>
                        <h2 className='portfolio-section-headers' >Types of Services</h2>
                        <p>Add services so that user can find you easilyin the search, they are basically like tags.
                            (eg. Wedding, Potrait [Add one at a time]).
                        </p>
                        <div className='types-container'>
                            {types?.map((type, index) => (
                                <div className='added-type-container' key={index}>
                                    <span >{type}</span>
                                    <button
                                        onClick={() => handleRemoveType(index)}>X</button>
                                </div>
                            ))}
                            <input className='add-type-input'
                                placeholder='Enter new type.'
                                value={newType}
                                onChange={(e) => setNewType(e.target.value)}
                                onKeyDown={handleAddType} />
                        </div>
                    </section>
                    <section className='portfolio-content portfolio-bio'>
                        <h2 className='portfolio-section-headers'>Bio & Description</h2>
                        <label className='portfolio-content-line portfolio-label'>Professional Bio</label>
                        <textarea className='portfolio-content-line portfolio-input'
                            placeholder='Write a small slogan.(eg.Creating timeless memories through elegant photography with 8+ years of experience in capturing lifes most precious moments.)'
                            name='bio'
                            value={formData.bio}
                            onChange={handleChange}></textarea>
                        <textarea className='portfolio-content-line portfolio-input portfolio-about'
                            placeholder='Write about yourself and your work.(100-150 words)'
                            name='about'
                            value={formData.about}
                            onChange={handleChange}></textarea>
                        <div className='photographer-stats-container '>
                            <div className='photographer-stats'>
                                <label className='portfolio-label'>
                                    Years Experience
                                </label>
                                <input type='text' className='portfolio-input'
                                    name='experienceYears'
                                    value={formData.experienceYears}
                                    onChange={handleChange}>
                                </input>
                            </div>
                            <div className='photographer-stats'>
                                <label className='portfolio-label'>
                                    Happy Clients (.approx)
                                </label>
                                <input type='text' className='portfolio-input'
                                    name='happyClients'
                                    value={formData.happyClients}
                                    onChange={handleChange}>
                                </input>
                            </div>
                            <div className='photographer-stats'>
                                <label className='portfolio-label'>
                                    Photos Taken (.approx)
                                </label>
                                <input type='text' className='portfolio-input'
                                    name='photosTaken'
                                    value={formData.photosTaken}
                                    onChange={handleChange}>
                                </input>
                            </div>
                        </div>
                    </section>
                    <section className='portfolio-content portfolio-services-packages'>
                        <div className='portfolio-services-header portfolio-content-line'>
                            <h2 className='portfolio-section-headers'>Services & Packages</h2>
                            <div className='add-service-button-container'>
                                <button className='portfolio-button add-service-button'
                                    onClick={() => { setEditIndex(null); setShowServiceModal(true) }}>
                                    <IoAdd />
                                    <span> Add service packages</span>
                                </button>
                            </div>
                        </div>
                        {services ?
                            <>
                                {services.map((service, index) => (
                                    <div className='portfolio-content-line portfolio-service-container' key={index}>
                                        <div className='portfolio-service-header'>
                                            <h3 className='portfolio-service-title'>{service.title}</h3>
                                            <div className='service-price-edit-container'>
                                                <span>${service.price}</span>
                                                <button className='service-edit-button' onClick={() => { setEditIndex(index); setShowServiceModal(true) }} ><FaEdit /> </button>
                                            </div>
                                        </div>
                                        <label className='portfolio-label'>{service.description}</label>
                                        <span className='portfolio-label '>Includes:</span>
                                        <ul className='services-label'>
                                            {service.features?.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                                <div className='portfolio-content-line portfolio-service-container standard-charge' >
                                    <label className='portfolio-service-title'>
                                        Standard Charge:
                                    </label>
                                    <div className='portfolio-inputs-container standard-charge'>
                                        <input
                                            className='portfolio-input'
                                            type="text"
                                            name="standardCharge"
                                            placeholder="Standard Charge"
                                            value={formData.standardCharge}
                                            onChange={handleChange}
                                        />
                                        <span className='portfolio-input-icons'><FaDollarSign /></span>
                                    </div>
                                </div>
                            </>
                            :
                            <div className='portfolio-content-line portfolio-service-container'>
                                <div className='portfolio-service-header'>
                                    <h3 className='portfolio-service-title'>Wedding Photography package(Sample)</h3>
                                    <div className='service-price-edit-container'>
                                        <span>$1,500</span>
                                        <button className='service-edit-button'><FaEdit /> </button>
                                    </div>
                                </div>
                                <label className='portfolio-label'>Complete wedding day coverage</label>
                                <span className='portfolio-label '>Includes:</span>
                                <ul className='services-label'>
                                    <li>8 hours of session</li>
                                    <li>300+ edited high-resolution photos</li>
                                    <li>Online gallery for sharing</li>
                                    <li>Print release included</li>
                                </ul>
                            </div>
                        }

                    </section>
                    <section className='portfolio-content portfolio-images'>
                        <h2 className='portfolio-section-headers'>Portfolio Images</h2>
                        <div className='portfolio-images-gallery portfolio-content-line'>
                            {galleryImages.slice(0, 3).map((galleryImage, index) => (
                                <div className='portfolio-gallery-image-container' key={index}
                                    onClick={() => {
                                        setFullImages([...galleryImages])
                                        setPreviewIndex(index);
                                        window.open('/view-full-picture', '_blank');
                                    }} >
                                    <img src={galleryImage.url} className='portfolio-gallery-image' alt='gallery-image' />
                                </div>
                            ))}
                            <button className='portfolio-gallery-add-image' onClick={() => setShowGalleryOverlay(true)}>
                                <IoAdd />
                                <span>View more </span>
                                <span>& Manage</span>
                            </button>
                        </div>
                    </section>
                    <section className='portfolio-content portfolio-skills-equipment'>
                        <h2 className='portfolio-section-headers' >Equipment & Skills</h2>
                        <div className='portfolio-content-line portfolio-equipments-skills-content'>
                            <div className='portfolio-equipments'>
                                <h3>Camera Equipments</h3>
                                {equipments.map((equipment, index) => (
                                    <div className='portfolio-inputs-container skills-equipment' key={index}>
                                        <input className='portfolio-skills-equipment-input' name='equipment' value={equipment} onChange={(e) => handleEquipmentSkillChange(e, index)} />
                                        <button className='portfolio-input-icons' onClick={() => cancelEquipmentSkill("equipment", index)}><MdOutlineCancel /></button>
                                    </div>
                                ))}
                                <div className='portfolio-inputs-container skills-equipment'>
                                    <input className='portfolio-skills-equipment-input' placeholder='Add equipment...' value={newEquipment} onChange={(e) => setNewEquipment(e.target.value)} />
                                    <button className='portfolio-input-icons' name='equipment' onClick={(e) => addEquipmentSkill("equipment")}><IoAddCircle /></button>
                                </div>
                            </div>
                            <div className='portfolio-skills'>
                                <h3>Skills & Expertise</h3>
                                {skills.map((skill, index) => (
                                    <div className='portfolio-inputs-container skills-equipment' key={index}>
                                        <input className='portfolio-skills-equipment-input' name='skill' value={skill} onChange={(e) => handleEquipmentSkillChange(e, index)} />
                                        <button className='portfolio-input-icons' onClick={() => cancelEquipmentSkill("skill", index)}><MdOutlineCancel /></button>
                                    </div>
                                ))}

                                <div className='portfolio-inputs-container skills-equipment'>
                                    <input className='portfolio-skills-equipment-input' placeholder='Add Skill...' value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                                    <button className='portfolio-input-icons' onClick={(e) => addEquipmentSkill("skill")}><IoAddCircle /></button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='portfolio-content portfolio-actions'>
                        <button className={`portfolio-button ${isSaving ? "is-saving" : ""}`} onClick={() => { handleIsSaving(); !isSaving && setShowCancelConfirmation(true) }}>Cancel</button>
                        <button className={`portfolio-button ${isSaving ? "is-saving" : ""}`} onClick={() => { handleIsSaving(); !isSaving && setShowSaveConfirmation(true) }}>Save Profile</button>
                    </section>

                </div >
            </main >
        </>
    )
}
export default Portfolio;