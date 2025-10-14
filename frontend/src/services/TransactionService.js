import { ApiInstance } from "./ApiInstance";


export const getPaymentStatus = async (bookingId) => {
    try {
        const response = await ApiInstance.get(`/api/transaction/payment-status/${bookingId}`);
        return response.data
    } catch (error) {
        console.error("Status error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const initatePayment = async (bookingId) => {
    try {
        const response = await ApiInstance.post(`/api/transaction/initiate-payment/${bookingId}`);
        return response.data
    } catch (error) {
        console.error("Status error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const updateAfterPayment = async (bookingId) => {
    try {
        const response = await ApiInstance.patch(`/api/transaction/update-after-payment/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error("Status error:", error);
        throw error.response?.data.message || error.message;
    }
}