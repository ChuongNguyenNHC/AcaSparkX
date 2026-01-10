import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserCheck, FaUserTimes, FaChalkboardTeacher, FaUser, FaHistory, FaEdit, FaBan, FaUnlock, FaUserGraduate, FaUsers, FaSpinner } from 'react-icons/fa';
import userService from '../../services/userService';

const StudentManagement = () => {
    const [activeTab, setActiveTab] = useState('all'); // all, students, teachers, pending
    const [searchTerm, setSearchTerm] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [cvRequests, setCvRequests] = useState([]); // Store CV requests separately or mixed? Better separate.
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingCv, setViewingCv] = useState(null); // URL of CV to view

    const fetchUsers = async () => {
        setLoading(true);
        try {
            if (activeTab === 'pending') {
                // Fetch CV Requests instead of Users
                const data = await userService.getCvRequests();
                setCvRequests(data.data || []);
                setAccounts([]); // Clear accounts to avoid confusion
            } else {
                let roleFilter = activeTab === 'all' ? '' : activeTab;
                if (activeTab === 'students') roleFilter = 'student_only';
                // if (activeTab === 'pending') roleFilter = 'pending_teacher'; // Now handled by getCvRequests

                const params = {
                    search: searchTerm,
                    role: roleFilter
                };
                const data = await userService.getUsers(params);
                setAccounts(data.data || []);
                setCvRequests([]);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timeout);
    }, [activeTab, searchTerm]);

    // Actions
    const handleApproveTeacher = async (id) => {
        if (window.confirm('Xác nhận duyệt quyền Giảng viên cho user này?')) {
            try {
                await userService.updateRole(id, 'teacher');
                fetchUsers();
            } catch (error) {
                alert('Có lỗi xảy ra khi duyệt quyền.');
            }
        }
    };

    const handleApproveCv = async (reqId) => {
        if (window.confirm('Xác nhận duyệt yêu cầu và nâng cấp user lên Giảng viên?')) {
            try {
                await userService.approveCvRequest(reqId);
                fetchUsers(); // Refresh list
            } catch (error) {
                alert('Có lỗi xảy ra.');
            }
        }
    };

    const handleRejectCv = async (reqId) => {
        if (window.confirm('Từ chối yêu cầu này?')) {
            try {
                await userService.rejectCvRequest(reqId);
                fetchUsers();
            } catch (error) {
                alert('Có lỗi xảy ra.');
            }
        }
    };

    const handleRejectTeacher = async (id) => { /* Keeping for backward compat if needed, but CV flow uses request ID */
        if (window.confirm('Từ chối yêu cầu?')) {
            try { await userService.updateRole(id, 'student'); fetchUsers(); } catch (e) { alert('Error'); }
        }
    };

    const handleRevokeTeacher = async (id) => {
        if (window.confirm('Xác nhận thu hồi quyền Giảng viên? User sẽ trở thành học viên.')) {
            try {
                await userService.updateRole(id, 'student');
                fetchUsers();
            } catch (error) {
                alert('Có lỗi xảy ra.');
            }
        }
    };

    const handleToggleBan = async (id, currentStatus) => {
        const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
        const action = currentStatus === 'banned' ? 'Kích hoạt lại' : 'Ban (Khóa)';
        if (window.confirm(`Bạn có chắc muốn ${action} tài khoản này?`)) {
            try {
                await userService.updateStatus(id, newStatus);
                fetchUsers();
            } catch (error) {
                alert('Không thể thay đổi trạng thái user này.');
            }
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            await userService.updateUser(editingUser.id, editingUser);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            alert('Lỗi cập nhật thông tin.');
        }
    };

    const renderTableContent = () => {
        if (activeTab === 'pending') {
            // Render CV Requests Table
            return (
                <tbody>
                    {cvRequests.length > 0 ? (
                        cvRequests.map(req => (
                            <tr key={req.id} style={styles.tr}>
                                <td style={{ ...styles.td, fontWeight: '600' }}>{req.user?.name || 'Unknown'}</td>
                                <td style={styles.td}>{req.user?.email}</td>
                                <td style={styles.td}>
                                    {req.image_url ? (
                                        <button
                                            style={{ ...styles.iconBtnInfo, width: 'auto', padding: '5px 10px', fontSize: '0.8rem' }}
                                            onClick={() => setViewingCv(req.image_url)}
                                        >
                                            Xem CV/Ảnh
                                        </button>
                                    ) : <span style={{ color: '#94a3b8' }}>Không có ảnh</span>}
                                </td>
                                <td style={styles.td}>{new Date(req.created_at).toLocaleDateString('vi-VN')}</td>
                                <td style={styles.td}>
                                    <span style={getStatusBadgeStyle(req.status === 0 ? 'pending_teacher' : (req.status === 1 ? 'active' : 'banned'))}>
                                        {req.status === 0 ? 'Chờ duyệt' : (req.status === 1 ? 'Đã duyệt' : 'Từ chối')}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {req.status === 0 && (
                                            <>
                                                <button style={styles.iconBtnSuccess} onClick={() => handleApproveCv(req.id)} title="Duyệt">
                                                    <FaUserCheck />
                                                </button>
                                                <button style={styles.iconBtnDanger} onClick={() => handleRejectCv(req.id)} title="Từ chối">
                                                    <FaUserTimes />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', padding: '30px' }}>Không có yêu cầu nào.</td></tr>
                    )}
                </tbody>
            );
        }

        // Render Users Table
        return (
            <tbody>
                {accounts.length > 0 ? (
                    accounts.map(account => (
                        <tr key={account.id} style={styles.tr}>
                            <td style={{ ...styles.td, fontWeight: '600' }}>{account.name}</td>
                            <td style={styles.td}>{account.email}</td>
                            <td style={styles.td}>
                                <span style={getRoleBadgeStyle(account.role)}>
                                    {getRoleLabel(account.role)}
                                </span>
                            </td>
                            <td style={styles.td}>{new Date(account.created_at || Date.now()).toLocaleDateString('vi-VN')}</td>
                            <td style={styles.td}>
                                <span style={getStatusBadgeStyle(account.status)}>
                                    {getStatusLabel(account.status)}
                                </span>
                            </td>
                            <td style={styles.td}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={styles.iconBtnInfo} onClick={() => setEditingUser(account)} title="Chỉnh sửa">
                                        <FaEdit />
                                    </button>
                                    {/* Traditional Promote (Manual) */}
                                    {account.role === 'student' && account.status !== 'pending_teacher' && account.status !== 'banned' && (
                                        <button style={styles.iconBtnSuccess} onClick={() => handleApproveTeacher(account.id)} title="Nâng cấp lên Giảng viên">
                                            <FaChalkboardTeacher />
                                        </button>
                                    )}
                                    {account.role === 'teacher' && account.status !== 'banned' && (
                                        <button style={styles.iconBtnWarning} onClick={() => handleRevokeTeacher(account.id)} title="Thu hồi quyền GV">
                                            <FaUserTimes />
                                        </button>
                                    )}
                                    {account.role !== 'admin' && (
                                        <button
                                            style={account.status === 'banned' ? styles.iconBtnSuccess : styles.iconBtnDanger}
                                            onClick={() => handleToggleBan(account.id, account.status)}
                                            title={account.status === 'banned' ? "Kích hoạt lại" : "Ban tài khoản"}
                                        >
                                            {account.status === 'banned' ? <FaUnlock /> : <FaBan />}
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Không tìm thấy dữ liệu phù hợp.</td></tr>
                )}
            </tbody>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Quản lý Người Dùng</h2>
                    <p style={styles.subtitle}>Quản lý tất cả thành viên trong hệ thống.</p>
                </div>
                {/* Search Bar not useful for CV Request tab yet unless we filter specifically, but keeping it visible is fine */}
                <div style={styles.searchBox}>
                    <FaSearch style={{ color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
                <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} icon={<FaUsers />} label="Tất cả" />
                <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<FaUserGraduate />} label="Học viên" />
                <TabButton active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} icon={<FaChalkboardTeacher />} label="Giảng viên" />
                <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} icon={<FaHistory />} label="Yêu cầu GV" />
            </div>

            {/* Table Area */}
            <div style={styles.tableContainer}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                        <FaSpinner className="spin" style={{ fontSize: '24px', animation: 'spin 1s linear infinite' }} />
                        <p style={{ marginTop: '10px' }}>Đang tải dữ liệu...</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Họ tên</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>{activeTab === 'pending' ? 'Hồ sơ' : 'Vai trò'}</th>
                                <th style={styles.th}>{activeTab === 'pending' ? 'Ngày gửi' : 'Ngày tham gia'}</th>
                                <th style={styles.th}>Trạng thái</th>
                                <th style={styles.th}>Hành động</th>
                            </tr>
                        </thead>
                        {renderTableContent()}
                    </table>
                )}
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={{ marginBottom: '20px' }}>Chỉnh sửa thông tin</h3>
                        <form onSubmit={handleSaveEdit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={styles.label}>Họ tên</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={editingUser.name}
                                    onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={styles.label}>Email</label>
                                <input
                                    type="email"
                                    style={styles.input}
                                    value={editingUser.email}
                                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setEditingUser(null)} style={styles.cancelBtn}>Hủy</button>
                                <button type="submit" style={styles.saveBtn}>Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {viewingCv && (
                <div style={styles.modalOverlay} onClick={() => setViewingCv(null)}>
                    <div style={{ ...styles.modalContent, width: 'auto', maxWidth: '80%', padding: '10px', backgroundColor: 'transparent', boxShadow: 'none' }} onClick={e => e.stopPropagation()}>
                        <img src={`http://localhost:8000${viewingCv}`} alt="CV Preview" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }} />
                        <button
                            onClick={() => setViewingCv(null)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
                        >X</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        style={active ? styles.activeTab : styles.tab}
        onClick={onClick}
    >
        <span style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>{icon}</span> {label}
    </button>
);

// --- Helpers ---
const getRoleLabel = (role) => {
    switch (role) {
        case 'admin': return 'Admin';
        case 'teacher': return 'Giảng viên';
        case 'student': return 'Học viên';
        default: return role;
    }
};

const getRoleBadgeStyle = (role) => {
    const base = { padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' };
    if (role === 'admin') return { ...base, backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' };
    if (role === 'teacher') return { ...base, backgroundColor: '#e0f2fe', color: '#0369a1' }; // Blue
    return { ...base, backgroundColor: '#f0fdf4', color: '#15803d' }; // Green for students
};

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
    if (status === 'banned') return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' };
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

    tabs: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
    tab: { padding: '10px 16px', borderRadius: '8px', background: 'none', border: '1px solid transparent', cursor: 'pointer', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', transition: 'all 0.2s' },
    activeTab: { padding: '10px 16px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', cursor: 'pointer', color: '#2563eb', fontWeight: '600', display: 'flex', alignItems: 'center' },

    tableContainer: { backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '16px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
    tr: { borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.1s' },
    td: { padding: '16px 20px', color: '#334155', fontSize: '0.9rem' },

    // Action Buttons
    iconBtnSuccess: { backgroundColor: '#dcfce7', color: '#166534', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' },
    iconBtnDanger: { backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' },
    iconBtnWarning: { backgroundColor: '#fef3c7', color: '#92400e', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' },
    iconBtnInfo: { backgroundColor: '#e0f2fe', color: '#0369a1', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' },

    // Modal
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
    label: { display: 'block', marginBottom: '5px', fontWeight: '500', color: '#475569', fontSize: '0.9rem' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' },
    saveBtn: { padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    cancelBtn: { padding: '10px 20px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }
};

export default StudentManagement;
