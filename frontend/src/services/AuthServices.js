import { ApiInstance } from "./ApiInstance";

export const loginUser = async (credentials) => {
    try {
        const response = await ApiInstance.post("/api/auth/login", credentials);
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error.response?.data.message;
    }
};

export const registerUser = async (credentials) => {
    try {
        const response = await ApiInstance.post("/api/auth/register", credentials);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error.response?.data.message;
    }
};

export const logoutUser = async () => {
    try {
        const response = await ApiInstance.post("/api/auth/logout");
        return response.data;
    }
    catch (error) {
        console.error("Logout error", error)
        throw error.response?.data.message;
    }
}