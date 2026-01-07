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
    getAll: () => api.get('/courses'),
    getDetails: (id) => api.get(`/courses/${id}`),
};

export const lessonAPI = {
    rate: (lessonId, stars) => api.post('/lessons/rate', { lesson_id: lessonId, stars }),
};

export default api;
