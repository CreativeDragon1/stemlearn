import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentsPage from './pages/teacher/StudentsPage';
import StudentDetailPage from './pages/teacher/StudentDetailPage';
import ModulesPage from './pages/teacher/ModulesPage';
import AssessmentsPage from './pages/teacher/AssessmentsPage';
import AnalyticsPage from './pages/teacher/AnalyticsPage';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentModulesPage from './pages/student/StudentModulesPage';
import ModuleViewPage from './pages/student/ModuleViewPage';
import StudentProgressPage from './pages/student/StudentProgressPage';
import AchievementsPage from './pages/student/AchievementsPage';

import './styles/globals.css';

const AppContent = () => {
  const { userRole } = useApp();

  return (
    <div className="app-layout">
      <Sidebar />
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Teacher Routes */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/students" element={<StudentsPage />} />
          <Route path="/teacher/students/:studentId" element={<StudentDetailPage />} />
          <Route path="/teacher/modules" element={<ModulesPage />} />
          <Route path="/teacher/modules/:moduleId" element={<ModulesPage />} />
          <Route path="/teacher/assessments" element={<AssessmentsPage />} />
          <Route path="/teacher/analytics" element={<AnalyticsPage />} />

          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/modules" element={<StudentModulesPage />} />
          <Route path="/student/modules/:moduleId" element={<ModuleViewPage />} />
          <Route path="/student/progress" element={<StudentProgressPage />} />
          <Route path="/student/achievements" element={<AchievementsPage />} />

          {/* Default redirect */}
          <Route
            path="/"
            element={<Navigate to={userRole === 'teacher' ? '/teacher' : '/student'} replace />}
          />
          <Route
            path="*"
            element={<Navigate to={userRole === 'teacher' ? '/teacher' : '/student'} replace />}
          />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
