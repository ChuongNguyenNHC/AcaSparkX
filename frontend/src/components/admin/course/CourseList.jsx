import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEdit, FaSearch, FaPlus, FaImage, FaChalkboardTeacher } from 'react-icons/fa';
import courseService from '../../../services/courseService';

const CourseList = ({ type }) => {
    // type: 'all' or 'pending'
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(type === 'pending' ? 'draft' : 'all');

    // Meta Data
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [teachers, setTeachers] = useState([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null); // If null, creates new
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        tags: [],
        teachers: [],
        thumbnail: null,
        status: 'draft'
    });
    const [previewImg, setPreviewImg] = useState(null);

    useEffect(() => {
        fetchCourses();
        fetchMeta();
    }, [searchTerm, statusFilter]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const params = {
                search: searchTerm,
                status: type === 'pending' ? 'draft' : (statusFilter === 'all' ? '' : statusFilter)
            };
            const data = await courseService.getCourses(params);
            setCourses(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMeta = async () => {
        try {
            const [cats, tgs, tchs] = await Promise.all([
                courseService.getCategories(),
                courseService.getTags(),
                courseService.getTeachersList()
            ]);
            setCategories(cats);
            setTags(tgs);
            setTeachers(tchs);
        } catch (error) {
            console.error("Meta fetch failed", error);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Approve this course to be Published?')) return;
        try {
            await courseService.approveCourse(id);
            fetchCourses();
        } catch (error) {
            alert('Failed to approve');
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Reject this course?')) return;
        try {
            await courseService.rejectCourse(id);
            fetchCourses();
        } catch (error) {
            alert('Failed to reject');
        }
    };

    // --- Modal Handlers ---

    const openCreate = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', category_id: '', tags: [], teachers: [], thumbnail: null, status: 'draft' });
        setPreviewImg(null);
        setShowModal(true);
    };

    const openEdit = (course) => {
        setEditingId(course.id);
        setFormData({
            title: course.title,
            description: course.description || '',
            category_id: course.category_id || '',
            tags: course.tags ? course.tags.map(t => t.id) : [],
            teachers: course.teachers ? course.teachers.map(t => t.id) : [],
            thumbnail: null, // Don't reset thumbnail unless changed
            status: course.status
        });
        setPreviewImg(course.thumbnail ? `http://localhost:8000/storage/${course.thumbnail}` : null);
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, thumbnail: file });
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category_id', formData.category_id);

        // Append Arrays
        formData.tags.forEach(tagId => data.append('tags[]', tagId));
        formData.teachers.forEach(teacherId => data.append('teachers[]', teacherId));

        if (formData.thumbnail) {
            data.append('thumbnail', formData.thumbnail);
        }

        try {
            if (editingId) {
                await courseService.updateCourse(editingId, data);
            } else {
                await courseService.createCourse(data);
            }
            setShowModal(false);
            fetchCourses();
        } catch (error) {
            const msg = error.response?.data?.message || (editingId ? 'Update failed' : 'Create failed');
            alert(`Error: ${msg}`);
            console.error(error);
        }
    };

    const toggleSelection = (id, field) => {
        const current = formData[field];
        if (current.includes(id)) {
            setFormData({ ...formData, [field]: current.filter(item => item !== id) });
        } else {
            setFormData({ ...formData, [field]: [...current, id] });
        }
    };

    return (
        <div>
            {/* Header / Filters */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <FaSearch style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm khóa học..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    {type !== 'pending' && (
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="published">Đã xuất bản</option>
                            <option value="draft">Chờ duyệt</option>
                            <option value="rejected">Từ chối</option>
                        </select>
                    )}
                </div>
                <button onClick={openCreate} style={styles.btnPrimary}>
                    <FaPlus style={{ marginRight: '5px' }} /> Tạo Khóa Học
                </button>
            </div>

            {/* Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={styles.th}>Ảnh</th>
                            <th style={styles.th}>Khóa học</th>
                            <th style={styles.th}>GV Phụ trách</th>
                            <th style={styles.th}>Danh mục</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                        ) : courses.map(course => (
                            <tr key={course.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={styles.td}>
                                    {course.thumbnail ? (
                                        <img src={`http://localhost:8000/storage/${course.thumbnail}`} alt="Thumb" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    ) : (
                                        <div style={{ width: '60px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}></div>
                                    )}
                                </td>
                                <td style={styles.td}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{course.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{course.tags?.map(t => '#' + t.name).join(' ')}</div>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    {course.teachers && course.teachers.length > 0 ? (
                                        <div style={{ fontSize: '0.85rem' }}>
                                            {course.teachers.map(t => t.name).join(', ')}
                                        </div>
                                    ) : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa gán</span>}
                                </td>
                                <td style={styles.td}>{course.category?.name || '-'}</td>
                                <td style={styles.td}>
                                    <StatusBadge status={course.status} />
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {course.status === 'draft' && (
                                            <>
                                                <button onClick={() => handleApprove(course.id)} title="Duyệt" style={styles.iconBtnSuccess}><FaCheckCircle /></button>
                                                <button onClick={() => handleReject(course.id)} title="Từ chối" style={styles.iconBtnDanger}><FaTimesCircle /></button>
                                            </>
                                        )}
                                        <button onClick={() => openEdit(course)} title="Chỉnh sửa" style={styles.iconBtnInfo}><FaEdit /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                            {/* Basic Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={styles.label}>Tiêu đề *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>
                                <div>
                                    <label style={styles.label}>Danh mục *</label>
                                    <select
                                        required
                                        value={formData.category_id}
                                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                        style={styles.input}
                                    >
                                        <option value="">Chọn danh mục...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={styles.label}>Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    style={{ ...styles.input, height: '80px' }}
                                />
                            </div>

                            {/* Thumbnail */}
                            <div>
                                <label style={styles.label}>Thumbnail</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {previewImg && <img src={previewImg} alt="Preview" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />}
                                    <label style={{ cursor: 'pointer', padding: '8px 15px', backgroundColor: '#e2e8f0', borderRadius: '6px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <FaImage /> Chọn ảnh
                                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>

                            {/* Teachers */}
                            <div>
                                <label style={styles.label}><FaChalkboardTeacher /> Gán Giảng viên (Phân quyền đăng bài)</label>
                                <div style={{ maxHeight: '100px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }}>
                                    {teachers.length === 0 ? <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Chưa có giảng viên nào.</p> :
                                        teachers.map(t => (
                                            <div key={t.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.teachers.includes(t.id)}
                                                    onChange={() => toggleSelection(t.id, 'teachers')}
                                                    style={{ marginRight: '8px' }}
                                                />
                                                <span style={{ fontSize: '0.9rem' }}>{t.name} ({t.email})</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label style={styles.label}>Tags</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                                    {tags.map(t => (
                                        <span
                                            key={t.id}
                                            onClick={() => toggleSelection(t.id, 'tags')}
                                            style={{
                                                padding: '4px 10px',
                                                borderRadius: '15px',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                backgroundColor: formData.tags.includes(t.id) ? '#3b82f6' : '#e2e8f0',
                                                color: formData.tags.includes(t.id) ? 'white' : '#64748b'
                                            }}
                                        >
                                            {t.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={styles.btnSecondary}>Hủy</button>
                                <button type="submit" style={styles.btnPrimary}>{editingId ? 'Lưu thay đổi' : 'Tạo mới'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    let color = '#64748b';
    let bg = '#f1f5f9';
    let label = status;

    if (status === 'published' || status === 'active') {
        color = '#166534'; bg = '#dcfce7'; label = 'Đã xuất bản';
    } else if (status === 'draft') {
        color = '#b45309'; bg = '#fef3c7'; label = 'Chờ duyệt';
    } else if (status === 'rejected') {
        color = '#991b1b'; bg = '#fee2e2'; label = 'Từ chối';
    }

    return (
        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', color: color, backgroundColor: bg }}>
            {label}
        </span>
    );
};

const styles = {
    th: { textAlign: 'left', padding: '15px', color: '#64748b', fontSize: '0.9rem' },
    td: { padding: '15px', color: '#334155', verticalAlign: 'middle' },
    iconBtnSuccess: { background: 'none', border: 'none', cursor: 'pointer', color: '#10b981', fontSize: '1.1rem' },
    iconBtnDanger: { background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1.1rem' },
    iconBtnInfo: { background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: '1.1rem' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' },
    label: { display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500', color: '#334155' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' },
    btnPrimary: { padding: '10px 20px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    btnSecondary: { padding: '10px 20px', borderRadius: '6px', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', cursor: 'pointer' }
};

export default CourseList;
