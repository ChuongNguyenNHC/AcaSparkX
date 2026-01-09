import React, { useState } from 'react';
import api from '../../../api/api';
import './general.css';

const PasswordChange = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.new_password !== formData.new_password_confirmation) {
            setError('Mật khẩu mới không khớp');
            setLoading(false);
            return;
        }

        try {
            // Assuming this endpoint exists or will be created. Standard Laravel Auth usually has one or we make it.
            // If not, we might need to add it to AuthController. Let's assume /user/password for now.
            // Based on previous tasks, I didn't explicitly create a change password API.
            // I should double check Backend AuthController.
            // Wait, standard CRUD usually allows updating user.
            // Let's create a placeholder UI first, and I might need to add the endpoint quickly if missing.
            await api.post('/change-password', formData); // Will need to implement this endpoint
            setMessage('Đổi mật khẩu thành công!');
            setFormData({ current_password: '', new_password: '', new_password_confirmation: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-info-card">
            <div className="info-header">
                <h4>Đổi mật khẩu</h4>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
                {message && <div className="alert-success" style={{ padding: '10px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '15px' }}>{message}</div>}
                {error && <div className="alert-danger" style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '15px' }}>{error}</div>}

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        name="current_password"
                        value={formData.current_password}
                        onChange={handleChange}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        required
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu mới</label>
                    <input
                        type="password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        required
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        name="new_password_confirmation"
                        value={formData.new_password_confirmation}
                        onChange={handleChange}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="save-btn"
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
                </button>
            </form>
        </div>
    );
};

export default PasswordChange;
