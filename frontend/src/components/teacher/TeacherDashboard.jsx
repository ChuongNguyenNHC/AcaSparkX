import React, { useState } from 'react';
import { FaChalkboardTeacher, FaBook, FaPlus, FaClipboardList, FaChartBar } from 'react-icons/fa';
import Header from '../Header';
import Footer from '../Footer';
import TeacherContentManager from './TeacherContentManager';
import TeacherCourseRequest from './TeacherCourseRequest';
import TeacherStats from './TeacherStats';

const TeacherDashboard = () => {
    // Basic Layout similar to Admin but specific for Teacher
    const [activeTab, setActiveTab] = useState('courses');

    return (
        <div style={styles.pageContainer}>
            <Header />
            <div style={styles.mainContainer}>
                <div style={styles.layout}>

                    {/* Teacher Sidebar */}
                    <div style={styles.sidebarColumn}>
                        <div style={styles.sidebar}>
                            <div style={styles.sidebarHeader}>
                                <div style={styles.avatar}>T</div>
                                <div>
                                    <div style={styles.roleLabel}>Giảng viên</div>
                                </div>
                            </div>

                            <h3 style={styles.menuTitle}>MENU GIẢNG VIÊN</h3>
                            <nav style={styles.navMenu}>
                                <button
                                    style={activeTab === 'courses' ? styles.activeNavItem : styles.navItem}
                                    onClick={() => setActiveTab('courses')}
                                >
                                    <FaBook style={styles.navIcon} /> Khóa học của tôi
                                </button>
                                <button
                                    style={activeTab === 'requests' ? styles.activeNavItem : styles.navItem}
                                    onClick={() => setActiveTab('requests')}
                                >
                                    <FaClipboardList style={styles.navIcon} /> Yêu cầu khóa học
                                </button>
                                <button
                                    style={activeTab === 'stats' ? styles.activeNavItem : styles.navItem}
                                    onClick={() => setActiveTab('stats')}
                                >
                                    <FaChartBar style={styles.navIcon} /> Thống kê
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content Panel */}
                    <div style={styles.contentPanel}>
                        {activeTab === 'courses' && <TeacherContentManager />}
                        {activeTab === 'requests' && <TeacherCourseRequest />}
                        {activeTab === 'stats' && <TeacherStats />}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const styles = {
    pageContainer: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" },
    mainContainer: { flex: 1, maxWidth: '1280px', width: '95%', margin: '0 auto', padding: '30px 0' },
    layout: { display: 'flex', gap: '30px', alignItems: 'flex-start' },
    sidebarColumn: { width: '280px', flexShrink: 0 },
    sidebar: { backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    sidebarHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' },
    avatar: { width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '700' },
    roleLabel: { fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' },
    menuTitle: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: '700', marginBottom: '16px', paddingLeft: '8px' },
    navMenu: { display: 'flex', flexDirection: 'column', gap: '8px' },
    navItem: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '8px', color: '#64748b', background: 'none', border: 'none', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.2s' },
    activeNavItem: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '8px', color: '#8b5cf6', backgroundColor: '#f5f3ff', border: 'none', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', width: '100%', textAlign: 'left' },
    navIcon: { marginRight: '12px', fontSize: '1.1rem' },
    contentPanel: { flex: 1, backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minHeight: '600px' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '5px' },
    subtitle: { color: '#64748b', fontSize: '0.95rem', marginBottom: '30px' },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', border: '2px dashed #e2e8f0', borderRadius: '12px' }
};

export default TeacherDashboard;
