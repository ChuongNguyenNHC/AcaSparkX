import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import CourseSelection from './course_pages/CourseSelection';
import CourseDetail from './course_pages/CourseDetail';
import CourseLearning from './lesson_pages/CourseLearning';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/courses" element={<CourseSelection />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/course/:courseId/learn/:lessonId?" element={<CourseLearning />} />
        {/* Chuyển hướng các route không hợp lệ đến login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;