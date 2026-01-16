import { ApiInstance } from "./ApiInstance";

export const sendContactEmail = async (formData) => {
    try {
        const response = await ApiInstance.post('/api/info/send-contact-email', formData);
        return response.data
    } catch (error) {
        console.error(" Error sending the email:", error);
        throw error.response?.data.message || error.message;
    }
}