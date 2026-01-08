import React, { useState } from 'react';
import { FaSearch, FaUserCheck, FaUserTimes, FaChalkboardTeacher, FaUser, FaHistory } from 'react-icons/fa';

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('users'); // users, teachers, pending
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data
    const [users, setUsers] = useState([
        { id: 1, name: 'Tran Van A', email: 'vana@gmail.com', role: 'user', status: 'active', joined: '2023-10-01' },
        { id: 2, name: 'Le Thi B', email: 'thib@gmail.com', role: 'teacher', status: 'active', joined: '2023-09-15' },
        { id: 3, name: 'Nguyen Van C', email: 'vanc@gmail.com', role: 'user', status: 'pending_teacher', joined: '2023-10-20' }, // Pending teacher approval
        { id: 4, name: 'Pham Van D', email: 'vand@gmail.com', role: 'user', status: 'active', joined: '2023-11-05' },
    ]);

    // Derived Data
    const getFilteredUsers = () => {
        let filtered = users;

        // Tab Filter
        if (activeTab === 'users') {
            filtered = users.filter(u => u.role === 'user' && u.status !== 'pending_teacher');
        } else if (activeTab === 'teachers') {
            filtered = users.filter(u => u.role === 'teacher');
        } else if (activeTab === 'pending') {
            filtered = users.filter(u => u.status === 'pending_teacher');
        }

        // Search Filter
        if (searchTerm) {
            const lowerInfo = searchTerm.toLowerCase();
            filtered = filtered.filter(u =>
                u.name.toLowerCase().includes(lowerInfo) ||
                u.email.toLowerCase().includes(lowerInfo)
            );
        }

        return filtered;
    };

    const handleApproveTeacher = (id) => {
        if (window.confirm('Xác nhận lên quyền Giảng viên cho user này?')) {
            setUsers(users.map(u => u.id === id ? { ...u, role: 'teacher', status: 'active' } : u));
        }
    };

    const handleRejectTeacher = (id) => {
        if (window.confirm('Từ chối yêu cầu này?')) {
            setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u)); // Revert to active user
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Quản lý Thành viên</h2>
                    <p style={styles.subtitle}>Quản lý người dùng, giảng viên và xét duyệt quyền</p>
                </div>

                {/* Search Bar */}
                <div style={styles.searchBox}>
                    <FaSearch style={{ color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
                <button
                    style={activeTab === 'users' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('users')}
                >
                    <FaUser style={{ marginRight: '8px' }} /> Người dùng
                </button>
                <button
                    style={activeTab === 'teachers' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('teachers')}
                >
                    <FaChalkboardTeacher style={{ marginRight: '8px' }} /> Giảng viên
                </button>
                <button
                    style={activeTab === 'pending' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('pending')}
                >
                    <FaHistory style={{ marginRight: '8px' }} /> Chờ duyệt ({users.filter(u => u.status === 'pending_teacher').length})
                </button>
            </div>

            {/* Table Area */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Họ tên</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Ngày tham gia</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getFilteredUsers().length > 0 ? (
                            getFilteredUsers().map(user => (
                                <tr key={user.id} style={styles.tr}>
                                    <td style={{ ...styles.td, fontWeight: '600' }}>{user.name}</td>
                                    <td style={styles.td}>{user.email}</td>
                                    <td style={styles.td}>{user.joined}</td>
                                    <td style={styles.td}>
                                        <span style={getStatusBadgeStyle(user.status)}>
                                            {getStatusLabel(user.status)}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {activeTab === 'pending' && (
                                                <>
                                                    <button style={styles.approveBtn} onClick={() => handleApproveTeacher(user.id)} title="Duyệt">
                                                        <FaUserCheck />
                                                    </button>
                                                    <button style={styles.rejectBtn} onClick={() => handleRejectTeacher(user.id)} title="Từ chối">
                                                        <FaUserTimes />
                                                    </button>
                                                </>
                                            )}
                                            {activeTab !== 'pending' && (
                                                <button style={styles.actionBtn}>Chi tiết</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                    Không tìm thấy dữ liệu phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Helpers ---
const getStatusLabel = (status) => {
    switch (status) {
        case 'active': return 'Hoạt động';
        case 'pending_teacher': return 'Chờ duyệt GV';
        case 'banned': return 'Bị khóa';
        default: return status;
    }
};

const getStatusBadgeStyle = (status) => {
    const base = { padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' };
    if (status === 'active') return { ...base, backgroundColor: '#dcfce7', color: '#166534' };
    if (status === 'pending_teacher') return { ...base, backgroundColor: '#fef3c7', color: '#92400e' };
    return { ...base, backgroundColor: '#f1f5f9', color: '#64748b' };
};

// --- Styles ---
const styles = {
    container: { animation: 'fadeIn 0.3s ease-in-out' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '5px' },
    subtitle: { color: '#64748b', fontSize: '0.95rem' },
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', width: '300px' },
    searchInput: { border: 'none', outline: 'none', marginLeft: '10px', width: '100%', color: '#334155' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '20px' },
    tab: { padding: '10px 20px', borderRadius: '8px', background: 'none', border: '1px solid transparent', cursor: 'pointer', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center' },
    activeTab: { padding: '10px 20px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', cursor: 'pointer', color: '#2563eb', fontWeight: '600', display: 'flex', alignItems: 'center' },
    tableContainer: { backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '15px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' },
    tr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '15px 20px', color: '#334155', fontSize: '0.9rem' },
    approveBtn: { backgroundColor: '#22c55e', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    rejectBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    actionBtn: { backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', color: '#475569' }
};

export default UserManagement;
