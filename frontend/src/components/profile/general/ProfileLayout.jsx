import React from 'react';
import ProfileSidebar from './ProfileSidebar';
import Header from '../../Header';
import Footer from '../../Footer';
import './general.css';

const ProfileLayout = ({ children }) => {
    return (
<<<<<<< Updated upstream
        <div className="profile-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Header />
            <div className="profile-layout" style={{ flex: 1, display: 'flex', width: '95%', maxWidth: '1280px', margin: '30px auto', gap: '30px' }}>
=======
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
        <div className="profile-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Header />
            <div className="profile-layout" style={{ flex: 1, display: 'flex', width: '95%', maxWidth: '1280px', margin: '30px auto', gap: '30px' }}>
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
        <div className="profile-layout">
            {/* Sidebar moved to Left */}
            <ProfileSidebar role={role} />

            <main className="profile-content">
                {children || (
                    <div className="placeholder-content">
                        <h2>Profile Dashboard</h2>
                        <p>Welcome to your profile. Select an option from the sidebar to manage your account.</p>
                        {/* Contextual content for the role will go here */}
                    </div>
                )}
            </main>
<<<<<<< Updated upstream
=======
=======
        <div className="profile-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc' }}>
            <Header />
            <div className="profile-layout" style={{ flex: 1, display: 'flex', width: '95%', maxWidth: '1280px', margin: '30px auto', gap: '30px', backgroundColor: 'transparent' }}>
>>>>>>> Stashed changes
>>>>>>> Stashed changes
                <ProfileSidebar />
                <main className="profile-content" style={{ flex: 1 }}>
                    {children}
                </main>
            </div>
            <Footer />
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
        </div>
    );
};

export default ProfileLayout;
