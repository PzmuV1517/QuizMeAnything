import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboard from './pages/TeacherDashboard';
import ClassroomPage from './pages/ClassroomPage';
import StudentTestPage from './pages/StudentTestPage';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/teacher/dashboard" 
              element={
                <PrivateRoute>
                  <TeacherDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/teacher/classroom/:classroomId" 
              element={
                <PrivateRoute>
                  <ClassroomPage />
                </PrivateRoute>
              } 
            />
            <Route path="/test/:testId" element={<StudentTestPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
