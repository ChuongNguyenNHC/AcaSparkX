import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserGraduate, FaChalkboardTeacher, FaGlobeAmericas, FaVideo, FaLayerGroup, FaSpinner } from 'react-icons/fa';
import dashboardService from '../../services/dashboardService';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        onlineUsers: 0,
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalVideos: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Bảng điều khiển</h2>
                <p style={styles.subtitle}>Tổng quan hệ thống</p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                    <FaSpinner className="spin" style={{ fontSize: '30px', color: '#10b981', animation: 'spin 1s linear infinite' }} />
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            ) : (
                <div style={styles.grid}>
                    <StatCard
                        label="Đang Online"
                        value={stats.onlineUsers}
                        icon={<FaGlobeAmericas />}
                        color="#10b981" // Emerald 500
                        bg="#ecfdf5"    // Emerald 50
                    />
                    <StatCard
                        label="Tổng người dùng"
                        value={stats.totalUsers.toLocaleString()}
                        icon={<FaUsers />}
                        color="#10b981"
                        bg="#f0fdf4"
                        isMain={true}
                    />
                    <StatCard
                        label="Học viên"
                        value={stats.totalStudents.toLocaleString()}
                        icon={<FaUserGraduate />}
                        color="#059669" // Emerald 600
                        bg="#fff"
                    />
                    <StatCard
                        label="Giảng viên"
                        value={stats.totalTeachers}
                        icon={<FaChalkboardTeacher />}
                        color="#047857" // Emerald 700
                        bg="#fff"
                    />
                    <StatCard
                        label="Khóa học (Playlist)"
                        value={stats.totalCourses}
                        icon={<FaLayerGroup />}
                        color="#34d399" // Emerald 400
                        bg="#fff"
                    />
                    <StatCard
                        label="Tổng Video bài học"
                        value={stats.totalVideos}
                        icon={<FaVideo />}
                        color="#6ee7b7" // Emerald 300
                        bg="#fff"
                    />
                </div>
            )}

            <div style={styles.welcomeSection}>
                <div style={styles.welcomeContent}>
                    <h3 style={styles.welcomeTitle}>Chào mừng Admin!</h3>
                    <p style={styles.welcomeText}>Hệ thống AcaSparkX đang hoạt động ổn định. Kiểm tra các số liệu mới nhất ở trên để nắm bắt tình hình.</p>
                </div>
                <div style={styles.decorationCircle}></div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, bg, isMain }) => (
    <div style={{ ...styles.card, backgroundColor: bg, border: isMain ? `1px solid ${color}` : 'none' }}>
        <div style={{ ...styles.iconWrapper, color: color, backgroundColor: isMain ? 'white' : '#f0fdf4' }}>
            {icon}
        </div>
        <div>
            <div style={{ ...styles.cardValue, color: '#064e3b' }}>{value}</div>
            <div style={styles.cardLabel}>{label}</div>
        </div>
    </div>
);

const styles = {
    container: { animation: 'fadeIn 0.4s ease-out', padding: '10px' },
    header: { marginBottom: '35px' },
    title: { fontSize: '1.8rem', fontWeight: '800', color: '#064e3b', marginBottom: '8px', letterSpacing: '-0.5px' },
    subtitle: { color: '#64748b', fontSize: '1rem', fontWeight: '500' },

    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
    },
    card: {
        padding: '28px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
        backgroundColor: 'white'
    },
    iconWrapper: {
        width: '60px',
        height: '60px',
        borderRadius: '16px',
        fontSize: '1.6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    },
    cardValue: { fontSize: '2rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '4px' },
    cardLabel: { color: '#6b7280', fontSize: '0.95rem', fontWeight: '600' },

    welcomeSection: {
        position: 'relative',
        padding: '40px',
        backgroundColor: '#064e3b',
        borderRadius: '24px',
        overflow: 'hidden',
        color: 'white',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    welcomeContent: { position: 'relative', zIndex: 2 },
    welcomeTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px' },
    welcomeText: { opacity: 0.9, lineHeight: '1.6', maxWidth: '600px' },
    decorationCircle: {
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '300px',
        height: '300px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        zIndex: 1
    }
};

export default DashboardHome;

