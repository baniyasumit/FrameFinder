import { ApiInstance } from "./ApiInstance";

export const getMessages = async (bookingId, pageNum) => {
    try {
        const response = await ApiInstance.get(`/api/message/get-messages/${bookingId}?pageNum=${pageNum}`);
        return response.data
    } catch (error) {
        console.error(" Eror fetching messages:", error);
        throw error.response?.data.message || error.message;
    }
}

export const createMessage = async (bookingId, newMessage) => {
    try {
        const response = await ApiInstance.post(`/api/message/create-message/${bookingId}`, { 'text': newMessage });
        return response.data
    } catch (error) {
        console.error("Creating new message error:", error);
        throw error.response?.data.message || error.message;
    }
}