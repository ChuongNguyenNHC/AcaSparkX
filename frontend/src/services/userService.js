import api from '../api/api';

const userService = {
    // List users with params (search, role, etc)
    getUsers: (params) => api.get('/admin/users', { params }).then(res => res.data),

    // Update user info
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),

    // Update specific fields
    updateRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
    updateStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),

    // CV Requests (Teacher Upgrade)
    uploadCvRequest: (data) => api.post('/student/cv-request', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    getCvRequests: () => api.get('/admin/cv-requests').then(res => res.data),
    approveCvRequest: (id) => api.patch(`/admin/cv-requests/${id}/approve`),
    rejectCvRequest: (id) => api.patch(`/admin/cv-requests/${id}/reject`),
};
export default userService;
