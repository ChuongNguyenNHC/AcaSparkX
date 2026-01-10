import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaImage, FaChalkboardTeacher } from 'react-icons/fa';
import courseService from '../../../services/courseService';
import ImageWithFallback from '../../../components/common/ImageWithFallback';

const CourseRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');

    // Meta Data (for Course Creation Modal)
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [teachers, setTeachers] = useState([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [activeRequest, setActiveRequest] = useState(null); // The request being turned into a course
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        tags: [],
        teachers: [],
        thumbnail: null,
        status: 'draft',
        remove_thumbnail: false
    });
    const [previewImg, setPreviewImg] = useState(null);

    useEffect(() => {
        fetchRequests();
        fetchMeta();
    }, [statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await courseService.getRequests({ status: statusFilter === 'all' ? '' : statusFilter });
            setRequests(res.data);
        } catch (error) {
            console.error('Fetch Requests Error:', error);
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

    const handleReject = async (id) => {
        if (!window.confirm('Từ chối yêu cầu này?')) return;
        try {
            await courseService.rejectRequest(id);
            fetchRequests();
        } catch (error) {
            alert('Failed to reject');
        }
    };

    // Open Modal to Create Course from Request
    const handleAccept = (request) => {
        setActiveRequest(request);
        setFormData({
            title: request.title,
            description: request.description,
            category_id: '',
            tags: [],
            teachers: [request.instructor_id], // Auto-select the requester as teacher
            thumbnail: null,
            status: 'draft',
            remove_thumbnail: false
        });
        setPreviewImg(null);
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, thumbnail: file, remove_thumbnail: false });
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handleRemoveThumbnail = () => {
        setFormData({ ...formData, thumbnail: null, remove_thumbnail: true });
        setPreviewImg(null);
    };

    const toggleSelection = (id, field) => {
        const current = formData[field];
        if (current.includes(id)) {
            setFormData({ ...formData, [field]: current.filter(item => item !== id) });
        } else {
            setFormData({ ...formData, [field]: [...current, id] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Create Course
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category_id', formData.category_id);

        formData.tags.forEach(tagId => data.append('tags[]', tagId));
        formData.teachers.forEach(teacherId => data.append('teachers[]', teacherId));

        if (formData.thumbnail) {
            data.append('thumbnail', formData.thumbnail);
        }

        try {
            // Create Course
            await courseService.createCourse(data);

            // 2. Approve Request
            if (activeRequest) {
                await courseService.approveRequest(activeRequest.id);
            }

            setShowModal(false);
            setActiveRequest(null);
            alert('Đã tạo khóa học và chấp nhận yêu cầu!');
            fetchRequests();
        } catch (error) {
            const msg = error.response?.data?.message || 'Create failed';
            alert(`Error: ${msg}`);
            console.error(error);
        }
    };

    return (
        <div>
            {/* Filter */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="rejected">Đã từ chối</option>
                </select>
            </div>

            {/* Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={styles.th}>Người yêu cầu</th>
                            <th style={styles.th}>Tên khóa học</th>
                            <th style={styles.th}>Mô tả</th>
                            <th style={styles.th}>Ngày gửi</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                        ) : requests.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Không có yêu cầu nào.</td></tr>
                        ) : requests.map(req => (
                            <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={styles.td}>
                                    <div style={{ fontWeight: '600' }}>{req.instructor?.name || 'Unknown'}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{req.instructor?.email}</div>
                                </td>
                                <td style={styles.td}>{req.title}</td>
                                <td style={styles.td}>
                                    <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={req.description}>
                                        {req.description}
                                    </div>
                                </td>
                                <td style={styles.td}>{new Date(req.created_at).toLocaleDateString()}</td>
                                <td style={styles.td}>
                                    <StatusBadge status={req.status} />
                                </td>
                                <td style={styles.td}>
                                    {req.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleAccept(req)} title="Chấp nhận & Tạo khóa học" style={styles.iconBtnSuccess}><FaCheckCircle /></button>
                                            <button onClick={() => handleReject(req.id)} title="Từ chối" style={styles.iconBtnDanger}><FaTimesCircle /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - Create Course based on Request */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={{ marginBottom: '20px' }}>Tạo khóa học từ Yêu cầu</h3>
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
                                    {previewImg ? (
                                        <ImageWithFallback
                                            src={previewImg}
                                            alt="Preview"
                                            style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                            fallbackSrc="https://via.placeholder.com/80x50?text=Error"
                                        />
                                    ) : (
                                        <div style={{ width: '80px', height: '50px', backgroundColor: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                                            Mặc định
                                        </div>
                                    )}

                                    <label style={{ cursor: 'pointer', padding: '8px 15px', backgroundColor: '#e2e8f0', borderRadius: '6px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <FaImage /> Chọn ảnh
                                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                    </label>

                                    {previewImg && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveThumbnail}
                                            style={{ padding: '8px 10px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
                                        >
                                            X Bỏ chọn
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Teachers */}
                            <div>
                                <label style={styles.label}><FaChalkboardTeacher /> Gán Giảng viên (Đã tự chọn người yêu cầu)</label>
                                <div style={{ maxHeight: '100px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }}>
                                    {teachers.map(t => (
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
                                <button type="submit" style={styles.btnPrimary}>Tạo Khóa Học</button>
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

    if (status === 'approved') {
        color = '#166534'; bg = '#dcfce7'; label = 'Đã duyệt';
    } else if (status === 'pending') {
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
    th: { textAlign: 'left', padding: '15px', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' },
    td: { padding: '15px', color: '#334155', verticalAlign: 'middle', fontSize: '0.95rem' },
    iconBtnSuccess: { background: 'none', border: 'none', cursor: 'pointer', color: '#10b981', fontSize: '1.1rem' },
    iconBtnDanger: { background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1.1rem' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' },
    label: { display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500', color: '#334155' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' },
    btnPrimary: { padding: '10px 20px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    btnSecondary: { padding: '10px 20px', borderRadius: '6px', backgroundColor: '#e2e8f0', color: 'white', border: 'none', cursor: 'pointer' }
};

export default CourseRequests;
