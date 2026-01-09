import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Navigate } from 'react-router-dom';
import {
    FaVideo, FaLayerGroup, FaChartLine, FaUpload,
    FaEdit, FaTrash, FaUsers, FaEye, FaStar,
    FaPlus, FaTimes, FaSearch, FaArrowLeft, FaFileVideo,
    FaCalendarAlt, FaQuestionCircle, FaCommentDots, FaCheckCircle
} from 'react-icons/fa';

import AdminDashboard from '../components/admin/AdminDashboard'; // Import Admin Dashboard

const TeacherDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Authorization check
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
        return <Navigate to="/" replace />;
    }

    // Redirect to Admin Dashboard if role is admin
    if (user.role === 'admin') {
        return <AdminDashboard />;
    }

    const [activeTab, setActiveTab] = useState('lessons'); // 'lessons', 'qa', or 'stats'
    const [selectedCourseForVideo, setSelectedCourseForVideo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentItem, setCurrentItem] = useState(null);
    const [notification, setNotification] = useState(null); // String or Object { message, action: { label, onClick } }

    // Q&A State
    const [replyingId, setReplyingId] = useState(null);
    const [replyText, setReplyText] = useState('');

    // --- Mock Data ---

    // public\Tables\courses
    const [courses] = useState([
        {
            id: 'uuid-c1',
            instructor_id: 2,
            title: 'Frontend Mastery',
            description: 'Comprehensive Frontend Course',
            thumbnail: 'https://via.placeholder.com/300x200?text=Frontend',
            status: 'active'
        },
        {
            id: 'uuid-c2',
            instructor_id: 2,
            title: 'Backend Fundamentals',
            description: 'Learn Laravel & Node.js',
            thumbnail: 'https://via.placeholder.com/300x200?text=Backend',
            status: 'active'
        },
    ]);

    // public\Tables\lessons
    const [lessons, setLessons] = useState([
        { id: 'uuid-l1', course_id: 'uuid-c1', title: 'Introduction to React', description: 'Basic concepts', video_url: 'mock_video_1.mp4', rating: 4.5, views: 1200, created_at: '2023-10-01T10:00:00' },
        { id: 'uuid-l2', course_id: 'uuid-c1', title: 'State Management', description: 'Redux and Context', video_url: 'mock_video_2.mp4', rating: 4.8, views: 850, created_at: '2023-10-05T14:30:00' },
        { id: 'uuid-l3', course_id: 'uuid-c2', title: 'Laravel Routing', description: 'Defining routes', video_url: 'mock_video_3.mp4', rating: 4.7, views: 950, created_at: '2023-10-10T09:15:00' },
    ]);

    // Mock Questions (Q&A)
    const [questions, setQuestions] = useState([
        { id: 1, student_name: 'Nguyen Van A', course_id: 'uuid-c1', content: 'Làm sao để sử dụng useEffect đúng cách?', date: '2023-10-25', status: 'pending' },
        { id: 2, student_name: 'Le Thi B', course_id: 'uuid-c1', content: 'Redux Toolkit khác gì với Redux thường?', date: '2023-10-24', status: 'answered' },
        { id: 3, student_name: 'Tran Van C', course_id: 'uuid-c2', content: 'Middleware trong Laravel hoạt động thế nào?', date: '2023-10-23', status: 'pending' },
    ]);

    // Stats calculation
    const totalViews = lessons.reduce((sum, l) => sum + (l.views || 0), 0);
    const avgRating = lessons.length > 0
        ? (lessons.reduce((sum, l) => sum + (l.rating || 0), 0) / lessons.length).toFixed(1)
        : 0;

    const stats = {
        totalStudents: 1250,
        totalViews: totalViews,
        activeCourses: courses.length,
        avgRating: avgRating
    };

    // --- Actions ---

    const showToast = (content) => {
        setNotification(content);
        setTimeout(() => setNotification(null), 5000);
    };

    const handleDeleteLesson = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
            setLessons(lessons.filter(l => l.id !== id));
            showToast('Đã xóa bài học thành công!');
        }
    };

    const handleSaveLesson = (lessonData) => {
        if (modalMode === 'add') {
            const newLesson = {
                id: `uuid-l${Date.now()}`,
                course_id: selectedCourseForVideo.id,
                ...lessonData,
                rating: 0,
                views: 0,
                created_at: new Date().toISOString()
            };
            setLessons([newLesson, ...lessons]);
            showToast('Đã thêm bài học mới!');
        } else {
            setLessons(lessons.map(l => l.id === currentItem.id ? { ...l, ...lessonData } : l));
            showToast('Đã cập nhật bài học thành công!');
        }
        setShowModal(false);
    };

    const handleAnswerQuestion = (id) => {
        setReplyingId(id);
        setReplyText('');
    };

    const submitAnswer = (id) => {
        if (!replyText.trim()) return;

        // Mock answering
        setQuestions(questions.map(q => q.id === id ? { ...q, status: 'answered' } : q));
        setReplyingId(null);

        showToast('Đã trả lời câu hỏi!');
    };

    const undoAnswer = (id) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: 'pending' } : q));
        showToast('Đã hoàn tác!');
    };

    const openModal = (mode, item = null) => {
        setModalMode(mode);
        setCurrentItem(item);
        setShowModal(true);
    };

    const getCourseTitle = (courseId) => {
        const c = courses.find(x => x.id === courseId);
        return c ? c.title : 'Unknown Course';
    };

    // --- Render ---

    return (
        <div style={styles.pageContainer}>
            <Header />

            <div style={styles.mainContainer}>

                <div style={styles.dashboardLayout}>
                    {/* Sidebar with Stats */}
                    <div style={styles.sidebarColumn}>
                        <div style={styles.sidebar}>
                            <h3 style={styles.sidebarTitle}>Quản lý Giảng viên</h3>
                            <nav style={styles.navMenu}>
                                <button
                                    onClick={() => { setActiveTab('lessons'); setSelectedCourseForVideo(null); }}
                                    style={activeTab === 'lessons' ? styles.activeNavItem : styles.navItem}
                                >
                                    <FaVideo style={styles.navIcon} /> Video Bài giảng
                                </button>
                                <button
                                    onClick={() => setActiveTab('qa')}
                                    style={activeTab === 'qa' ? styles.activeNavItem : styles.navItem}
                                >
                                    <FaQuestionCircle style={styles.navIcon} /> Hỏi đáp
                                    {questions.filter(q => q.status === 'pending').length > 0 && (
                                        <span style={styles.badgeCount}>{questions.filter(q => q.status === 'pending').length}</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('stats')}
                                    style={activeTab === 'stats' ? styles.activeNavItem : styles.navItem}
                                >
                                    <FaChartLine style={styles.navIcon} /> Thống kê
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content Panel */}
                    <div style={styles.contentPanel}>

                        {/* Tab: Stats */}
                        {activeTab === 'stats' && (
                            <div style={styles.fadeIn}>
                                <div style={styles.sectionHeader}>
                                    <div>
                                        <h2 style={styles.sectionTitle}>Thống kê tổng quan</h2>
                                        <p style={styles.sectionSubtitle}>Số liệu hoạt động của các khóa học</p>
                                    </div>
                                </div>
                                <div style={{ ...styles.gridContainer, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                    <MiniStatItemLarge val={stats.totalStudents} label="Học viên" icon={<FaUsers />} color="#3b82f6" />
                                    <MiniStatItemLarge val={stats.totalViews.toLocaleString()} label="Lượt xem video" icon={<FaEye />} color="#10b981" />
                                    <MiniStatItemLarge val={stats.activeCourses} label="Khóa học đang hoạt động" icon={<FaVideo />} color="#8b5cf6" />
                                    <MiniStatItemLarge val={stats.avgRating} label="Đánh giá trung bình" icon={<FaStar />} color="#f59e0b" />
                                </div>
                            </div>
                        )}

                        {/* Tab: Video Management */}
                        {activeTab === 'lessons' && !selectedCourseForVideo && (
                            <div style={styles.fadeIn}>
                                <div style={styles.sectionHeader}>
                                    <div>
                                        <h2 style={styles.sectionTitle}>Chọn Khóa học</h2>
                                        <p style={styles.sectionSubtitle}>Chọn khóa học để đăng video bài giảng mới</p>
                                    </div>
                                </div>
                                <div style={styles.gridContainer}>
                                    {courses.map(course => (
                                        <div
                                            key={course.id}
                                            style={styles.courseCardClickable}
                                            onClick={() => setSelectedCourseForVideo(course)}
                                        >
                                            <div style={styles.cardImageContainer}>
                                                <img src={course.thumbnail} alt={course.title} style={styles.cardImage} />
                                                <div style={styles.cardHoverOverlay}>
                                                    <FaEdit size={24} color="white" />
                                                    <span>Quản lý Video</span>
                                                </div>
                                            </div>
                                            <div style={styles.cardContent}>
                                                <h4 style={styles.cardTitle}>{course.title}</h4>
                                                <p style={styles.cardDesc}>{course.description}</p>
                                                <div style={styles.cardMeta}>
                                                    <span><FaVideo size={12} /> {lessons.filter(l => l.course_id === course.id).length} bài học</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'lessons' && selectedCourseForVideo && (
                            <div style={styles.fadeIn}>
                                <div style={styles.sectionHeader}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <button onClick={() => setSelectedCourseForVideo(null)} style={styles.backBtn}>
                                            <FaArrowLeft />
                                        </button>
                                        <div>
                                            <h2 style={styles.sectionTitle}>{selectedCourseForVideo.title}</h2>
                                            <p style={styles.sectionSubtitle}>Quản lý danh sách video</p>
                                        </div>
                                    </div>
                                    <button style={styles.primaryBtn} onClick={() => openModal('add')}>
                                        <FaUpload style={{ marginRight: '8px' }} /> Đăng Video Mới
                                    </button>
                                </div>

                                <div style={styles.tableContainer}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>Tiêu đề</th>
                                                <th style={styles.th}>Ngày đăng</th>
                                                <th style={styles.th}>Lượt xem</th>
                                                <th style={styles.th}>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lessons
                                                .filter(l => l.course_id === selectedCourseForVideo.id)
                                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                .map(lesson => (
                                                    <tr key={lesson.id} style={styles.tr}>
                                                        <td style={{ ...styles.td, fontWeight: '500' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <div style={styles.videoIconBox}><FaFileVideo /></div>
                                                                <div>
                                                                    <div>{lesson.title}</div>
                                                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{lesson.description.substring(0, 30)}...</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={styles.td}>
                                                            {new Date(lesson.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td style={styles.td}>{lesson.views.toLocaleString()}</td>
                                                        <td style={styles.td}>
                                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                                <button style={styles.iconBtn} onClick={() => openModal('edit', lesson)} title="Chỉnh sửa">
                                                                    <FaEdit />
                                                                </button>
                                                                <button style={{ ...styles.iconBtn, color: '#ef4444' }} onClick={() => handleDeleteLesson(lesson.id)} title="Xóa">
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Tab: Q&A */}
                        {activeTab === 'qa' && (
                            <div style={styles.fadeIn}>
                                <div style={styles.sectionHeader}>
                                    <div>
                                        <h2 style={styles.sectionTitle}>Hỏi đáp học viên</h2>
                                        <p style={styles.sectionSubtitle}>Danh sách các câu hỏi mới nhất từ học viên</p>
                                    </div>
                                </div>
                                <div style={styles.qaList}>
                                    {questions.sort((a, b) => (a.status === 'pending' ? -1 : 1)).map(q => (
                                        <div key={q.id} style={q.status === 'pending' ? styles.qaCardPending : styles.qaCard}>
                                            <div style={styles.qaHeader}>
                                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{q.student_name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{q.date}</div>
                                            </div>
                                            <div style={styles.qaCourseBadge}>
                                                Khóa học: {getCourseTitle(q.course_id)}
                                            </div>
                                            <p style={styles.qaContent}>{q.content}</p>
                                            <div style={styles.qaActions}>
                                                {q.status === 'pending' ? (
                                                    replyingId === q.id ? (
                                                        <div style={{ width: '100%', marginTop: '10px' }}>
                                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                                <input
                                                                    type="text"
                                                                    style={{ ...styles.input, flex: 1 }}
                                                                    placeholder="Nhập câu trả lời..."
                                                                    value={replyText}
                                                                    onChange={(e) => setReplyText(e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && submitAnswer(q.id)}
                                                                    autoFocus
                                                                />
                                                                <button style={styles.primaryBtn} onClick={() => submitAnswer(q.id)}>
                                                                    Gửi
                                                                </button>
                                                                <button
                                                                    style={{ ...styles.secondaryBtn, border: 'none' }}
                                                                    onClick={() => setReplyingId(null)}
                                                                >
                                                                    Hủy
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => handleAnswerQuestion(q.id)} style={styles.replyBtn}>
                                                            <FaCommentDots style={{ marginRight: '6px' }} /> Trả lời ngay
                                                        </button>
                                                    )
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                                                            <FaCheckCircle style={{ marginRight: '6px' }} /> Đã trả lời
                                                        </div>
                                                        <button
                                                            style={styles.undoBtn}
                                                            onClick={() => undoAnswer(q.id)}
                                                            title="Hoàn tác câu trả lời"
                                                        >
                                                            Hoàn tác
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div style={styles.toast}>
                    {typeof notification === 'string' ? notification : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span>{notification.message}</span>
                            {notification.action && (
                                <button
                                    onClick={notification.action.onClick}
                                    style={{
                                        background: 'none',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        color: '#fbbf24',
                                        padding: '4px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    {notification.action.label}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3>{modalMode === 'add' ? 'Đăng Video Mới' : 'Chỉnh sửa Video'}</h3>
                            <button onClick={() => setShowModal(false)} style={styles.closeBtn}><FaTimes /></button>
                        </div>
                        <div style={styles.modalBody}>
                            <LessonForm
                                initialData={currentItem}
                                onSave={handleSaveLesson}
                                onCancel={() => setShowModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

// --- Sub-Components ---

const MiniStatItemLarge = ({ label, val, icon, color }) => (
    <div style={{ ...styles.miniStatItem, padding: '30px', alignItems: 'flex-start', textAlign: 'left', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
            <div style={{ ...styles.miniStatIcon, color, backgroundColor: `${color}15`, fontSize: '1.5rem', padding: '12px' }}>{icon}</div>
        </div>
        <div>
            <div style={{ ...styles.miniStatVal, fontSize: '1.8rem' }}>{val}</div>
            <div style={{ ...styles.miniStatLabel, fontSize: '0.9rem' }}>{label}</div>
        </div>
    </div>
);

const MiniStatItem = ({ label, val, icon, color }) => (
    <div style={styles.miniStatItem}>
        <div style={{ ...styles.miniStatIcon, color, backgroundColor: `${color}15` }}>{icon}</div>
        <div>
            <div style={styles.miniStatVal}>{val}</div>
            <div style={styles.miniStatLabel}>{label}</div>
        </div>
    </div>
);

const LessonForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialData || { title: '', description: '', video_file: null });
    const [fileError, setFileError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!initialData && !formData.video_file) {
            setFileError('Vui lòng chọn video để tải lên');
            return;
        }
        let updatedData = { ...formData };
        if (formData.video_file) updatedData.video_url = URL.createObjectURL(formData.video_file);
        onSave(updatedData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('video/')) {
                setFileError('File không hợp lệ');
                return;
            }
            setFormData({ ...formData, video_file: file });
            setFileError('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Tiêu đề bài học</label>
                <input type="text" required style={styles.input} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Mô tả</label>
                <textarea style={{ ...styles.input, height: '80px' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Video File</label>
                {!initialData && (
                    <div style={styles.fileUploadBox}>
                        <input type="file" accept="video/*" id="v-upload" style={{ display: 'none' }} onChange={handleFileChange} />
                        <label htmlFor="v-upload" style={styles.fileUploadLabel}>
                            <FaUpload size={20} color="#3b82f6" />
                            <span style={{ marginTop: '5px' }}>{formData.video_file ? formData.video_file.name : 'Chọn Video'}</span>
                        </label>
                    </div>
                )}
                {fileError && <div style={{ color: '#ef4444', fontSize: '0.8rem' }}>{fileError}</div>}
            </div>
            <div style={styles.formActions}>
                <button type="button" onClick={onCancel} style={styles.secondaryBtn}>Hủy</button>
                <button type="submit" style={styles.primaryBtn}>Lưu</button>
            </div>
        </form>
    );
};

// --- Styles ---
const styles = {
    pageContainer: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" },
    mainContainer: { flex: 1, maxWidth: '1280px', width: '95%', margin: '0 auto', padding: '30px 0' },
    dashboardLayout: { display: 'flex', gap: '30px', alignItems: 'flex-start' },
    sidebarColumn: { display: 'flex', flexDirection: 'column', gap: '20px', width: '280px', flexShrink: 0 },
    sidebar: { backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    sidebarStats: { backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    miniStatsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    miniStatItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px' },
    miniStatIcon: { fontSize: '1.2rem', padding: '8px', borderRadius: '50%', marginBottom: '8px' },
    miniStatVal: { fontWeight: '700', color: '#1e293b', fontSize: '1.1rem' },
    miniStatLabel: { fontSize: '0.75rem', color: '#64748b' },
    sidebarTitle: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: '700', marginBottom: '16px', paddingLeft: '8px' },
    navMenu: { display: 'flex', flexDirection: 'column', gap: '8px' },
    navItem: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '8px', color: '#64748b', background: 'none', border: 'none', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer', width: '100%', textAlign: 'left', justifyContent: 'space-between' },
    activeNavItem: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '8px', color: '#3b82f6', backgroundColor: '#eff6ff', border: 'none', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', width: '100%', textAlign: 'left', justifyContent: 'space-between' },
    navIcon: { marginRight: '12px', fontSize: '1.1rem' },
    badgeCount: { backgroundColor: '#ef4444', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px' },
    contentPanel: { flex: 1, backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minHeight: '600px' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    sectionTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
    sectionSubtitle: { color: '#64748b', fontSize: '0.95rem' },
    primaryBtn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' },
    gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
    courseCardClickable: { border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white', cursor: 'pointer', position: 'relative', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-4px)' } },
    cardImageContainer: { position: 'relative', height: '140px', backgroundColor: '#e2e8f0' },
    cardImage: { width: '100%', height: '100%', objectFit: 'cover' },
    cardContent: { padding: '15px' },
    cardTitle: { margin: '0 0 5px 0', fontSize: '1rem', fontWeight: '600', color: '#1e293b' },
    cardDesc: { fontSize: '0.85rem', color: '#64748b', margin: '0 0 10px 0' },
    cardMeta: { fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center' },
    cardHoverOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(59,130,246,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', opacity: 0, transition: 'opacity 0.2s', fontWeight: '600', gap: '5px' },
    backBtn: { background: 'none', border: '1px solid #e2e8f0', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' },
    tableContainer: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0' },
    th: { padding: '12px', textAlign: 'left', color: '#64748b', fontWeight: '600', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem', backgroundColor: '#f8fafc' },
    td: { padding: '12px', borderBottom: '1px solid #f1f5f9', color: '#334155', verticalAlign: 'middle', fontSize: '0.9rem' },
    videoIconBox: { width: '32px', height: '32px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px' },
    // Q&A Styles
    qaList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    qaCard: { padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
    qaCardPending: { padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white', borderLeft: '4px solid #f59e0b', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
    qaHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    qaCourseBadge: { fontSize: '0.75rem', color: '#3b82f6', backgroundColor: '#eff6ff', display: 'inline-block', padding: '2px 8px', borderRadius: '4px', marginBottom: '10px' },
    qaContent: { fontSize: '0.95rem', color: '#334155', marginBottom: '15px', lineHeight: '1.5' },
    replyBtn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    undoBtn: { background: 'none', border: '1px solid #cbd5e1', color: '#64748b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' },
    // Modal & Toast
    toast: { position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#1e293b', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000 },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
    modalContent: { backgroundColor: 'white', borderRadius: '16px', width: '95%', maxWidth: '500px' },
    modalHeader: { padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    closeBtn: { background: 'none', border: 'none', fontSize: '1.2rem', color: '#94a3b8', cursor: 'pointer' },
    modalBody: { padding: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '0.85rem', fontWeight: '500', color: '#64748b' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' },
    fileUploadBox: { border: '2px dashed #cbd5e1', borderRadius: '6px', padding: '20px', textAlign: 'center', cursor: 'pointer' },
    fileUploadLabel: { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer' },
    formActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' },
    secondaryBtn: { backgroundColor: 'white', color: '#64748b', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
.course-card-hover:hover .card-overlay { opacity: 1 !important; }
`;
document.head.appendChild(styleSheet);

export default TeacherDashboard;
