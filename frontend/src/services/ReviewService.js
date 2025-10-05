import { ApiInstance } from "./ApiInstance";

export const checkReviewStatus = async (bookingId) => {
    try {
        const response = await ApiInstance.get(`/api/review/check-review-status/${bookingId}`);
        return response.data
    } catch (error) {
        console.error("Status error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const createReview = async (bookingId, reviewData) => {
    try {
        const response = await ApiInstance.post(`/api/review/create-review/${bookingId}`, reviewData);
        return response.data
    } catch (error) {
        console.error("Review error:", error);
        throw error.response?.data.message || error.message;
    }
}