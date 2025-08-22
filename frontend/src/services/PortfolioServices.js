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

export const uploadPortfolioPictures = async (files) => {
    try {
        const uploadData = new FormData();
        for (const file of files) {
            uploadData.append('portfolio', file.file)
        }
        const response = await ApiInstance.post("/api/portfolio/upload-portfolio-pictures", uploadData);
        return response.data;
    } catch (error) {
        console.error("Upload portfolio error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const getPortfolioPictures = async (page, portfolioId) => {
    try {

        const response = await ApiInstance.get(`/api/portfolio/get-portfolio-pictures/${portfolioId}?page=${page}`);
        return response.data;
    } catch (error) {
        console.error("Portfolio Pictures Retrieval error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const getPhotographerPortfolio = async (portfolioId) => {
    try {
        const response = await ApiInstance.get(`/api/portfolio/get-portfolio/${portfolioId}`)
        return response.data.portfolio;
    } catch (error) {
        console.error("Retrival  error:", error);
        throw error.response?.data.message || error.message;
    }

}

