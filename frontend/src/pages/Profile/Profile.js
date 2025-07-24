import React, { useEffect, useRef, useState } from 'react';
import './Profile.css'
import profileImage from '../../assets/images/defaultProfile.jpg';
import useAuthStore from '../../stateManagement/useAuthStore';
import { format } from 'date-fns';
import { IoPersonSharp } from "react-icons/io5";
import { MdDeleteForever, MdEmail } from "react-icons/md";
import { HiCalendarDateRange } from "react-icons/hi2";
import { FaPhoneAlt, FaUserEdit, FaKey, FaSave, FaCameraRetro } from "react-icons/fa";
import { ChangePassword } from '../../components/EditProfile/ChangePassword';
import { toast } from 'sonner';
import { deleteAccount, editProfile, refreshUser, uploadProfilePicture } from '../../services/AuthServices';
import { Confirmation } from '../../components/Confirmation/Confirmation';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, setUser } = useAuthStore();
    const { navigate } = useNavigate();
    const createdDate = new Date(user?.createdAt);
    const formattedCreatedDate = format(createdDate, 'MMM dd yyyy');
    const [editable, setEditable] = useState(false);
    const [editData, setEditData] = useState({
        fullname: '',
        email: '',
        phoneNumber: ''
    });
    const [editError, setEditError] = useState({
        fullname: '',
        email: '',
        phoneNumber: ''
    });
    const [showChangePassword, setShowChangePassword] = useState(false);

    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [showDeletConfirmation, setShowDeleteConfirmation] = useState(false);

    const fileInputRef = useRef(null);
    const [userImage, setUserImage] = useState(profileImage);

    const handleChange = (e) => {

        const { name, value } = e.target;
        console.log(name, value)
        setEditData((prev) => ({ ...prev, [name]: value }));

    };

    useEffect(() => {
        if (user) {
            setUserImage(user.picture || profileImage);
            setEditData((prev) => ({
                ...prev,
                fullname: [user.firstname, user.lastname].filter(Boolean).join(' '),
                email: user.email || '',
                phoneNumber: user.phoneNumber || ''
            }));
        }
    }, [user]);

    const validate = () => {
        const newErrors = {};

        const nameParts = editData.fullname.trim().split(' ').filter(part => part.length > 0);
        if (nameParts.length < 2) {
            newErrors.fullname = "Both first and last name are required";
        }

        if (nameParts.length > 2) {
            newErrors.fullname = "Only enter first and last name"
        }

        if (!editData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!editData.phoneNumber) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(editData.phoneNumber)) {
            newErrors.phoneNumber = "Phone number must be 10 digits";
        }

        setEditError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!validate()) return;
        if (editData.email !== user.email) {
            setShowEditConfirmation(true);
        } else {
            saveProfile();
        }
    }
    const saveProfile = async () => {
        setShowEditConfirmation(false);
        try {
            const response = await editProfile(editData);
            setEditable(false)
            console.log("Edit Success:", response);
            const userData = await refreshUser();
            setUser(userData);
            toast.success('Profile Edited successfully');
        } catch (err) {
            console.error("Edit error:", err);
            toast.error(err, {
                position: 'top-center',
            });
        }
    }

    const deleteProfile = async () => {
        setShowDeleteConfirmation(false);
        try {
            const response = await deleteAccount();
            console.log("Delete Success:", response);
            const userData = await refreshUser();
            setUser(userData);
            navigate('/')
            toast.success('Profile Deleted successfully');
        } catch (err) {
            console.error("Delete error:", err);
            toast.error(err, {
                position: 'top-center',
            });
        }
    }

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.log("File not selected.");
            return;
        }
        const blobUrl = URL.createObjectURL(file)
        setUserImage(blobUrl)

        try {
            const response = await uploadProfilePicture(file);
            console.log("Upload Success:", response);
            const userData = await refreshUser();
            setUser(userData);
            URL.revokeObjectURL(blobUrl);
            toast.success('Profile picture changed successfully');

        } catch (err) {
            console.error("Login error:", err);
            toast.error(err, {
                position: 'top-center',
            });
        }


    }

    return (
        <>{showChangePassword && <ChangePassword setShowChangePassword={setShowChangePassword} />}
            {showEditConfirmation && <Confirmation title="Are you sure you want to change the email?"
                message="If you change the email you will have to reverify to access some pages."
                extraInfo={`New Email : ${editData.email}`}
                setShowConfirmation={setShowEditConfirmation}
                onConfirm={saveProfile} />}
            {showDeletConfirmation && <Confirmation title="Are you sure you want to delete this account?"
                message="If you delete this account you will not be able to recover the account again."
                setShowConfirmation={setShowDeleteConfirmation}
                onConfirm={deleteProfile} />}
            <main className="profile-container">
                <section className='profile-cover-image'>
                    <div className='profile-image-container'>

                        <img src={userImage} alt="Profile" className='profile-image' />

                    </div>

                    <button className='profile-image-container overlay' onClick={() => fileInputRef.current.click()}>
                        <FaCameraRetro className='profile-change-icon' />
                    </button>
                    <input type='file' ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                </section>
                <section className='profile-information-background'>
                    <div className='profile-information-container'>
                        <div className='profile-information-line'>
                            <h1>
                                YOUR PROFILE
                            </h1>
                        </div>
                        <div className='profile-information-line'>
                            <div className='profile-labeled-input'>
                                <label className='profile-labels'>
                                    Full Name:
                                </label>
                                <div className='profile-inputs-container'>
                                    <input
                                        className='profile-inputs'
                                        type="text"
                                        name="fullname"
                                        placeholder="Full Name"
                                        value={editData.fullname}
                                        onChange={handleChange}
                                        disabled={!editable}
                                    />
                                    <span className='input-icons'><IoPersonSharp /></span>
                                </div>
                                {editError.fullname && <div className="password-error">{editError.fullname}</div>}
                            </div>
                            <div className='profile-labeled-input'>
                                <label className='profile-labels'>
                                    Member Since:
                                </label>
                                <div className='profile-inputs-container'>
                                    <input
                                        className='profile-inputs'
                                        type="text"
                                        value={formattedCreatedDate}
                                        disabled
                                    />
                                    <span className='input-icons'><HiCalendarDateRange /></span>

                                </div>
                            </div>

                        </div>
                        <div className='profile-information-line'>
                            <div className='profile-labeled-input'>
                                <label className='profile-labels'>
                                    Email:
                                </label>
                                <div className='profile-inputs-container'>
                                    <input
                                        className='profile-inputs'
                                        type="text"
                                        name="email"
                                        placeholder="Email"
                                        value={editData.email}
                                        onChange={handleChange}
                                        disabled={!editable}
                                    />
                                    <span className='input-icons'><MdEmail /></span>
                                    {editError.email && <div className="password-error">{editError.email}</div>}
                                </div>
                            </div>
                            <div className='profile-labeled-input'>
                                <label className='profile-labels'>
                                    Phone Number:
                                </label>
                                <div className='profile-inputs-container'>
                                    <input
                                        className='profile-inputs'
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        value={editData.phoneNumber}
                                        onChange={handleChange}
                                        disabled={!editable}
                                    />
                                    <span className='input-icons'><FaPhoneAlt /></span>
                                    {editError.phoneNumber && <div className="password-error">{editError.phoneNumber}</div>}
                                </div>
                            </div>

                        </div>
                        <hr />
                        <div className='profile-information-line'>
                            <h3>
                                Account Actions
                            </h3>
                        </div>
                        <div className='profile-information-line account-actions'>
                            {editable ?
                                <button className='account-action edit' onClick={handleSave}>
                                    <FaSave />
                                    Save
                                </button>
                                :
                                <button className='account-action edit' onClick={() => setEditable(true)}>
                                    <FaUserEdit />
                                    Edit Profile
                                </button>
                            }


                            <button className='account-action' onClick={() => setShowChangePassword(true)} >
                                <FaKey />
                                Change Password
                            </button>
                            <button className='account-action delete' onClick={() => setShowDeleteConfirmation(true)} >
                                <MdDeleteForever />
                                Delete Account
                            </button>
                        </div>

                    </div>

                </section>
            </main >
        </>
    )
}

export default Profile;