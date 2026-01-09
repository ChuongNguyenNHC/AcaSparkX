import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import Login from './auth/Login';
import CourseSelection from './course_pages/CourseSelection';
import CourseDetail from './course_pages/CourseDetail';
import CourseLearning from './lesson_pages/CourseLearning';
import Chatbot from './components/Chatbot';
import ProfileLayout from './components/profile/general/ProfileLayout';
import ProfileInfo from './components/profile/general/ProfileInfo';
import SettingsPage from './components/profile/general/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/courses" element={<CourseSelection />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/course/:courseId/learn/:lessonId?" element={<CourseLearning />} />
        {/* Profile & Settings Routes */}
        <Route path="/profile" element={
          <ProfileLayout>
            <ProfileInfo />
          </ProfileLayout>
        } />
        <Route path="/settings" element={
          <ProfileLayout>
            <SettingsPage />
          </ProfileLayout>
        } />
        {/* Chuyển hướng các route không hợp lệ đến login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;