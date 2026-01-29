import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/shared/StatsCard';
import StudentCard from '../../components/shared/StudentCard';
import ModuleCard from '../../components/shared/ModuleCard';
import { Plus, Users, BookOpen, Trophy, TrendingUp } from 'lucide-react';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const { students, modules, addDummyStudent, addDummyModule } = useApp();
  const navigate = useNavigate();

  const totalStudents = students.length;
  const totalModules = modules.length;
  const totalCompletions = students.reduce(
    (sum, s) => sum + (s.completedModules?.length || 0),
    0
  );
  const avgProgress = students.length > 0
    ? Math.round(
        students.reduce((sum, s) => {
          const moduleProgress = Object.values(s.progress || {});
          return sum + (moduleProgress.length > 0
            ? moduleProgress.reduce((a, b) => a + b, 0) / moduleProgress.length
            : 0);
        }, 0) / students.length
      )
    : 0;

  const recentStudents = [...students]
    .sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))
    .slice(0, 4);

  const popularModules = [...modules].slice(0, 3);

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Teacher Dashboard</h1>
          <p className="text-muted">Welcome back! Here's an overview of your classroom.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={addDummyStudent}>
            <Plus size={18} />
            Add Dummy Student
          </button>
          <button className="btn btn-primary" onClick={addDummyModule}>
            <Plus size={18} />
            Add Dummy Module
          </button>
        </div>
      </motion.div>

      <div className="stats-grid">
        <StatsCard
          icon={<Users size={24} />}
          label="Total Students"
          value={totalStudents}
          color="#6366f1"
          delay={0}
        />
        <StatsCard
          icon={<BookOpen size={24} />}
          label="Active Modules"
          value={totalModules}
          color="#10b981"
          delay={0.1}
        />
        <StatsCard
          icon={<Trophy size={24} />}
          label="Completions"
          value={totalCompletions}
          color="#f59e0b"
          delay={0.2}
        />
        <StatsCard
          icon={<TrendingUp size={24} />}
          label="Avg Progress"
          value={`${avgProgress}%`}
          color="#ec4899"
          delay={0.3}
        />
      </div>

      <div className="dashboard-grid">
        <motion.section
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-header">
            <h2>Recent Students</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/teacher/students')}
            >
              View All
            </button>
          </div>
          <div className="grid grid-2">
            {recentStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                modules={modules}
                onClick={() => navigate(`/teacher/students/${student.id}`)}
              />
            ))}
          </div>
        </motion.section>

        <motion.section
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="section-header">
            <h2>Module Overview</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/teacher/modules')}
            >
              View All
            </button>
          </div>
          <div className="module-list">
            {popularModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                showProgress={false}
                onClick={() => navigate(`/teacher/modules/${module.id}`)}
              />
            ))}
          </div>
        </motion.section>
      </div>

      <motion.section
        className="quick-actions-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button
            className="quick-action-btn"
            onClick={() => navigate('/teacher/students')}
          >
            <span className="action-icon">👥</span>
            <span>Manage Students</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => navigate('/teacher/modules')}
          >
            <span className="action-icon">📚</span>
            <span>Manage Modules</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => navigate('/teacher/assessments')}
          >
            <span className="action-icon">📝</span>
            <span>View Assessments</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => navigate('/teacher/analytics')}
          >
            <span className="action-icon">📊</span>
            <span>View Analytics</span>
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default TeacherDashboard;
