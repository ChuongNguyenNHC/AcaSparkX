import React from 'react';
import ProfileSidebar from './ProfileSidebar';
import './general.css';

const ProfileLayout = ({ children, role }) => {
    return (
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
        </div>
    );
};

export default ProfileLayout;
