import React, { useState } from 'react';
import { FaChartPie, FaUsers, FaBook, FaSignOutAlt } from 'react-icons/fa';
import DashboardHome from './DashboardHome';
import StudentManagement from './StudentManagement';
import CourseManagement from './CourseManagement';
import Header from '../Header';
import Footer from '../Footer';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, students, courses

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardHome />;
            case 'students': return <StudentManagement />;
            case 'courses': return <CourseManagement />;
            default: return <DashboardHome />;
        }
    };

    return (
        <div style={styles.pageContainer}>
            <Header />
            <div style={styles.mainContainer}>
                <div style={styles.layout}>

                    {/* Admin Sidebar */}
                    <div style={styles.sidebarColumn}>
                        <div style={styles.sidebar}>
                            <div style={styles.sidebarHeader}>
                                <div style={styles.avatar}>A</div>
                                <div>
                                    <div style={styles.roleLabel}>Administrator</div>
                                </div>
                            </div>

                            <h3 style={styles.menuTitle}>QUẢN TRỊ VIÊN</h3>
                            <nav style={styles.navMenu}>
                                <button
                                    style={activeTab === 'dashboard' ? styles.activeNavItem : styles.navItem}
                                    onClick={() => setActiveTab('dashboard')}
                                >
                                    <FaChartPie style={styles.navIcon} /> Bảng điều khiển
                                </button>
                                <button
                                    style={activeTab === 'students' ? styles.activeNavItem : styles.navItem}
                                    onClick={() => setActiveTab('students')}
                                >
                                    <FaUsers style={styles.navIcon} /> Quản lý người dùng
                                </button>
                                <button
                                    style={activeTab === 'courses' ? styles.activeNavItem : styles.navItem}
                                    onClick={() => setActiveTab('courses')}
                                >
                                    <FaBook style={styles.navIcon} /> Quản lý khóa học
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content Panel */}
                    <div style={styles.contentPanel}>
                        {renderContent()}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const styles = {
    pageContainer: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#020617', fontFamily: "'Inter', sans-serif", color: '#f8fafc' },
    mainContainer: { flex: 1, maxWidth: '1280px', width: '95%', margin: '0 auto', padding: '30px 0' },
    layout: { display: 'flex', gap: '30px', alignItems: 'flex-start' },
    sidebarColumn: { width: '280px', flexShrink: 0 },
    sidebar: { backgroundColor: '#1e293b', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)', border: '1px solid #334155' },
    sidebarHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #334155' },
    avatar: { width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '700' },
    roleLabel: { fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc' },
    menuTitle: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: '700', marginBottom: '16px', paddingLeft: '8px' },
    navMenu: { display: 'flex', flexDirection: 'column', gap: '8px' },
    navItem: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '8px', color: '#94a3b8', background: 'none', border: 'none', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.2s' },
    activeNavItem: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '8px', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: 'none', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', width: '100%', textAlign: 'left' },
    navIcon: { marginRight: '12px', fontSize: '1.1rem' },
    contentPanel: { flex: 1, backgroundColor: '#1e293b', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)', minHeight: '600px', border: '1px solid #334155', color: '#f8fafc' },
};

export default AdminDashboard;
