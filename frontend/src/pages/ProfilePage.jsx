import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileLayout from '../components/profile/general/ProfileLayout';
import ProfileInfo from '../components/profile/general/ProfileInfo'; // Assuming this is the content we want
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
    // We might want to check for auth here too, or rely on App.jsx wrapper
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0f172a' }}>
            <Header />
            <div style={{ flex: 1, paddingTop: '2rem' }}>
                <ProfileLayout role={user.role || 'user'}>
                    <ProfileInfo user={user} />
                </ProfileLayout>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;
