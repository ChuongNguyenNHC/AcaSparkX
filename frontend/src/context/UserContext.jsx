import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import api from '../api/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const isFetching = useRef(false);

    const fetchUser = async (force = false) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setUser(null);
            localStorage.removeItem('user');
            return;
        }

        if (isFetching.current && !force) return;

        try {
            isFetching.current = true;
            setLoading(true);
            const response = await api.get('/user');
            const freshUser = response.data;
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error) {
            console.error('Failed to fetch user:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                setUser(null);
            }
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
