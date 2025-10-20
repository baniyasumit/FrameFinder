import { ApiInstance } from "./ApiInstance";


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

export const getTotalBookings = async (query) => {
    try {
        const response = await ApiInstance.get(`/api/booking/get-total-bookings?${query || ''}`)

        return response.data
    } catch (error) {
        console.error("Save error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const getBookings = async (query) => {
    try {
        const response = await ApiInstance.get(`/api/booking/get-bookings?${query || ''}`)

        return response.data
    } catch (error) {
        console.error("Save error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const getTotalBookingsPhotographer = async (query) => {
    try {
        const response = await ApiInstance.get(`/api/booking/photographer/get-total-bookings?${query || ''}`)

        return response.data
    } catch (error) {
        console.error("Save error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const getBookingsPhotographer = async (query) => {
    try {
        const response = await ApiInstance.get(`/api/booking/photographer/get-bookings?${query || ''}`)

        return response.data
    } catch (error) {
        console.error("Save error:", error);
        throw error.response?.data.message || error.message;
    }
}


export const getBookingInformation = async (bookingId) => {
    try {
        const response = await ApiInstance.get(`/api/booking/get-booking/${bookingId}`);

        return response.data?.bookingInformation
    } catch (error) {
        console.error("Save error:", error);
        throw error.response?.data.message || error.message;
    }
}


export const getBookingInformationPhotographer = async (bookingId) => {
    try {
        const response = await ApiInstance.get(`/api/booking/photographer/get-booking/${bookingId}`);
        return response.data?.bookingInformation
    } catch (error) {
        console.error("Save error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const changeBookingStatus = async (bookingId, status) => {
    try {
        const response = await ApiInstance.patch(`/api/booking/change-booking-status/${bookingId}`, { 'status': status });
        return response.data
    } catch (error) {
        console.error("Update error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const cancelDeclineBooking = async (bookingId, status) => {
    try {
        const response = await ApiInstance.patch(`/api/booking/cancel-decline-booking/${bookingId}`, { 'status': status });
        return response.data
    } catch (error) {
        console.error("Update error:", error);
        throw error.response?.data.message || error.message;
    }
}