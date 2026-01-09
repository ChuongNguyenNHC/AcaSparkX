import React from 'react';
import { FaEye, FaStar } from 'react-icons/fa';

const TeacherStats = () => {
    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>Thống kê</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>Tổng quan về hiệu quả các khóa học của bạn</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={cardStyle}>
                    <div style={{ ...iconBoxStyle, backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
                        <FaEye size={24} />
                    </div>
                    <div>
                        <h3 style={statValueStyle}>0</h3>
                        <p style={statLabelStyle}>Tổng lượt xem</p>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ ...iconBoxStyle, backgroundColor: '#fef3c7', color: '#d97706' }}>
                        <FaStar size={24} />
                    </div>
                    <div>
                        <h3 style={statValueStyle}>0.0</h3>
                        <p style={statLabelStyle}>Đánh giá trung bình</p>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                <p>Biểu đồ chi tiết đang được cập nhật...</p>
            </div>
        </div>
    );
};

const cardStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const iconBoxStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const statValueStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
};

const statLabelStyle = {
    color: '#64748b',
    margin: '5px 0 0 0',
    fontSize: '0.9rem'
};

export default TeacherStats;
