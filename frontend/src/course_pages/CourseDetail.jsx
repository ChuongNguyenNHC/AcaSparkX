import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { courseAPI } from '../api/api';
import './CourseDetail.css';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await courseAPI.getDetails(courseId);
                setData(response.data.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching course details:", err);
                setError("Không thể tải thông tin khóa học.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [courseId]);

    const handleStartLearning = () => {
        navigate(`/course/${courseId}/learn`);
    };

    if (loading) {
        return (
            <div className="course-detail-page loading">
                <Header />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Đang tải thông tin khóa học...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="course-detail-page error">
                <Header />
                <div className="error-state">
                    <p>{error || "Không tìm thấy khóa học."}</p>
                    <button onClick={() => navigate('/courses')}>Quay lại danh sách</button>
                </div>
                <Footer />
            </div>
        );
    }

    const { course, lessons } = data;

    return (
        <div className="course-detail-page">
            <Header />
            <div className="detail-container">
                <div className="course-hero">
                    <div className="hero-thumbnail-wrapper" style={{ '--bg-url': `url(${course.thumbnail})` }}>
                        <img src={course.thumbnail} alt={course.title} className="hero-thumbnail" />
                    </div>
                    <div className="hero-content">
                        <h1 className="hero-title">{course.title}</h1>
                        <p className="hero-desc">{course.description}</p>

                        <div className="hero-actions">
                            <div className="instructor-info">
                                <img src={course.instructor?.avatar || `https://ui-avatars.com/api/?name=${course.instructor?.name}&background=10b981&color=fff`} alt="Instructor" className="instructor-avatar" />
                                <div className="instructor-details">
                                    <p className="instructor-label">Giảng viên</p>
                                    <p className="instructor-name">{course.instructor?.name || 'Giảng viên'}</p>
                                </div>
                            </div>

                            <button className="start-learning-btn" onClick={handleStartLearning}>
                                Vào học ngay
                            </button>
                        </div>
                    </div>
                </div>

                <div className="syllabus-section">
                    <div className="syllabus-header">
                        <h2>Nội dung khóa học</h2>
                        <span className="syllabus-stats">{lessons.length} bài học</span>
                    </div>
                    <div className="lesson-list">
                        {lessons.map((lesson, index) => (
                            <div key={lesson.id} className="lesson-row">
                                <div className="syllabus-item-info">
                                    <span className="lesson-number">{index + 1}.</span>
                                    <span className="lesson-title">{lesson.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CourseDetail;
