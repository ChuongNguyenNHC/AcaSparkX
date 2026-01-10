import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { courseAPI } from '../api/api';
import './CourseSelection.css';

const CourseSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {};
        const catId = searchParams.get('category');
        const tagId = searchParams.get('tag');
        const search = searchParams.get('search');

        if (catId) params.category_id = catId;
        if (tagId) params.tag_id = tagId;
        if (search) params.search = search;

        console.log("Fetching courses with params:", params);
        const response = await courseAPI.getAll(params);
        console.log("Courses response:", response.data);
        setCourses(response.data.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Không thể tải danh sách khóa học. Vui lòng kiểm tra kết nối server.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [searchParams]);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="course-page-container">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải danh sách khóa học...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-page-container">
        <Header />
        <div className="error-container" style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: '#ff4d4d', fontSize: '1.2rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}
          >
            Thử lại
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="course-page-container">
        <Header />
        <div className="empty-container" style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: '#888' }}>Không có khóa học nào được tìm thấy. Bạn đã chạy Seeder chưa?</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>Làm mới</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="course-page-container">
      <Header />
      <main className="course-main">
        <h2 className="page-title" style={{ marginBottom: '30px' }}>Các khóa học hiện có</h2>

        {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <p>Không tìm thấy khóa học nào phù hợp.</p>
            <button
              onClick={() => navigate('/courses')}
              style={{ marginTop: '10px', padding: '8px 16px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="course-grid">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-image-wrapper" style={{ '--bg-url': `url(${course.thumbnail && course.thumbnail.startsWith('http') ? course.thumbnail : `http://localhost:8000/storage/${course.thumbnail}`})` }}>
                  <img
                    src={course.thumbnail && course.thumbnail.startsWith('http') ? course.thumbnail : (course.thumbnail ? `http://localhost:8000/storage/${course.thumbnail}` : null)}
                    alt={course.title}
                    className="course-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                  />
                </div>
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <button
                    className="enroll-btn"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CourseSelection;
