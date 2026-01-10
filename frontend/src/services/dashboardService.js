import api from '../api/api';
const dashboardService = {
    // Get dashboard stats
    getStats: () => api.get('/admin/stats').then(res => res.data),
};

export default dashboardService;
