import { ApiInstance } from "./ApiInstance";

export const PLATFORMCHARGE = 100;

export const createBooking = async (formData, portfolioId) => {
    try {
        const response = await ApiInstance.post(`/api/booking/create-booking/${portfolioId}`, formData);
        return response.data
    } catch (error) {
        console.error("Save error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const checkAvailability = async (bookingForm) => {
    try {
        const response = await ApiInstance.get("/api/booking/check-availability", { params: bookingForm });

        return response.data
    } catch (error) {
        console.error("Save error:", error);
        throw error.response?.data.message || error.message;
    }
}