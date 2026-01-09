import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import './Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownCurrentPos, setDropdownCurrentPos] = useState({ top: 0, left: 0 });
    const { user, logout } = useUser();
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Tính toán vị trí và toggle
    const toggleDropdown = (e) => {
        e.stopPropagation();

        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownCurrentPos({
                top: rect.bottom + 10,
                left: rect.right - 220
            });
        }
        setIsOpen(!isOpen);
    };

    // Logic đóng
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                buttonRef.current &&
                buttonRef.current.contains(event.target)
            ) {
                return;
            }

            if (
                dropdownRef.current &&
                dropdownRef.current.contains(event.target)
            ) {
                return;
            }

            setIsOpen(false);
        };

        const handleScroll = () => {
            if (isOpen) setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isOpen]);

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        setIsOpen(false);
        navigate('/');
    };

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

    return (
        <header className="app-header">
            <div className="logo-container">
                <Link to="/courses" style={{ textDecoration: 'none' }}>
                    <h1 className="logo-text">AcaSparkX</h1>
                </Link>
            </div>

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
                <div className="nav-divider"></div>

                <div className="user-menu-container">
                    {user ? (
                        <>
                            <button
                                className="user-toggle-btn"
                                onClick={toggleDropdown}
                                ref={buttonRef}
                                type="button"
                            >
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`}
                                    alt={user.name}
                                    className="user-avatar"
                                />
                                <span className="user-name">{user.name}</span>
                                <FaChevronDown className={`toggle-icon ${isOpen ? 'rotate' : ''}`} />
                            </button>
                            {isOpen && createPortal(dropdownContent, document.body)}
                        </>
                    ) : (
                        <Link to="/" className="nav-link">Đăng nhập</Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
