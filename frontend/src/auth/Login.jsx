import React, { useState, useEffect } from 'react';
import './Login.css';
import api from '../api/api';

const Login = () => {
    const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // ... initial formData ...
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        rememberMe: false,
    });

    // Clear messages and reset form when switching modes
    useEffect(() => {
        setError(null);
        setMessage(null);
        setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'student',
            rememberMe: false,
        });
    }, [authMode]);

    const handleChange = (e) => {
        setError(null);
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            let response;
            if (authMode === 'login') {
                response = await api.post('/login', {
                    email: formData.email,
                    password: formData.password,
                });
            } else if (authMode === 'register') {
                response = await api.post('/register', {
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword,
                    position: formData.role, // Sử dụng role cho position
                });
            } else {
                // Logic cho Quên mật khẩu
                setMessage('Yêu cầu đã được gửi! Vui lòng kiểm tra email.');
                setLoading(false);
                return;
            }

            if (response.data.status === 'success') {
                const { access_token, user } = response.data.data;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('user', JSON.stringify(user));
                setMessage(response.data.message);

                // Demo: Sau 2s chuyển hướng (nếu cần)
                console.log('User logged in:', user);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
            if (err.response?.data?.errors) {
                // Hiển thị lỗi validation chi tiết nếu cần
                console.error('Validation errors:', err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left Side: Branding */}
            <div className="branding-section">
                <div className="bg-blobs">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>
                <div className="branding-content">
                    <h1>AcaSparkX</h1>
                    <p>Học lập trình trực tuyến cùng chuyên gia. Khám phá kho kiến thức khổng lồ và bắt đầu sự nghiệp của bạn ngay hôm nay.</p>
                </div>
            </div>

            {/* Right Side: Form Section */}
            <div className="form-section">
                <div className="login-card">
                    <div className={`auth-card-inner mode-${authMode}`}>
                        {/* 1. Login Form */}
                        <div className="auth-form login-form">
                            <div className="login-header">
                                <h2>Chào mừng trở lại!</h2>
                                <p>Vui lòng đăng nhập vào tài khoản của bạn.</p>
                            </div>

                            {error && <div className="auth-error">{error}</div>}
                            {message && <div className="auth-message">{message}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="login-email">Email hoặc Tên đăng nhập</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            id="login-email"
                                            name="email"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required={authMode === 'login'}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="login-password">Mật khẩu</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="password"
                                            id="login-password"
                                            name="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required={authMode === 'login'}
                                        />
                                    </div>
                                </div>

                                <div className="form-options">
                                    <label className="remember-me">
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                        />
                                        Ghi nhớ đăng nhập
                                    </label>
                                    <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setAuthMode('forgot'); }}>
                                        Quên mật khẩu?
                                    </a>
                                </div>

                                <button type="submit" className="login-btn" disabled={loading}>
                                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                                </button>
                            </form>

                            <div className="signup-link">
                                Chưa có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('register'); }}>Đăng ký ngay</a>
                            </div>
                        </div>

                        {/* 2. Register Form */}
                        <div className="auth-form register-form">
                            <div className="login-header">
                                <h2>Tham gia ngay!</h2>
                                <p>Bắt đầu hành trình học tập của bạn tại AcaSparkX.</p>
                            </div>

                            {error && <div className="auth-error">{error}</div>}
                            {message && <div className="auth-message">{message}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="role-selector">
                                    <button
                                        type="button"
                                        className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, role: 'student' })}
                                    >
                                        <span className="role-icon">👨‍🎓</span>
                                        Học sinh
                                    </button>
                                    <button
                                        type="button"
                                        className={`role-btn ${formData.role === 'teacher' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, role: 'teacher' })}
                                    >
                                        <span className="role-icon">👨‍🏫</span>
                                        Giáo viên
                                    </button>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reg-fullname">Họ và tên</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            id="reg-fullname"
                                            name="fullName"
                                            placeholder="Nguyễn Văn A"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required={authMode === 'register'}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reg-email">Email</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="email"
                                            id="reg-email"
                                            name="email"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required={authMode === 'register'}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reg-password">Mật khẩu</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="password"
                                            id="reg-password"
                                            name="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required={authMode === 'register'}
                                        />
                                        <small className="input-hint">Tối thiểu 8 ký tự</small>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reg-confirm">Xác nhận mật khẩu</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="password"
                                            id="reg-confirm"
                                            name="confirmPassword"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required={authMode === 'register'}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="login-btn" disabled={loading}>
                                    {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                                </button>
                            </form>

                            <div className="signup-link">
                                Đã có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('login'); }}>Đăng nhập ngay</a>
                            </div>
                        </div>

                        {/* 3. Forgot Password Form */}
                        <div className="auth-form forgot-form">
                            <div className="login-header">
                                <h2>Quên mật khẩu?</h2>
                                <p>Đừng lo lắng! Chỉ cần nhập email của bạn và chúng tôi sẽ gửi mã khôi phục.</p>
                            </div>

                            {error && <div className="auth-error">{error}</div>}
                            {message && <div className="auth-message">{message}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="forgot-email">Địa chỉ Email</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="email"
                                            id="forgot-email"
                                            name="email"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required={authMode === 'forgot'}
                                        />
                                    </div>
                                </div>

                                <div style={{ height: '2rem' }}></div>

                                <button type="submit" className="login-btn" disabled={loading}>
                                    {loading ? 'Đang gửi...' : 'Gửi mã khôi phục'}
                                </button>
                            </form>

                            <div className="signup-link">
                                Nhớ mật khẩu? <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('login'); }}>Quay lại đăng nhập</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
