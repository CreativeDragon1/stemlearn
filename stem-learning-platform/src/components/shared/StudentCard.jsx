import { motion } from 'framer-motion';
import './StudentCard.css';

const StudentCard = ({
  student,
  modules,
  onClick,
  actions,
  showProgress = true,
}) => {
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'var(--beginner)';
      case 'intermediate': return 'var(--intermediate)';
      case 'advanced': return 'var(--advanced)';
      default: return 'var(--primary)';
    }
  };

  const completedCount = student.completedModules?.length || 0;
  const assignedCount = student.assignedModules?.length || 0;
  const overallProgress = assignedCount > 0
    ? Math.round((completedCount / assignedCount) * 100)
    : 0;

  return (
    <motion.div
      className="student-card"
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="student-card-header">
        <img
          src={student.avatar}
          alt={student.name}
          className="student-avatar"
        />
        <div className="student-info">
          <h3 className="student-name">{student.name}</h3>
          <span className="student-grade">{student.grade}</span>
        </div>
        <div
          className="difficulty-indicator"
          style={{ background: getDifficultyColor(student.difficultyLevel) }}
        >
          {student.difficultyLevel?.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="student-card-body">
        <div className="student-stats">
          <div className="stat">
            <span className="stat-value">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat">
            <span className="stat-value">{assignedCount}</span>
            <span className="stat-label">Assigned</span>
          </div>
          <div className="stat">
            <span className="stat-value">{student.points || 0}</span>
            <span className="stat-label">Points</span>
          </div>
        </div>

        {showProgress && (
          <div className="student-progress">
            <div className="progress-header">
              <span>Overall Progress</span>
              <span className="progress-value">{overallProgress}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className={`progress-fill ${overallProgress === 100 ? 'success' : ''}`}
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {student.badges?.length > 0 && (
          <div className="student-badges">
            {student.badges.slice(0, 4).map((badge, index) => (
              <span key={index} className="badge-icon" title={badge}>
                {badge === 'first-module' && '🎯'}
                {badge === 'quick-learner' && '⚡'}
                {badge === 'stem-star' && '⭐'}
                {badge === 'perfectionist' && '💎'}
                {badge === 'dedicated' && '🔥'}
                {badge === 'explorer' && '🧭'}
              </span>
            ))}
          </div>
        )}

        {actions && (
          <div className="student-actions">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StudentCard;
