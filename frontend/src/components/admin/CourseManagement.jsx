import React, { useState } from 'react';
import { FaBook, FaList, FaTags, FaClipboardCheck } from 'react-icons/fa';
import CourseList from './course/CourseList';
import CategoryManager from './course/CategoryManager';
import TagManager from './course/TagManager';
import CourseRequests from './course/CourseRequests';

const CourseManagement = () => {
    const [activeTab, setActiveTab] = useState('courses'); // courses, moderation, requests, categories, tags

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>Quản lý Khóa học</h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Kiểm duyệt khóa học, quản lý danh mục và học liệu.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', overflowX: 'auto' }}>
                <TabButton
                    active={activeTab === 'courses'}
                    onClick={() => setActiveTab('courses')}
                    icon={<FaBook />}
                    label="Danh sách Khóa học"
                />
                <TabButton
                    active={activeTab === 'moderation'}
                    onClick={() => setActiveTab('moderation')}
                    icon={<FaClipboardCheck />}
                    label="Kiểm duyệt (Pending)"
                />
                <TabButton
                    active={activeTab === 'requests'}
                    onClick={() => setActiveTab('requests')}
                    icon={<FaClipboardCheck />} // Reuse icon or find better one like FaEnvelopeOpenText
                    label="Yêu cầu dạy"
                />
                <TabButton
                    active={activeTab === 'categories'}
                    onClick={() => setActiveTab('categories')}
                    icon={<FaList />}
                    label="Danh mục"
                />
                <TabButton
                    active={activeTab === 'tags'}
                    onClick={() => setActiveTab('tags')}
                    icon={<FaTags />}
                    label="Thẻ (Tags)"
                />
            </div>

            {/* Content */}
            <div>
                {activeTab === 'courses' && <CourseList type="all" />}
                {activeTab === 'moderation' && <CourseList type="pending" />}
                {activeTab === 'requests' && <CourseRequests />}
                {activeTab === 'categories' && <CategoryManager />}
                {activeTab === 'tags' && <TagManager />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: active ? '#eff6ff' : 'transparent',
            color: active ? '#2563eb' : '#64748b',
            fontWeight: active ? '600' : '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
        }}
    >
        {icon}
        {label}
    </button>
);

export default CourseManagement;
