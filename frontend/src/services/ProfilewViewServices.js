import { ApiInstance } from "./ApiInstance";

export const addProfileView = async (profileViewData) => {
    try {
        const response = await ApiInstance.post('/api/profile-view/add', profileViewData);
        return response.data
    } catch (error) {
        console.error("Review error:", error);
        throw error.response?.data.message || error.message;
    }
}

export function getViewerId(user) {
    if (user?._id) return user._id; // logged-in viewer

    // Anonymous user → use persistent UUID
    let anonId = localStorage.getItem("anonymousId");
    if (!anonId) {
        anonId = crypto.randomUUID();
        localStorage.setItem("anonymousId", anonId);
    }
    return anonId;
}