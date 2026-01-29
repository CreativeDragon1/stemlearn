import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatsCard from '../../components/shared/StatsCard';
import ModuleCard from '../../components/shared/ModuleCard';
import { BookOpen, Trophy, Target, Flame } from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { currentStudent, modules } = useApp();
  const navigate = useNavigate();

  if (!currentStudent) {
    return <div className="page-container">Loading...</div>;
  }

  const assignedModules = modules.filter((m) =>
    currentStudent.assignedModules?.includes(m.id)
  );

  const inProgressModules = assignedModules.filter((m) => {
    const progress = currentStudent.progress?.[m.id] || 0;
    return progress > 0 && progress < 100 && currentStudent.unlockedModules?.includes(m.id);
  });

  const completedCount = currentStudent.completedModules?.length || 0;
  const totalAssigned = currentStudent.assignedModules?.length || 0;
  const avgProgress = totalAssigned > 0
    ? Math.round(
        Object.values(currentStudent.progress || {}).reduce((a, b) => a + b, 0) / totalAssigned
      )
    : 0;

  return (
    <div className="page-container">
      <motion.div
        className="welcome-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="welcome-content">
          <img
            src={currentStudent.avatar}
            alt={currentStudent.name}
            className="avatar avatar-xl"
          />
          <div>
            <h1>Welcome back, {currentStudent.name.split(' ')[0]}! 👋</h1>
            <p className="text-muted">
              {completedCount > 0
                ? `You've completed ${completedCount} module${completedCount > 1 ? 's' : ''}. Keep up the great work!`
                : "Let's start learning today!"}
            </p>
          </div>
        </div>
        <div className={`difficulty-badge ${currentStudent.difficultyLevel}`}>
          {currentStudent.difficultyLevel === 'beginner' && '🌱'}
          {currentStudent.difficultyLevel === 'intermediate' && '🌿'}
          {currentStudent.difficultyLevel === 'advanced' && '🌳'}
          {currentStudent.difficultyLevel} Level
        </div>
      </motion.div>

      <div className="stats-grid">
        <StatsCard
          icon={<BookOpen size={24} />}
          label="Modules Assigned"
          value={totalAssigned}
          color="#6366f1"
          delay={0}
        />
        <StatsCard
          icon={<Trophy size={24} />}
          label="Completed"
          value={completedCount}
          color="#10b981"
          delay={0.1}
        />
        <StatsCard
          icon={<Target size={24} />}
          label="Points Earned"
          value={currentStudent.points || 0}
          color="#f59e0b"
          delay={0.2}
        />
        <StatsCard
          icon={<Flame size={24} />}
          label="Avg Progress"
          value={`${avgProgress}%`}
          color="#ec4899"
          delay={0.3}
        />
      </div>

      {inProgressModules.length > 0 && (
        <motion.section
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-header">
            <h2>🔥 Continue Learning</h2>
          </div>
          <div className="grid grid-3">
            {inProgressModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                progress={currentStudent.progress?.[module.id] || 0}
                isCompleted={currentStudent.completedModules?.includes(module.id)}
                onClick={() => navigate(`/student/modules/${module.id}`)}
              />
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        className="dashboard-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="section-header">
          <h2>📚 My Modules</h2>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/student/modules')}
          >
            View All
          </button>
        </div>
        <div className="grid grid-3">
          {assignedModules.slice(0, 6).map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              progress={currentStudent.progress?.[module.id] || 0}
              isLocked={!currentStudent.unlockedModules?.includes(module.id)}
              isCompleted={currentStudent.completedModules?.includes(module.id)}
              onClick={() => navigate(`/student/modules/${module.id}`)}
            />
          ))}
        </div>
      </motion.section>

      {currentStudent.badges?.length > 0 && (
        <motion.section
          className="badges-showcase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2>🏆 My Badges</h2>
          <div className="badges-list">
            {currentStudent.badges.map((badge) => (
              <motion.div
                key={badge}
                className="badge-showcase-item"
                whileHover={{ scale: 1.05 }}
              >
                <span className="badge-emoji-large">
                  {badge === 'first-module' && '🎯'}
                  {badge === 'quick-learner' && '⚡'}
                  {badge === 'stem-star' && '⭐'}
                  {badge === 'perfectionist' && '💎'}
                  {badge === 'dedicated' && '🔥'}
                  {badge === 'explorer' && '🧭'}
                </span>
                <span className="badge-title">{badge.replace('-', ' ')}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default StudentDashboard;
