import React from 'react';
import { useUser } from '../../../context/UserContext';
import './general.css';

const ProfileInfo = () => {
    const { user } = useUser();

    if (!user) return <div>Đang tải...</div>;

    return (
        <div className="profile-info-card">
            <div className="info-header">
                <h4>Thông tin cá nhân</h4>
                {/* <button className="edit-btn">Chỉnh sửa</button> */}
            </div>

            <div className="info-grid">
                <div className="info-item">
                    <span className="label">Họ và tên</span>
                    <span className="value">{user.name}</span>
                </div>

                <div className="info-item">
                    <span className="label">Email</span>
                    <span className="value">{user.email}</span>
                </div>

                <div className="info-item">
                    <span className="label">Số điện thoại</span>
                    <span className="value">{user.phone_number || 'Chưa cập nhật'}</span>
                </div>

                <div className="info-item">
                    <span className="label">Vai trò</span>
                    <span className="value role-badge">{user.role.toUpperCase()}</span>
                </div>

                <div className="info-item">
                    <span className="label">Ngày tham gia</span>
                    <span className="value">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
