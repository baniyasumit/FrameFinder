import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL
const ApiInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

ApiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `${token}`;
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


export { ApiInstance, setupInterceptors };
