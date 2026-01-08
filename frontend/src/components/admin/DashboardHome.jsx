import React from 'react';
import { FaUsers, FaUserGraduate, FaChalkboardTeacher, FaGlobeAmericas } from 'react-icons/fa';

const DashboardHome = () => {
    // Mock Data
    const stats = {
        onlineUsers: 128,
        totalUsers: 2540,
        totalTeachers: 45,
        totalCourses: 120
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Bảng điều khiển</h2>
                <p style={styles.subtitle}>Tổng quan hệ thống</p>
            </div>

            <div style={styles.grid}>
                <StatCard
                    label="Người dùng Online"
                    value={stats.onlineUsers}
                    icon={<FaGlobeAmericas />}
                    color="#10b981"
                    bg="#ecfdf5"
                />
                <StatCard
                    label="Tổng thành viên"
                    value={stats.totalUsers.toLocaleString()}
                    icon={<FaUsers />}
                    color="#3b82f6"
                    bg="#eff6ff"
                />
                <StatCard
                    label="Giảng viên"
                    value={stats.totalTeachers}
                    icon={<FaChalkboardTeacher />}
                    color="#8b5cf6"
                    bg="#f5f3ff"
                />
                <StatCard
                    label="Tổng khóa học"
                    value={stats.totalCourses}
                    icon={<FaUserGraduate />}
                    color="#f59e0b"
                    bg="#fffbeb"
                />
            </div>

            <div style={styles.welcomeSection}>
                <h3 style={{ marginBottom: '10px', color: '#334155' }}>Chào mừng Admin!</h3>
                <p style={{ color: '#64748b' }}>Hệ thống đang hoạt động ổn định.</p>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, bg }) => (
    <div style={styles.card}>
        <div style={{ ...styles.iconWrapper, color: color, backgroundColor: bg }}>
            {icon}
        </div>
        <div>
            <div style={styles.cardValue}>{value}</div>
            <div style={styles.cardLabel}>{label}</div>
        </div>
    </div>
);

const styles = {
    container: { animation: 'fadeIn 0.3s ease-in-out' },
    header: { marginBottom: '30px' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '5px' },
    subtitle: { color: '#64748b', fontSize: '0.95rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' },
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
    iconWrapper: { padding: '15px', borderRadius: '12px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    cardValue: { fontSize: '1.8rem', fontWeight: '700', color: '#1e293b', lineHeight: '1.2' },
    cardLabel: { color: '#64748b', fontSize: '0.9rem', fontWeight: '500' },
    welcomeSection: { padding: '30px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }
};

export default DashboardHome;
