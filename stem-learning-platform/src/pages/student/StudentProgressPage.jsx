import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ProgressChart from '../../components/shared/ProgressChart';
import './StudentProgressPage.css';

const StudentProgressPage = () => {
  const { currentStudent, modules } = useApp();

  if (!currentStudent) {
    return <div className="page-container">Loading...</div>;
  }

  const assignedModules = modules.filter((m) =>
    currentStudent.assignedModules?.includes(m.id)
  );

  const completedCount = currentStudent.completedModules?.length || 0;
  const totalAssigned = assignedModules.length;
  const overallProgress = totalAssigned > 0
    ? Math.round((completedCount / totalAssigned) * 100)
    : 0;

  const assessments = Object.entries(currentStudent.assessments || {})
    .map(([moduleId, scores]) => ({
      module: modules.find((m) => m.id === moduleId),
      scores,
    }))
    .filter((a) => a.module);

  const avgImprovement = assessments.filter((a) => a.scores.postScore !== null).length > 0
    ? Math.round(
        assessments
          .filter((a) => a.scores.postScore !== null)
          .reduce((sum, a) => sum + (a.scores.postScore - a.scores.preScore), 0) /
        assessments.filter((a) => a.scores.postScore !== null).length
      )
    : 0;

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>My Progress</h1>
          <p className="text-muted">Track your learning journey</p>
        </div>
      </motion.div>

      <motion.div
        className="progress-overview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="overview-main">
          <div className="progress-ring-container">
            <svg className="progress-ring" viewBox="0 0 100 100">
              <circle
                className="progress-ring-bg"
                cx="50"
                cy="50"
                r="45"
              />
              <motion.circle
                className="progress-ring-fill"
                cx="50"
                cy="50"
                r="45"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * overallProgress) / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="progress-ring-text">
              <span className="progress-percent">{overallProgress}%</span>
              <span className="progress-label">Complete</span>
            </div>
          </div>
          <div className="overview-details">
            <h2>Overall Progress</h2>
            <p className="text-muted">
              You've completed {completedCount} out of {totalAssigned} modules
            </p>
            <div className="overview-stats">
              <div className="overview-stat">
                <span className="stat-icon">🎯</span>
                <div>
                  <span className="stat-value">{currentStudent.points || 0}</span>
                  <span className="stat-label">Points</span>
                </div>
              </div>
              <div className="overview-stat">
                <span className="stat-icon">🏆</span>
                <div>
                  <span className="stat-value">{currentStudent.badges?.length || 0}</span>
                  <span className="stat-label">Badges</span>
                </div>
              </div>
              <div className="overview-stat">
                <span className="stat-icon">📈</span>
                <div>
                  <span className="stat-value">+{avgImprovement}%</span>
                  <span className="stat-label">Avg Improvement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="progress-grid">
        <motion.section
          className="progress-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2>Module Progress</h2>
          <div className="module-progress-list">
            {assignedModules.map((module) => {
              const progress = currentStudent.progress?.[module.id] || 0;
              const isCompleted = currentStudent.completedModules?.includes(module.id);
              const isLocked = !currentStudent.unlockedModules?.includes(module.id);

              return (
                <div
                  key={module.id}
                  className={`module-progress-item ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="module-info">
                    <span className="module-icon" style={{ background: module.color }}>
                      {module.icon}
                    </span>
                    <div>
                      <h4>{module.title}</h4>
                      <span className={`badge badge-${module.difficulty}`}>
                        {module.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="module-progress-bar">
                    {isLocked ? (
                      <span className="locked-label">🔒 Locked</span>
                    ) : (
                      <>
                        <div className="progress-bar">
                          <motion.div
                            className={`progress-fill ${isCompleted ? 'success' : ''}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="progress-text">{progress}%</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          className="progress-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Assessment Results</h2>
          {assessments.length > 0 ? (
            <div className="assessments-list">
              {assessments.map((assessment) => (
                <ProgressChart
                  key={assessment.module.id}
                  label={assessment.module.title}
                  preScore={assessment.scores.preScore || 0}
                  postScore={assessment.scores.postScore}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <p>No assessments taken yet</p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default StudentProgressPage;
