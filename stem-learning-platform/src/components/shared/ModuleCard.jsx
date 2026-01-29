import { motion } from 'framer-motion';
import './ModuleCard.css';

const ModuleCard = ({
  module,
  progress = 0,
  isLocked = false,
  isCompleted = false,
  onClick,
  showProgress = true,
  actions,
}) => {
  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'badge-beginner';
      case 'intermediate': return 'badge-intermediate';
      case 'advanced': return 'badge-advanced';
      default: return 'badge-primary';
    }
  };

  return (
    <motion.div
      className={`module-card ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
      onClick={!isLocked ? onClick : undefined}
      whileHover={!isLocked ? { y: -4, boxShadow: '0 12px 20px -8px rgba(0,0,0,0.15)' } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isLocked && (
        <div className="locked-overlay">
          <span className="lock-icon">🔒</span>
          <span className="lock-text">Locked</span>
        </div>
      )}

      {isCompleted && (
        <motion.div
          className="completed-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          ✓
        </motion.div>
      )}

      <div className="module-card-header" style={{ background: module.color + '15' }}>
        <span className="module-icon" style={{ background: module.color }}>
          {module.icon}
        </span>
        <span className={`badge ${getDifficultyClass(module.difficulty)}`}>
          {module.difficulty}
        </span>
      </div>

      <div className="module-card-body">
        <h3 className="module-title">{module.title}</h3>
        <p className="module-description">{module.description}</p>

        <div className="module-meta">
          <span className="meta-item">⏱️ {module.estimatedTime}</span>
          <span className="meta-item">📚 {module.lessons?.length || 0} lessons</span>
        </div>

        <div className="module-skills">
          {module.skills?.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>

        {showProgress && progress > 0 && (
          <div className="module-progress">
            <div className="progress-header">
              <span>Progress</span>
              <span className="progress-value">{progress}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className={`progress-fill ${progress === 100 ? 'success' : ''}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {actions && (
          <div className="module-actions">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ModuleCard;
