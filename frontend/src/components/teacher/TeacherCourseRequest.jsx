import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FaPlus, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const TeacherCourseRequest = () => {
    const [requests, setRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/teacher/requests');
            setRequests(response.data.data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/teacher/requests', formData);
            setMessage('Gửi yêu cầu thành công!');
            setFormData({ title: '', description: '' });
            setShowForm(false);
            fetchRequests();
        } catch (error) {
            console.error('Failed to create request', error);
            setMessage('Có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Yêu cầu Khóa học</h2>
                    <p style={{ color: '#64748b' }}>Gửi yêu cầu tạo Playlist khóa học mới lên Admin</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <FaPlus /> Tạo yêu cầu mới
                </button>
            </div>

            {message && <div style={{ padding: '10px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '15px' }}>{message}</div>}

            {showForm && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Tên khóa học mong muốn</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Mô tả chi tiết</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '100px' }}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {requests.map(req => (
                    <div key={req.id} style={{
                        padding: '20px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', margin: '0 0 5px 0', color: '#334155' }}>{req.title}</h4>
                            <p style={{ margin: '0', color: '#64748b', fontSize: '0.9rem' }}>{req.description.substring(0, 100)}...</p>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px', display: 'block' }}>
                                {new Date(req.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {req.status === 'pending' && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b', fontWeight: '500' }}><FaClock /> Chờ duyệt</span>}
                            {req.status === 'approved' && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontWeight: '500' }}><FaCheckCircle /> Đã duyệt</span>}
                            {req.status === 'rejected' && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontWeight: '500' }}><FaTimesCircle /> Từ chối</span>}
                        </div>
                    </div>
                ))}

                {requests.length === 0 && !loading && (
                    <p style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>Chưa có yêu cầu nào.</p>
                )}
            </div>
        </div>
    );
};

export default TeacherCourseRequest;
