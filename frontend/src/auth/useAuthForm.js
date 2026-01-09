import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useUser } from '../context/UserContext';

const useAuthForm = () => {
    const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState({
        login: false,
        register: false,
        confirm: false
    });
    const navigate = useNavigate();
    const { setUser } = useUser();

    // Dữ liệu ban đầu form
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
    });

    // Xóa form data khi chuyển đổi mode
    useEffect(() => {
        setError(null);
        setMessage(null);
        setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'student',
        });
        setShowPassword({ login: false, register: false, confirm: false });
    }, [authMode]);

    const handleChange = (e) => {
        setError(null);
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
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
                    // role defaults to 'student' in backend if omitted, or we can send it
                });
            } else {
                // Logic cho Quên mật khẩu
                setMessage('Yêu cầu đã được gửi! Vui lòng kiểm tra email.');
                setLoading(false);
                return;
            }

            if (response.data.status === 'success') {
                const { access_token, user } = response.data.data;
                console.log('Login Response User:', user);
                console.log('Login User Role:', user.role);

                setMessage(response.data.message);

                // If registration, just show success and stop
                if (authMode === 'register') {
                    setLoading(false);
                    return;
                }

                localStorage.setItem('access_token', access_token);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user); // Sync State!

                // Redirect to courses for ALL roles
                setTimeout(() => {
                    console.log('Redirecting to /courses');
                    navigate('/courses');
                }, 1000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
            if (err.response?.data?.errors) {
                console.error('Validation errors:', err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        authMode,
        setAuthMode,
        loading,
        error,
        message,
        showPassword,
        formData,
        handleChange,
        togglePasswordVisibility,
        handleSubmit
    };
};

export default useAuthForm;
