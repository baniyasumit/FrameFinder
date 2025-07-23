import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinaryConfig.js'

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'profile-pictures',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

export const uploadMiddleware = multer({ storage });
