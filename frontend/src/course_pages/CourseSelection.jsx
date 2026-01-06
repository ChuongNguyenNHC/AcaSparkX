import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './CourseSelection.css';

const courses = [
  {
    id: 1,
    title: 'Lập trình C#',
    description: 'Thành thạo C# và .NET framework để xây dựng các ứng dụng Windows và Web mạnh mẽ.',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Python cho người mới bắt đầu',
    description: 'Học Python từ con số 0. Tuyệt vời cho khoa học dữ liệu, phát triển web và tự động hóa.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'C++ Cơ bản',
    description: 'Đi sâu vào C++ để hiểu quản lý bộ nhớ và tính toán hiệu năng cao.',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  }
];

const CourseSelection = () => {
  return (
    <div className="course-page-container">
      <Header />
      <main className="course-main">
        <h2 className="page-title">Các khóa học hiện có</h2>
        <div className="course-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image-wrapper">
                <img src={course.image} alt={course.title} className="course-image" />
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <button className="enroll-btn">Xem chi tiết</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseSelection;
