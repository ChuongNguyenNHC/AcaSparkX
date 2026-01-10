import React from 'react';
import { useUser } from '../../../context/UserContext';
import userService from '../../../services/userService';
import './general.css';

const ProfileInfo = () => {
    const { user } = useUser();
    const [showCvModal, setShowCvModal] = React.useState(false);
    const [cvImage, setCvImage] = React.useState(null);
    const [previewImg, setPreviewImg] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    if (!user) return <div>Đang tải...</div>;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCvImage(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handleCvSubmit = async (e) => {
        e.preventDefault();
        if (!cvImage) return alert('Vui lòng chọn ảnh CV/Thẻ giáo viên.');

        setLoading(true);
        const data = new FormData();
        data.append('cv_image', cvImage);

        try {
            await userService.uploadCvRequest(data);
            alert('Gửi yêu cầu thành công! Admin sẽ xem xét sớm.');
            setShowCvModal(false);
            // Optionally refresh user or show pending status local state
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="value role-badge">{user.role.toUpperCase()}</span>
                        {user.role === 'student' && user.status !== 'pending_teacher' && (
                            <button
                                onClick={() => setShowCvModal(true)}
                                style={{
                                    fontSize: '0.8rem',
                                    padding: '4px 8px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Yêu cầu lên Giảng viên
                            </button>
                        )}
                        {user.status === 'pending_teacher' && (
                            <span style={{ fontSize: '0.8rem', color: '#b45309', fontStyle: 'italic' }}>(Đang chờ duyệt GV)</span>
                        )}
                    </div>
                </div>

                <div className="info-item">
                    <span className="label">Ngày tham gia</span>
                    <span className="value">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            {/* CV Modal */}
            {showCvModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
                        <h4 style={{ color: '#1e293b', marginBottom: '15px' }}>Nộp hồ sơ Giảng viên</h4>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                            Vui lòng tải lên ảnh chụp CV hoặc Thẻ giáo viên/Chứng chỉ của bạn để Admin xét duyệt.
                        </p>

                        <form onSubmit={handleCvSubmit}>
                            <div style={{ marginBottom: '20px', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                                <input id="cv-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                <label htmlFor="cv-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                    {previewImg ? (
                                        <img src={previewImg} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
                                    ) : (
                                        <div style={{ color: '#64748b' }}>Click để chọn ảnh</div>
                                    )}
                                </label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowCvModal(false)} style={{ padding: '8px 15px', border: 'none', borderRadius: '6px', backgroundColor: '#f1f5f9', cursor: 'pointer' }}>Hủy</button>
                                <button type="submit" disabled={loading} style={{ padding: '8px 15px', border: 'none', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', cursor: 'pointer' }}>
                                    {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileInfo;
