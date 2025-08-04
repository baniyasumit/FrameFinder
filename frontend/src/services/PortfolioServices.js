import { ApiInstance } from "./ApiInstance";

export const savePortfolio = async (formData) => {
    try {
        const response = await ApiInstance.patch("/api/portfolio/save-portfolio", formData);
        return response.data
    } catch (error) {
        console.error("Save error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const getPortfolio = async () => {
    try {
        const response = await ApiInstance.get('/api/portfolio/get-portfolio')
        return response.data.portfolio;
    } catch (error) {
        console.error("Retrival  error:", error);
        throw error.response?.data.message || error.message;
    }

}