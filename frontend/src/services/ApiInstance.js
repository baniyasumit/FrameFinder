
import axios from "axios";
import { isSafari } from "../utils/detectBrowser.js";


const API_URL = process.env.REACT_APP_API_URL;

// Axios instance
const ApiInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

ApiInstance.interceptors.request.use(
    (config) => {
        let token;


        if (isSafari()) {
            token = localStorage.getItem("token");
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


const setupInterceptors = (logout) => {
    ApiInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error.response?.status;

            if (status === 401) {
                console.log("Unauthorized (401) - Logging out...");
                logout();
            }

            if (status === 403) {
                console.log("Forbidden (403) - User role not authorized.");
            }

            return Promise.reject(error);
        }
    );
};


export const storeTokenForSafari = (token) => {
    if (isSafari()) {
        localStorage.setItem("token", token);
    }

    ApiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const logoutUserSafari = () => {
    try {
        // 1️⃣ Clear token from Axios default headers
        delete ApiInstance.defaults.headers.common['Authorization'];

        // 2️⃣ Clear token from localStorage (Safari only)
        localStorage.removeItem('token');

        // 3️⃣ Optionally, call backend to clear HttpOnly cookie for other browsers
        ApiInstance.post('/api/auth/logout').catch(err => console.error(err));

        // 4️⃣ Any additional frontend logout logic (redirect, clear state, etc.)
        console.log("Logged out successfully");
    } catch (err) {
        console.error("Logout error:", err);
    }
};

export { ApiInstance, setupInterceptors };
