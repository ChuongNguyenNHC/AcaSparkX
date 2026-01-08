import React, { useState } from 'react';
import { FaListAlt, FaPlus, FaCheckCircle, FaTimesCircle, FaLock } from 'react-icons/fa';

const CourseManagement = () => {
    const [activeTab, setActiveTab] = useState('playlists'); // playlists, moderation

    // Mock Data
    const [playlists, setPlaylists] = useState([
        { id: 1, title: 'Frontend Mastery', category: 'Web Development', teacher_id: 2, teacher_name: 'Le Thi B', status: 'active' },
        { id: 2, title: 'Backend Fundamentals', category: 'Web Development', teacher_id: 2, teacher_name: 'Le Thi B', status: 'active' },
        { id: 3, title: 'Machine Learning Basics', category: 'Data Science', teacher_id: null, teacher_name: 'Unassigned', status: 'draft' },
    ]);

    const [teachers] = useState([
        { id: 2, name: 'Le Thi B' },
        { id: 5, name: 'Doan Hieu (New)' },
    ]);

    const handleAssignTeacher = (playlistId, teacherId) => {
        const teacher = teachers.find(t => t.id === parseInt(teacherId));
        setPlaylists(playlists.map(p =>
            p.id === playlistId
                ? { ...p, teacher_id: teacherId, teacher_name: teacher ? teacher.name : 'Unassigned' }
                : p
        ));
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Quản lý Khóa học</h2>
                <p style={styles.subtitle}>Tạo Playlist và phân quyền giảng viên</p>
            </div>

            <div style={styles.tabs}>
                <button
                    style={activeTab === 'playlists' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('playlists')}
                >
                    <FaListAlt style={{ marginRight: '8px' }} /> Danh sách Playlist
                </button>
                <button
                    style={activeTab === 'moderation' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('moderation')}
                >
                    <FaCheckCircle style={{ marginRight: '8px' }} /> Kiểm duyệt Video
                </button>
            </div>

            {activeTab === 'playlists' && (
                <div style={styles.content}>
                    <div style={styles.actionsBar}>
                        <button style={styles.primaryBtn}>
                            <FaPlus style={{ marginRight: '8px' }} /> Tạo Playlist Mới
                        </button>
                    </div>

                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Tên Playlist</th>
                                    <th style={styles.th}>Danh mục</th>
                                    <th style={styles.th}>Giảng viên phụ trách</th>
                                    <th style={styles.th}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {playlists.map(playlist => (
                                    <tr key={playlist.id} style={styles.tr}>
                                        <td style={{ ...styles.td, fontWeight: '600' }}>{playlist.title}</td>
                                        <td style={styles.td}>{playlist.category}</td>
                                        <td style={styles.td}>
                                            <div style={styles.assignBox}>
                                                <select
                                                    value={playlist.teacher_id || ''}
                                                    onChange={(e) => handleAssignTeacher(playlist.id, e.target.value)}
                                                    style={styles.select}
                                                >
                                                    <option value="">Chọn giảng viên...</option>
                                                    {teachers.map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                                <FaLock style={{ color: '#94a3b8', fontSize: '0.8rem' }} title="Only this teacher can upload" />
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                backgroundColor: playlist.status === 'active' ? '#dcfce7' : '#f1f5f9',
                                                color: playlist.status === 'active' ? '#166534' : '#64748b'
                                            }}>
                                                {playlist.status === 'active' ? 'Hoạt động' : 'Nháp'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'moderation' && (
                <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <FaCheckCircle size={40} style={{ marginBottom: '15px', color: '#cbd5e1' }} />
                    <p>Hiện tại chưa có video nào cần kiểm duyệt.</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { animation: 'fadeIn 0.3s ease-in-out' },
    header: { marginBottom: '25px' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '5px' },
    subtitle: { color: '#64748b', fontSize: '0.95rem' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '20px' },
    tab: { padding: '10px 20px', borderRadius: '8px', background: 'none', border: '1px solid transparent', cursor: 'pointer', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center' },
    activeTab: { padding: '10px 20px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', cursor: 'pointer', color: '#2563eb', fontWeight: '600', display: 'flex', alignItems: 'center' },
    actionsBar: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' },
    primaryBtn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' },
    tableContainer: { backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '15px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' },
    tr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '15px 20px', color: '#334155', fontSize: '0.9rem', verticalAlign: 'middle' },
    assignBox: { display: 'flex', alignItems: 'center', gap: '10px' },
    select: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#334155' }
};

export default CourseManagement;
