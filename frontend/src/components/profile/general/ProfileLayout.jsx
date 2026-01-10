import React from 'react';
import ProfileSidebar from './ProfileSidebar';
import Header from '../../Header';
import Footer from '../../Footer';
import './general.css';

const ProfileLayout = ({ children }) => {
    return (
        <div className="profile-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Header />
            <div className="profile-layout" style={{ flex: 1, display: 'flex', width: '95%', maxWidth: '1280px', margin: '30px auto', gap: '30px' }}>
                <ProfileSidebar />
                <main className="profile-content" style={{ flex: 1 }}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default ProfileLayout;
