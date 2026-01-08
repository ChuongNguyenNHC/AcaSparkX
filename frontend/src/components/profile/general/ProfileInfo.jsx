import React from 'react';
import './general.css';

const ProfileInfo = ({ user }) => {
    // Default placeholder data if no user prop is provided
    const userData = user || {
        name: 'Nguyen Van A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        cvStatus: 'Not Uploaded',
        role: 'Student',
        status: 'Active'
    };

    return (
        <div className="profile-info-card">
            <div className="info-header">
                <h4>Personal Information</h4>
                <button className="edit-btn">Edit</button>
            </div>

            <div className="info-grid">
                <div className="info-item">
                    <span className="label">Full Name</span>
                    <span className="value">{userData.name}</span>
                </div>

                <div className="info-item">
                    <span className="label">Email</span>
                    <span className="value">{userData.email}</span>
                </div>

                <div className="info-item">
                    <span className="label">Phone Number</span>
                    <span className="value">{userData.phone}</span>
                </div>

                <div className="info-item">
                    <span className="label">Role</span>
                    <span className="value role-badge">{userData.role}</span>
                </div>

                <div className="info-item">
                    <span className="label">Account Status</span>
                    <span className="value status-badge active">{userData.status}</span>
                </div>

                <div className="info-item">
                    <span className="label">CV Status</span>
                    <span className="value">{userData.cvStatus}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
