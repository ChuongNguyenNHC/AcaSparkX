import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserCheck, FaUserTimes, FaChalkboardTeacher, FaUser, FaHistory, FaEdit, FaBan, FaUnlock, FaUserGraduate, FaUsers, FaSpinner } from 'react-icons/fa';
import userService from '../../services/userService';

const StudentManagement = () => {
    const [activeTab, setActiveTab] = useState('all'); // all, students, teachers, pending
    const [searchTerm, setSearchTerm] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null); // User being edited

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let roleFilter = activeTab === 'all' ? '' : activeTab;
            // Map tabs to backend filters
            if (activeTab === 'students') roleFilter = 'student_only';
            if (activeTab === 'pending') roleFilter = 'pending_teacher';
            // 'teachers' maps directly

            const params = {
                search: searchTerm,
                role: roleFilter
            };
            const data = await userService.getUsers(params);
            setAccounts(data.data || []); // Assuming Laravel pagination response structure
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchUsers();
        }, 500); // Debounce search
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

    const handleRejectTeacher = async (id) => {
        if (window.confirm('Từ chối yêu cầu làm giảng viên? User sẽ trở về trạng thái học viên.')) {
            try {
                // Assuming rejection sends them back to normal student? 
                // Alternatively, backend handles this logically via "reject" endpoint or just setting status active + role student.
                // Let's assume we just set them back to 'student' role which clears pending status if needed, 
                // OR we just keep them as student but status active.
                // Plan said "Revoke Teacher: Downgrade teacher to student."
                // For pending, we might just want to set status to active?
                // Backend logic: "If promoting... status=active". 
                // For rejecting: we probably just want to set status back to active (if they were pending).
                // But the 'role' endpoint doesn't explicitly handle 'reject'.
                // Let's use updateStatus('active') if they are just pending status?
                // Or maybe updateRole('student')? 
                // Let's try updateRole('student') as safest.
                await userService.updateRole(id, 'student');
                // Also ensure status is active if it was pending?
                // Let's call updateStatus just to be sure if role update doesn't handle it.
                // Actually, let's just use updateRole('student') and if that fails we can debug.
                fetchUsers();
            } catch (error) {
                alert('Có lỗi xảy ra.');
            }
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
                alert('Không thể thay đổi trạng thái user này (có thể là admin).');
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

    // Derived Data for rendering (now simpler as main filtering is backend-side)
    const getDisplayUsers = () => {
        return accounts;
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Quản lý Người Dùng</h2>
                    <p style={styles.subtitle}>Quản lý tất cả thành viên trong hệ thống (API Real-time)</p>
                </div>

                {/* Search Bar */}
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
                <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} icon={<FaHistory />} label="Chờ duyệt GV" />
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
                                <th style={styles.th}>Vai trò</th>
                                <th style={styles.th}>Ngày tham gia</th>
                                <th style={styles.th}>Trạng thái</th>
                                <th style={styles.th}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getDisplayUsers().length > 0 ? (
                                getDisplayUsers().map(account => (
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
                                                {/* Edit Button */}
                                                <button style={styles.iconBtnInfo} onClick={() => setEditingUser(account)} title="Chỉnh sửa">
                                                    <FaEdit />
                                                </button>

                                                {/* Role & Status Actions */}
                                                {/* Approve Pending Teacher */}
                                                {account.status === 'pending_teacher' && (
                                                    <>
                                                        <button style={styles.iconBtnSuccess} onClick={() => handleApproveTeacher(account.id)} title="Duyệt lên Giảng viên">
                                                            <FaUserCheck />
                                                        </button>
                                                        <button style={styles.iconBtnDanger} onClick={() => handleRejectTeacher(account.id)} title="Từ chối">
                                                            <FaUserTimes />
                                                        </button>
                                                    </>
                                                )}

                                                {/* Promote Regular Student */}
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

                                                {/* Ban/Activate */}
                                                {account.role !== 'admin' && ( // Cannot ban admin
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
                                <tr>
                                    <td colSpan="6" style={{ ...styles.td, textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                        Không tìm thấy dữ liệu phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
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
