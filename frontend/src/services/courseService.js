import api from '../api/api';
const courseService = {
    // List courses with params (search, status, etc)
    getCourses: (params) => api.get('/admin/courses', { params }).then(res => res.data),

    // Meta data (Categories, Tags, Teachers)
    // Note: Adjust .data vs .data.data depending on backend response wrapping
    getCategories: () => api.get('/admin/categories').then(res => res.data),
    getTags: () => api.get('/admin/tags').then(res => res.data),
    getTeachersList: () => api.get('/admin/teachers-list').then(res => res.data),

    // Actions
    approveCourse: (id) => api.patch(`/admin/courses/${id}/approve`),
    rejectCourse(id) {
        return api.patch(`/admin/courses/${id}/reject`);
    },
    hideCourse(id) {
        return api.patch(`/admin/courses/${id}/hide`);
    },
    unhideCourse(id) {
        return api.patch(`/admin/courses/${id}/unhide`);
    },

    // CRUD
    createCourse: (data) => api.post('/admin/courses', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    updateCourse: (id, data) => api.post(`/admin/courses/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export default courseService;
