import axios from 'axios';

const API_URL = 'http://localhost:8000/api/admin';

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const courseService = {
    // Courses
    getCourses: async (params) => {
        const response = await axios.get(`${API_URL}/courses`, { ...getAuthHeader(), params });
        return response.data;
    },
    createCourse: async (formData) => {
        // FormData needs proper headers, usually axios handles it but good to be explicit or let axios do it
        const response = await axios.post(`${API_URL}/courses`, formData, {
            headers: {
                ...getAuthHeader().headers,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    approveCourse: async (id) => {
        const response = await axios.patch(`${API_URL}/courses/${id}/approve`, {}, getAuthHeader());
        return response.data;
    },
    rejectCourse: async (id) => {
        const response = await axios.patch(`${API_URL}/courses/${id}/reject`, {}, getAuthHeader());
        return response.data;
    },
    updateCourse: async (id, formData) => {
        // Use POST for file uploads with method spoofing or just POST if backend handles it
        // Laravels PUT doesn't handle FormData files well sometimes, so we use POST with _method inside or just native POST
        // But here I'll try POST directly as I defined it in routes
        const response = await axios.post(`${API_URL}/courses/${id}?_method=PUT`, formData, {
            headers: {
                ...getAuthHeader().headers,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    getTeachersList: async () => {
        const response = await axios.get(`${API_URL}/teachers-list`, getAuthHeader());
        return response.data;
    },

    // Categories
    getCategories: async () => {
        const response = await axios.get(`${API_URL}/categories`, getAuthHeader());
        return response.data;
    },
    createCategory: async (data) => {
        const response = await axios.post(`${API_URL}/categories`, data, getAuthHeader());
        return response.data;
    },
    updateCategory: async (id, data) => {
        const response = await axios.put(`${API_URL}/categories/${id}`, data, getAuthHeader());
        return response.data;
    },
    deleteCategory: async (id) => {
        const response = await axios.delete(`${API_URL}/categories/${id}`, getAuthHeader());
        return response.data;
    },

    // Tags
    getTags: async () => {
        const response = await axios.get(`${API_URL}/tags`, getAuthHeader());
        return response.data;
    },
    createTag: async (data) => {
        const response = await axios.post(`${API_URL}/tags`, data, getAuthHeader());
        return response.data;
    },
    deleteTag: async (id) => {
        const response = await axios.delete(`${API_URL}/tags/${id}`, getAuthHeader());
        return response.data;
    }
};

export default courseService;
