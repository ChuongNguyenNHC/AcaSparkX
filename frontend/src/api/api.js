import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Thêm interceptor để tự động chèn Token vào header nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const courseAPI = {
    getAll: (params) => api.get('/courses', { params }),
    getDetails: (id) => api.get(`/courses/${id}`),
    enroll: (id) => api.post(`/courses/${id}/enroll`),
    getPublicCategories: () => api.get('/public/categories'),
    getPublicTags: () => api.get('/public/tags'),
};

export const lessonAPI = {
    rate: (lessonId, stars) => api.post('/lessons/rate', { lesson_id: lessonId, stars }),
};

export default api;
