import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import './general.css';

const ProfileSidebar = () => {
    const { user, logout } = useUser();
    const location = useLocation();

    return (
        <aside className="profile-sidebar">
            <div className="sidebar-header">
                <h3>AcaSparkX</h3>
                <p className="text-muted small">Xin chào, {user?.name}</p>
            </div>

            <ul className="sidebar-menu">
                <li className="sidebar-item">
                    <Link
                        to="/profile"
                        className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}
                    >
                        <span className="icon">👤</span>
                        Thông tin tài khoản
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link
                        to="/settings"
                        className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`}
                    >
                        <span className="icon">⚙️</span>
                        Cài đặt
                    </Link>
                </li>
            </ul>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={logout}>
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
