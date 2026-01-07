import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import CourseSelection from './course_pages/CourseSelection';
import CourseDetail from './course_pages/CourseDetail';
import CourseLearning from './lesson_pages/CourseLearning';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/courses" element={<CourseSelection />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/course/:courseId/learn/:lessonId?" element={<CourseLearning />} />
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;