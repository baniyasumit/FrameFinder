import React from 'react';
import './Auth.css';
import { registerUser } from '../../services/AuthServices';
import { toast } from 'sonner';
import Register from './Register';
import { useNavigate } from 'react-router-dom';

const RegisterPhotographer = () => {
    const navigate = useNavigate();
    const handleSubmitPhotographer = async (formData) => {
        try {
            const role = 'photographer';
            const response = await registerUser(formData, role);
            console.log("Registration Successful:", response);
            toast.success("Account created successfully!", { position: 'top-center' });
            navigate('/login')
        } catch (err) {
            console.error("Register error:", err);
            toast.error(err, { position: 'top-center' });
        }
    };
    return (
        <Register handleSubmit={handleSubmitPhotographer} role='photographer' />
    )
}

export default RegisterPhotographer