import { ApiInstance } from "./ApiInstance";


export const getTotals = async () => {
    try {
        const response = await ApiInstance.get('/api/dashboard/get-totals');
        return response.data
    } catch (error) {
        console.error(" Eror fetching total messages:", error);
        throw error.response?.data.message || error.message;
    }
}

export const getPieChartData = async () => {
    try {
        const response = await ApiInstance.get('/api/dashboard/get-pie-chart-data');
        return response.data
    } catch (error) {
        console.error(" Eror fetching total messages:", error);
        throw error.response?.data.message || error.message;
    }
}

export const getLineGraphData = async () => {
    try {
        const response = await ApiInstance.get('/api/dashboard/get-revenue-data');
        return response.data
    } catch (error) {
        console.error(" Eror fetching total messages:", error);
        throw error.response?.data.message || error.message;
    }
}