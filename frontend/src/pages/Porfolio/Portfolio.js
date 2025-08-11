import React, { useEffect, useRef, useState } from 'react'
import './Portfolio.css'
import profileImage from '../../assets/images/defaultProfile.jpg';
import useAuthStore from '../../stateManagement/useAuthStore';
import UploadUserPicture from '../../components/UploadUserPicture/UploadUserPicture';
import { IoAdd, IoAddCircle, IoCloudUpload, IoLocation, IoPersonSharp } from 'react-icons/io5';
import { FaEdit, FaPhoneAlt, FaSpinner } from "react-icons/fa";
import { HiCalendarDateRange } from 'react-icons/hi2';
import { MdEmail, MdOutlineCancel, MdWork } from 'react-icons/md';
import { getPortfolio, savePortfolio, uploadPortfolioPictures } from '../../services/PortfolioServices.js';
import { toast } from 'sonner';
import { refreshUser } from '../../services/AuthServices.js';
import ServiceModal from '../../components/ServiceModal/ServiceModal.js';
import PortfolioGallery from '../../components/PortfolioGallery/PortfolioGallery.js';

const Portfolio = () => {
    const { user } = useAuthStore();
    const fileInputRef = useRef();
    const [userImage, setUserImage] = useState(profileImage);

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        location: '',
        specialization: '',
        bio: '',
        experienceYears: '',
        happyClients: '',
        photosTaken: '',
        availabilityFrom: '',
        availabilityTo: '',
    });

    const [equipments, setEquipments] = useState([]);
    const [skills, setSkills] = useState([]);
    const [availabilityDays, setAvailabilityDays] = useState([]);
    const [newEquipment, setNewEquipment] = useState('');
    const [newSkill, setNewSkill] = useState('');

    const [services, setServices] = useState([])
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const [showGalleryOverlay, setShowGalleryOverlay] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [filteredPictures, setFilteredPictures] = useState([])

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
                setFormData((prev) => ({
                    ...prev,
                    location: portfolio.location || '',
                    specialization: portfolio.specialization || '',
                    bio: portfolio.bio || '',
                    experienceYears: portfolio.experienceYears || '0',
                    happyClients: portfolio.happyClients || '0',
                    photosTaken: portfolio.photosTaken || '0',
                    availabilityFrom: portfolio?.availability?.time?.from || '',
                    availabilityTo: portfolio?.availability?.time?.to || ''
                }));
                setEquipments(portfolio.equipments);
                setSkills(portfolio.skills);
                setAvailabilityDays(portfolio.availability.days)
                setServices(portfolio.services)
                setGalleryImages(portfolio.pictures)
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

    const handleDaysChange = (e) => {
        const day = e.target.value;
        setAvailabilityDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const finalFormData = {
            ...formData,
            equipments,
            skills,
            availability: {
                days: availabilityDays,
                time: {
                    from: formData.availabilityFrom,
                    to: formData.availabilityTo
                }
            },
            services,
            filteredPictures
        }
        try {
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
        }
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
                />}
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
                                <div className='portfolio-inputs-container'>
                                    <input
                                        className='portfolio-input'
                                        type="text"
                                        name="location"
                                        placeholder="Location"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                    <span className='portfolio-input-icons'><IoLocation /></span>
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
                                        placeholder="Specialization"
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
                    <section className='portfolio-content portfolio-bio'>
                        <h2 className='portfolio-section-headers'>Bio & Description</h2>
                        <label className='portfolio-content-line portfolio-label'>Professional Bio</label>
                        <textarea className='portfolio-content-line portfolio-input'
                            placeholder='Write about yourself and your work.'
                            name='bio'
                            value={formData.bio}
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
                                            <li>{service.duration} hours of session</li>
                                            {service.features?.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
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
                                <div className='portfolio-gallery-image-container' key={index}>
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
                                        <input className='portfolio-skills-equipment-input' value={skill} onChange={(e) => handleEquipmentSkillChange(e, index)} />
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
                    <section className='portfolio-content portfolio-availabiltiy'>
                        <h2 className='portfolio-section-headers' >Availability Settings</h2>
                        <div className='porfolio-content-line portfolio-days-container'>
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div className='portfolio-day' key={day}>
                                    <label className='portfolio-label'>{day}</label>
                                    <input
                                        type='checkbox'
                                        value={day}
                                        checked={availabilityDays.includes(day)}
                                        onChange={handleDaysChange}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='portfolio-content-line portfolio-availabilty'>
                            <div className='portfolio-availability-from'>
                                <h3>Working Hours From</h3>
                                <input type='time' name='availabilityFrom' value={formData.availabilityFrom} onChange={handleChange} className='portfolio-input-hover'></input>
                            </div>
                            <div className='portfolio-availability-to'>
                                <h3>Working Hours To</h3>
                                <input type='time' name='availabilityTo' value={formData.availabilityTo} onChange={handleChange} className='portfolio-input-hover'></input>
                            </div>
                        </div>
                    </section>
                    <div className='portfolio-content portfolio-actions'>
                        <button className='portfolio-button'>Cancel</button>
                        <button className='portfolio-button' onClick={handleSave}>Save Profile</button>
                    </div>

                </div >
            </main >
        </>
    )
}
export default Portfolio;