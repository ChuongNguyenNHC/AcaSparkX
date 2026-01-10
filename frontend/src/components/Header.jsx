import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown, FaSearch } from 'react-icons/fa';
import { courseAPI } from '../api/api';
import './Header.css';

const Header = () => {
    const [activeDropdown, setActiveDropdown] = useState(null); // 'user', 'categories', 'tags'
    const [dropdownCurrentPos, setDropdownCurrentPos] = useState({ top: 0, left: 0 });
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Search State
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
    }, [searchParams]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);

        // Debounce or immediate? Let's do immediate for now or simpler logic
        // But to avoid navigating on every keystroke causing re-render issues if strict mode is on, 
        // usually we might debounce. For now let's just update state and navigate.
        const newParams = new URLSearchParams(searchParams);
        if (val) {
            newParams.set('search', val);
        } else {
            newParams.delete('search');
        }

        // Only navigate if we are on the courses page to filter instantly, 
        // OR if correct UX is to wait for Enter.
        // User asked for "search function", usually real-time filtering is nice.
        // If we are NOT on /courses, we probably should wait for Enter or just direct input?
        // Let's assume we redirect to /courses immediately if typing? 
        // Or keep it simple: Navigate to /courses with query.

        navigate(`/courses?${newParams.toString()}`, { replace: true });
    };

    // Data
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
                setCategories(catsRes.data.data || []);
                setTags(tagsRes.data.data || []);
            } catch (error) {
                console.error("Failed to fetch header data", error);
            }
        };
        fetchData();
    }, []);

    // Toggle logic
    const toggleDropdown = (e, type) => {
        e.stopPropagation();
        e.preventDefault();

        if (activeDropdown === type) {
            setActiveDropdown(null);
            return;
        }

        const btnRef = type === 'user' ? userBtnRef : (type === 'categories' ? catBtnRef : tagBtnRef);

        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            // Adjust position based on type
            let leftPos = rect.left;
            if (type === 'user') leftPos = rect.right - 220;

            setDropdownCurrentPos({
                top: rect.bottom + 10,
                left: leftPos
            });
        }
        setActiveDropdown(type);
    };

    // Close logic
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && dropdownRef.current.contains(event.target)) return;
            // Check if clicked exactly on one of the toggle buttons
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

<<<<<<< Updated upstream
    // Hiển thị menu
    const dropdownContent = (
        <div
            className="dropdown-menu-portal"
            ref={dropdownRef}
            style={{
                top: `${dropdownCurrentPos.top}px`,
                left: `${dropdownCurrentPos.left}px`,
                position: 'fixed',
                width: '220px',
                zIndex: 99999
            }}
        >
            <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
                <FaUser /> <span>Hồ sơ cá nhân</span>
            </Link>
            <Link to="/settings" className="dropdown-item" onClick={() => setIsOpen(false)}>
                <FaCog /> <span>Cài đặt</span>
            </Link>
            <div className="dropdown-divider"></div>
            <button onClick={handleLogout} className="dropdown-item text-danger">
                <FaSignOutAlt /> <span>Đăng xuất</span>
            </button>
        </div>
    );
=======
    const handleFilterClick = (type, id) => {
        setActiveDropdown(null);
        navigate(`/courses?${type}=${id}`);
    };

    const renderDropdownContent = () => {
        if (!activeDropdown) return null;

        let content = null;
        let width = '220px';

        if (activeDropdown === 'user') {
            content = (
                <>
                    <Link to="/profile" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                        <FaUser /> <span>Hồ sơ cá nhân</span>
                    </Link>
                    <Link to="/settings" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                        <FaCog /> <span>Cài đặt</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item text-danger">
                        <FaSignOutAlt /> <span>Đăng xuất</span>
                    </button>
                </>
            );
        } else if (activeDropdown === 'categories') {
            content = categories.length > 0 ? categories.map(c => (
                <button key={c.id} className="dropdown-item" onClick={() => handleFilterClick('category', c.id)}>
                    <span>{c.name}</span>
                </button>
            )) : <div style={{ padding: '10px', color: '#cbd5e1' }}>Không có danh mục</div>;
        } else if (activeDropdown === 'tags') {
            content = tags.length > 0 ? tags.map(t => (
                <button key={t.id} className="dropdown-item" onClick={() => handleFilterClick('tag', t.id)}>
                    <span>#{t.name}</span>
                </button>
            )) : <div style={{ padding: '10px', color: '#cbd5e1' }}>Không có tags</div>;
        }

        return (
            <div
                className="dropdown-menu-portal"
                ref={dropdownRef}
                style={{
                    top: `${dropdownCurrentPos.top}px`,
                    left: `${dropdownCurrentPos.left}px`,
                    position: 'fixed',
                    width: width,
                    zIndex: 99999,
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}
            >
                {content}
            </div>
        );
    };
>>>>>>> Stashed changes

    return (
        <header className="app-header">
            {/* Left Side: Logo + Navigation */}
            <div className="header-left">
                <Link to="/courses" style={{ textDecoration: 'none', marginRight: '30px' }}>
                    <h1 className="logo-text">AcaSparkX</h1>
                </Link>

                <nav className="main-nav">
                    <Link to="/courses" className="nav-link">Khóa học</Link>

                    {/* Categories */}
                    <button
                        ref={catBtnRef}
                        onClick={(e) => toggleDropdown(e, 'categories')}
                        className={`nav-link dropdown-trigger ${activeDropdown === 'categories' ? 'active' : ''}`}
                    >
                        Thể loại <FaChevronDown size={12} />
                    </button>

                    {/* Tags */}
                    <button
                        ref={tagBtnRef}
                        onClick={(e) => toggleDropdown(e, 'tags')}
                        className={`nav-link dropdown-trigger ${activeDropdown === 'tags' ? 'active' : ''}`}
                    >
                        Tags <FaChevronDown size={12} />
                    </button>
                </nav>
            </div>

<<<<<<< Updated upstream
            <nav className="nav-menu">
                {(user?.role === 'admin' || user?.role === 'teacher') && (
                    <Link
                        to={user.role === 'admin' ? "/admin/dashboard" : "/teacher/dashboard"}
                        className="nav-link management-link"
                    >
                        Quản lý
                    </Link>
                )}
                <Link to="/courses" className="nav-link">Khóa học</Link>
=======
            {/* Right Side: Search, Manage & User */}
            <div className="header-right">
                {/* Search Bar */}
                <div className="search-container" style={{ position: 'relative', marginRight: '15px' }}>
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

>>>>>>> Stashed changes
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
            {activeDropdown && createPortal(renderDropdownContent(), document.body)}
        </header>
    );
};

export default Header;
