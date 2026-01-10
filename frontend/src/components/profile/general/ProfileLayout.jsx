import React from 'react';
import ProfileSidebar from './ProfileSidebar';
import Header from '../../Header';
import Footer from '../../Footer';
import './general.css';

const ProfileLayout = ({ children }) => {
    return (
        <div className="profile-wrapper" style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#020617'
        }}>
            <Header />

            <div className="profile-layout" style={{
                flex: 1,
                display: 'flex',
                width: '95%',
                maxWidth: '1280px',
                margin: '30px auto',
                gap: '30px'
            }}>
                <ProfileSidebar />

                <main className="profile-content" style={{ flex: 1 }}>
                    {children || (
                        <div className="placeholder-content">
                            <h2>Profile Dashboard</h2>
                            <p>Welcome to your profile. Select an option from the sidebar to manage your account.</p>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default ProfileLayout;