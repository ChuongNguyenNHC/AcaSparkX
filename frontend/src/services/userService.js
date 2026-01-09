import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const userService = {
    // Get all users with filters (page, search, role, status)
    getUsers: async (params) => {
        try {
            const response = await axios.get(`${API_URL}/admin/users`, {
                params,
                ...getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching users", error);
            throw error;
        }
    },

    // Update basic info
    updateUser: async (id, data) => {
        try {
            const response = await axios.put(`${API_URL}/admin/users/${id}`, data, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error("Error updating user", error);
            throw error;
        }
    },

    // Update Role
    updateRole: async (id, role) => {
        try {
            const response = await axios.patch(`${API_URL}/admin/users/${id}/role`, { role }, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error("Error updating role", error);
            throw error;
        }
    },

    // Update Status
    updateStatus: async (id, status) => {
        try {
            const response = await axios.patch(`${API_URL}/admin/users/${id}/status`, { status }, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error("Error updating status", error);
            throw error;
        }
    },
};

export default userService;
