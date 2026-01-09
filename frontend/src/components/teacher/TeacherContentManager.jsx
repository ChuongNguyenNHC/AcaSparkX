import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FaBook, FaPlus, FaVideo, FaTrash, FaEdit, FaPaperclip, FaUpload, FaChevronLeft } from 'react-icons/fa';

const TeacherContentManager = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentLessonId, setCurrentLessonId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        video_file: null,
        attachments: []
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchLessons(selectedCourse.id);
        }
    }, [selectedCourse]);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/teacher/courses');
            setCourses(response.data.data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        }
    };

    const fetchLessons = async (courseId) => {
        setLoading(true);
        try {
            const response = await api.get(`/teacher/courses/${courseId}/lessons`);
            setLessons(response.data.data);
        } catch (error) {
            console.error('Failed to fetch lessons', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e, field) => {
        if (field === 'video_file') {
            setFormData({ ...formData, video_file: e.target.files[0] });
        } else if (field === 'attachments') {
            setFormData({ ...formData, attachments: Array.from(e.target.files) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const data = new FormData();
        data.append('course_id', selectedCourse.id);
        data.append('title', formData.title);
        data.append('description', formData.description);

        if (formData.video_file) {
            data.append('video_file', formData.video_file);
        }

        if (formData.attachments) {
            formData.attachments.forEach((file) => {
                data.append('attachments[]', file);
            });
        }

        try {
            if (modalMode === 'add') {
                await api.post('/teacher/lessons', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage('Thêm bài học thành công!');
            } else {
                // Update logic (Not implemented fully in this snippet for brevity, but follows similar pattern)
                await api.post(`/teacher/lessons/${currentLessonId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage('Cập nhật bài học thành công!');
            }

            closeModal();
            fetchLessons(selectedCourse.id);
        } catch (error) {
            console.error('Failed to save lesson', error);
            setMessage(error.response?.data?.message || 'Có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    const deleteLesson = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
            try {
                await api.delete(`/teacher/lessons/${id}`);
                fetchLessons(selectedCourse.id);
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    const openModal = (mode, lesson = null) => {
        setModalMode(mode);
        if (lesson) {
            setCurrentLessonId(lesson.id);
            setFormData({
                title: lesson.title,
                description: lesson.description || '',
                video_file: null, // Don't pre-fill file inputs
                attachments: []
            });
        } else {
            setFormData({
                title: '',
                description: '',
                video_file: null,
                attachments: []
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ title: '', description: '', video_file: null, attachments: [] });
        setMessage('');
    };

    // Render Course List
    if (!selectedCourse) {
        return (
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>Quản lý Khóa học</h2>
                <p style={{ color: '#64748b', marginBottom: '30px' }}>Chọn khóa học để quản lý nội dung</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {courses.map(course => (
                        <div key={course.id} style={cardStyle} onClick={() => setSelectedCourse(course)}>
                            <div style={{ height: '140px', backgroundColor: '#e2e8f0', borderRadius: '12px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                <FaBook size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', marginBottom: '10px' }}>{course.title}</h3>
                            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{course.lessons?.length || 0} bài học</span>
                        </div>
                    ))}

                    {courses.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
                            <p>Bạn chưa được phân công khóa học nào.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Render Lesson List
    return (
        <div>
            <button onClick={() => setSelectedCourse(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px', fontSize: '0.95rem' }}>
                <FaChevronLeft /> Quay lại danh sách
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>{selectedCourse.title}</h2>
                    <p style={{ color: '#64748b' }}>Quản lý nội dung bài giảng</p>
                </div>
                <button
                    onClick={() => openModal('add')}
                    style={primaryButtonStyle}
                >
                    <FaPlus /> Thêm bài học
                </button>
            </div>

            {/* Lesson List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {lessons.map((lesson, index) => (
                    <div key={lesson.id} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: '#64748b' }}>
                                {index + 1}
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.05rem', margin: '0 0 5px 0', color: '#334155' }}>{lesson.title}</h4>
                                <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#94a3b8' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaVideo /> Video</span>
                                    {lesson.attachments && lesson.attachments.length > 0 && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaPaperclip /> {lesson.attachments.length} tài liệu</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => openModal('edit', lesson)} style={iconButtonStyle}>
                                <FaEdit color="#3b82f6" />
                            </button>
                            <button onClick={() => deleteLesson(lesson.id)} style={iconButtonStyle}>
                                <FaTrash color="#ef4444" />
                            </button>
                        </div>
                    </div>
                ))}
                {lessons.length === 0 && !loading && (
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '40px' }}>Chưa có bài học nào.</p>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{ marginBottom: '20px' }}>{modalMode === 'add' ? 'Thêm bài học mới' : 'Cập nhật bài học'}</h3>

                        {message && <div style={{ padding: '10px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '15px' }}>{message}</div>}

                        <form onSubmit={handleSubmit}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Tiêu đề bài học</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ ...inputStyle, minHeight: '80px' }}
                                />
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Video bài giảng (Upload)</label>
                                <div style={{ border: '2px dashed #cbd5e1', padding: '20px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleFileChange(e, 'video_file')}
                                        style={{ display: 'none' }}
                                        id="video-upload"
                                        required={modalMode === 'add'}
                                    />
                                    <label htmlFor="video-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748b' }}>
                                        <FaUpload size={24} style={{ marginBottom: '10px' }} />
                                        <span>{formData.video_file ? formData.video_file.name : 'Chọn file video từ máy tính'}</span>
                                    </label>
                                </div>
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Tài liệu đính kèm</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleFileChange(e, 'attachments')}
                                    style={inputStyle}
                                />
                                {formData.attachments.length > 0 && (
                                    <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#64748b' }}>
                                        {formData.attachments.length} file đã chọn
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                                <button type="button" onClick={closeModal} style={secondaryButtonStyle}>Hủy</button>
                                <button type="submit" disabled={loading} style={primaryButtonStyle}>
                                    {loading ? 'Đang xử lý...' : (modalMode === 'add' ? 'Thêm mới' : 'Cập nhật')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Styles
const cardStyle = {
    backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'transform 0.2s',
    ':hover': { transform: 'translateY(-2px)', borderColor: '#8b5cf6' }
};
const primaryButtonStyle = {
    padding: '10px 20px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
};
const secondaryButtonStyle = {
    padding: '10px 20px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
};
const iconButtonStyle = {
    width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
};
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modalContentStyle = {
    backgroundColor: 'white', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
};
const formGroupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' };

export default TeacherContentManager;
