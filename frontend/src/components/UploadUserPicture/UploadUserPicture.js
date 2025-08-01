import React from 'react'
import { refreshUser, uploadProfilePicture } from '../../services/AuthServices';
import useAuthStore from '../../stateManagement/useAuthStore';
import { toast } from 'sonner';

const UploadUserPicture = ({ fileInputRef, setUserImage }) => {
    const { setUser } = useAuthStore();
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
            console.error("Upload error:", err);
            toast.error(err, {
                position: 'top-center',
            });
        }


    }

    return (<input type='file' onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} accept="image/*" />)
}

export default UploadUserPicture;