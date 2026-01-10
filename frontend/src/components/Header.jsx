import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown, FaSearch } from 'react-icons/fa';
import { courseAPI } from '../api/api';
import './Header.css';

const Header = () => {
    const [activeDropdown, setActiveDropdown] = useState(null); 
    const [dropdownCurrentPos, setDropdownCurrentPos] = useState({ top: 0, left: 0 });
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Search State
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    // Khai báo biến commonStyle bị thiếu để sửa lỗi ReferenceError
    const commonStyle = {
        position: 'fixed',
        top: `${dropdownCurrentPos.top}px`,
        left: `${dropdownCurrentPos.left}px`,
        backgroundColor: '#1e293b', // Màu nền dark để khớp với giao diện
        minWidth: '200px',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        padding: '8px 0',
        border: '1px solid #334155'
    };

    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
    }, [searchParams]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        const newParams = new URLSearchParams(searchParams);
        if (val) {
            newParams.set('search', val);
        } else {
            newParams.delete('search');
        }
        navigate(`/courses?${newParams.toString()}`, { replace: true });
    };

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const userBtnRef = useRef(null);
    const catBtnRef = useRef(null);
    const tagBtnRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, tagsRes] = await Promise.all([
                    courseAPI.getPublicCategories(),
                    courseAPI.getPublicTags()
                ]);
                // Đảm bảo lấy đúng mảng dữ liệu từ API Laravel
                setCategories(catsRes.data.data || catsRes.data || []);
                setTags(tagsRes.data.data || tagsRes.data || []);
            } catch (error) {
                console.error("Failed to fetch header data", error);
            }
        };
        fetchData();
    }, []);

    const toggleDropdown = (e, type) => {
        e.stopPropagation();
        if (activeDropdown === type) {
            setActiveDropdown(null);
            return;
        }

        const btnRef = type === 'user' ? userBtnRef : (type === 'categories' ? catBtnRef : tagBtnRef);

        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            let leftPos = rect.left;
            // Căn lề phải cho menu người dùng
            if (type === 'user') leftPos = rect.right - 220;

            setDropdownCurrentPos({
                top: rect.bottom + 10,
                left: leftPos
            });
        }
        setActiveDropdown(type);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && dropdownRef.current.contains(event.target)) return;
            if (userBtnRef.current?.contains(event.target) ||
                catBtnRef.current?.contains(event.target) ||
                tagBtnRef.current?.contains(event.target)) {
                return;
            }
            setActiveDropdown(null);
        };

        const handleScroll = () => {
            if (activeDropdown) setActiveDropdown(null);
        };

        if (activeDropdown) {
            document.addEventListener('click', handleClickOutside);
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [activeDropdown]);

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        setActiveDropdown(null);
        navigate('/');
    };

    const renderDropdownContent = () => {
        if (!activeDropdown) return null;

        if (activeDropdown === 'user') {
            return (
                <div className="dropdown-menu-portal" ref={dropdownRef} style={commonStyle}>
                    <Link to="/profile" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                        <FaUser className="item-icon" /> <span>Hồ sơ cá nhân</span>
                    </Link>
                    <Link to="/settings" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                        <FaCog className="item-icon" /> <span>Cài đặt</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item text-danger">
                        <FaSignOutAlt className="item-icon" /> <span>Đăng xuất</span>
                    </button>
                </div>
            );
        }

        if (activeDropdown === 'categories') {
            return (
                <div className="dropdown-menu-portal" ref={dropdownRef} style={commonStyle}>
                    {categories.length > 0 ? categories.map(cat => (
                        <Link key={cat.id} to={`/courses?category=${cat.id}`} className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                            {cat.name}
                        </Link>
                    )) : <div className="dropdown-empty">Không có thể loại</div>}
                </div>
            );
        }

        if (activeDropdown === 'tags') {
            return (
                <div className="dropdown-menu-portal" ref={dropdownRef} style={commonStyle}>
                    {tags.length > 0 ? tags.map(tag => (
                        <Link key={tag.id} to={`/courses?tag=${tag.id}`} className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                            {tag.name}
                        </Link>
                    )) : <div className="dropdown-empty">Không có tags</div>}
                </div>
            );
        }
        return null;
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <Link to="/courses" style={{ textDecoration: 'none', marginRight: '30px' }}>
                    <h1 className="logo-text">AcaSparkX</h1>
                </Link>

                <nav className="main-nav">
                    <Link to="/courses" className="nav-link">Khóa học</Link>
                    <button
                        ref={catBtnRef}
                        onClick={(e) => toggleDropdown(e, 'categories')}
                        className={`nav-link dropdown-trigger ${activeDropdown === 'categories' ? 'active' : ''}`}
                    >
                        Thể loại <FaChevronDown size={12} />
                    </button>

                    <button
                        ref={tagBtnRef}
                        onClick={(e) => toggleDropdown(e, 'tags')}
                        className={`nav-link dropdown-trigger ${activeDropdown === 'tags' ? 'active' : ''}`}
                    >
                        Tags <FaChevronDown size={12} />
                    </button>
                </nav>
            </div>

            <div className="header-right">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="header-search-input"
                    />
                    <FaSearch className="search-icon" />
                </div>

                {(user?.role === 'admin' || user?.role === 'teacher') && (
                    <Link
                        to={user.role === 'admin' ? "/admin/dashboard" : "/teacher/dashboard"}
                        className="nav-link management-link"
                    >
                        Quản lý
                    </Link>
                )}

                <div className="nav-divider"></div>

                <div className="user-menu-container">
                    {user ? (
                        <button
                            className="user-toggle-btn"
                            onClick={(e) => toggleDropdown(e, 'user')}
                            ref={userBtnRef}
                            type="button"
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`}
                                alt={user.name}
                                className="user-avatar"
                            />
                            <span className="user-name">{user.name}</span>
                            <FaChevronDown className={`toggle-icon ${activeDropdown === 'user' ? 'rotate' : ''}`} />
                        </button>
                    ) : (
                        <Link to="/" className="nav-link">Đăng nhập</Link>
                    )}
                </div>
            </div>
            {/* Sử dụng React Portal để đưa dropdown ra ngoài cùng của DOM body */}
            {activeDropdown && createPortal(renderDropdownContent(), document.body)}
        </header>
    );
};

export default Header;