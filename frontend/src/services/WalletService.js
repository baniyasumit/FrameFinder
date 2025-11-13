import { ApiInstance } from "./ApiInstance";

export const getWalletDetails = async () => {
    try {
        const response = await ApiInstance.get('/api/wallet/get-wallet');
        return response.data;
    } catch (error) {
        console.error("Status error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const checkTransferability = async () => {
    try {
        const response = await ApiInstance.get('/api/wallet/check-transferability');
        return response.data;
    } catch (error) {
        console.error("Status error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const createStripeAccount = async () => {
    try {
        const response = await ApiInstance.post('/api/wallet/create-stripe-account');
        return response.data;
    } catch (error) {
        console.error("Status error:", error);
        throw error.response?.data.message || error.message;
    }
}



export const withdraw = async (amount) => {
    try {
        const response = await ApiInstance.post('/api/wallet/withdraw', { 'amount': amount });
        return response.data;
    } catch (error) {
        console.error("Status error:", error);
        throw error.response?.data.message || error.message;
    }
}

export const getTransactions = async (query) => {
    try {
        const response = await ApiInstance.get(`/api/wallet/transactions?${query || ''}`);
        return response.data;
    } catch (error) {
        console.error("Server error:", error);
        throw error.response?.data.message || error.message;
    }
}



