import { ApiInstance } from "./ApiInstance";


export const getTotalMessages = async () => {
    try {
        const response = await ApiInstance.get('/api/message/get-total-messages');
        return response.data
    } catch (error) {
        console.error(" Eror fetching total messages:", error);
        throw error.response?.data.message || error.message;
    }
}

export const getMessageList = async (query) => {
    try {
        const response = await ApiInstance.get(`/api/message/get-message-list?${query || ''}`)

        return response.data
    } catch (error) {
        console.error("Save error:", error);
        throw error.response?.data.message || error.message;
    }
}

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