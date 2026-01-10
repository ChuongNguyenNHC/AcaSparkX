import api from '../api/api';

const userService = {
    // List users with params (search, role, etc)
    getUsers: (params) => api.get('/admin/users', { params }).then(res => res.data),

    // Update user info
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),

    // Update specific fields
    updateRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
    updateStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
};
export default userService;
