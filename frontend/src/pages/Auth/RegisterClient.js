import React from 'react';
import './Auth.css';
import { registerUser } from '../../services/AuthServices';
import { toast } from 'sonner';
import Register from './Register';
import { useNavigate } from 'react-router-dom';

function RegisterClient() {
    const navigate = useNavigate();
    const handleSubmitClient = async (formData) => {
        try {
            const response = await registerUser(formData);
            console.log("Registration Successful:", response);
            toast.success("Account created successfully!", { position: 'top-center' });
            navigate('/login')
        } catch (err) {
            console.error("Register error:", err);
            toast.error(err, { position: 'top-center' });
        }
    };
    return (
        <Register handleSubmit={handleSubmitClient} />
    )
}

export default RegisterClient