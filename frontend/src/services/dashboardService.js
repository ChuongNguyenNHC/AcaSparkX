import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const dashboardService = {
    getStats: async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/stats`, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard stats", error);
            throw error;
        }
    }
};

export default dashboardService;
