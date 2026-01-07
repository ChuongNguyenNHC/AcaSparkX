import React from 'react';
import './general.css';

const ProfileSidebar = ({ role = 'user' }) => {
    return (
        <aside className="profile-sidebar">
            <div className="sidebar-header">
                <h3>AcaSparkX</h3>
                <p className="text-muted small">Welcome, {role}</p>
            </div>

            <ul className="sidebar-menu">
                <li className="sidebar-item">
                    <a href="#" className="sidebar-link active">
                        <span className="icon">👤</span>
                        Profile Info
                    </a>
                </li>
                <li className="sidebar-item">
                    <a href="#" className="sidebar-link">
                        <span className="icon">📅</span>
                        My Schedule
                    </a>
                </li>
                <li className="sidebar-item">
                    <a href="#" className="sidebar-link">
                        <span className="icon">🔔</span>
                        Notifications
                    </a>
                </li>
                <li className="sidebar-item">
                    <a href="#" className="sidebar-link">
                        <span className="icon">⚙️</span>
                        Settings
                    </a>
                </li>
            </ul>

            <div className="sidebar-footer">
                <button className="logout-btn">
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
