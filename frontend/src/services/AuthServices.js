import { ApiInstance } from "./ApiInstance";

export const loginUser = async (credentials) => {
    try {
        console.log(credentials)
        const response = await ApiInstance.post("/api/auth/login", credentials);
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error.response?.data.message || error.message;
    }
};

export const registerUser = async (credentials) => {
    try {
        const response = await ApiInstance.post("/api/auth/register", credentials);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error.response?.data.message || error.message;
    }
};

export const logoutUser = async () => {
    try {
        const response = await ApiInstance.post("/api/auth/logout");
        return response.data;
    }
    catch (error) {
        console.error("Logout error", error)
        throw error.response?.data.message || error.message;
    }
}

export const refreshUser = async () => {
    try {
        const response = await ApiInstance.get("/api/auth/me")
        console.log(response.data.message)
        return response.data.user;
    } catch (error) {
        console.error("Logout error")
        throw error.response?.data.message || error.message;
    }
}

export const sendOTPEmail = async () => {
    try {
        const response = await ApiInstance.post("/api/auth/send-otp-email", JSON.stringify({ purpose: 'email_verification' }))
        console.log(response.data.message)
        return response.data.message;
    } catch (error) {
        console.error("Logout error")
        throw error.response?.data.message || error.message;
    }
}

export const verifyOtp = async (otp) => {
    try {
        const response = await ApiInstance.post("/api/auth/verify-otp", { otp: otp })
        console.log(response.data)
        return response.data.message;
    } catch (error) {
        console.error("Logout error")
        throw error.response?.data.message || error.message;
    }
}