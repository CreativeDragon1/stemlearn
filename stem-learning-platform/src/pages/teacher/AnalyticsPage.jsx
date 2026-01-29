import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  const { students, modules } = useApp();

  // Calculate analytics
  const totalStudents = students.length;
  const totalModules = modules.length;
  
  const studentsByDifficulty = {
    beginner: students.filter((s) => s.difficultyLevel === 'beginner').length,
    intermediate: students.filter((s) => s.difficultyLevel === 'intermediate').length,
    advanced: students.filter((s) => s.difficultyLevel === 'advanced').length,
  };

  const modulesByDifficulty = {
    beginner: modules.filter((m) => m.difficulty === 'beginner').length,
    intermediate: modules.filter((m) => m.difficulty === 'intermediate').length,
    advanced: modules.filter((m) => m.difficulty === 'advanced').length,
  };

  // Module popularity (most assigned)
  const modulePopularity = modules.map((module) => ({
    ...module,
    assignedCount: students.filter((s) => s.assignedModules?.includes(module.id)).length,
    completedCount: students.filter((s) => s.completedModules?.includes(module.id)).length,
  })).sort((a, b) => b.assignedCount - a.assignedCount);

  // Top performers
  const topPerformers = [...students]
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 5);

  // Average scores
  const allAssessments = students.flatMap((s) =>
    Object.values(s.assessments || {}).filter((a) => a.postScore !== null)
  );
  const avgPreScore = allAssessments.length > 0
    ? Math.round(allAssessments.reduce((sum, a) => sum + a.preScore, 0) / allAssessments.length)
    : 0;
  const avgPostScore = allAssessments.length > 0
    ? Math.round(allAssessments.reduce((sum, a) => sum + a.postScore, 0) / allAssessments.length)
    : 0;

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Analytics</h1>
          <p className="text-muted">Platform performance and insights</p>
        </div>
      </motion.div>

      <div className="analytics-grid">
        {/* Overview Cards */}
        <motion.div
          className="analytics-card overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Platform Overview</h3>
          <div className="overview-stats">
            <div className="overview-stat">
              <span className="big-number">{totalStudents}</span>
              <span className="label">Total Students</span>
            </div>
            <div className="overview-stat">
              <span className="big-number">{totalModules}</span>
              <span className="label">Total Modules</span>
            </div>
            <div className="overview-stat">
              <span className="big-number">{allAssessments.length}</span>
              <span className="label">Assessments Completed</span>
            </div>
          </div>
        </motion.div>

        {/* Students by Difficulty */}
        <motion.div
          className="analytics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3>Students by Difficulty</h3>
          <div className="bar-chart">
            {Object.entries(studentsByDifficulty).map(([level, count]) => (
              <div key={level} className="bar-item">
                <div className="bar-label">{level}</div>
                <div className="bar-container">
                  <motion.div
                    className={`bar ${level}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / totalStudents) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
                <div className="bar-value">{count}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Assessment Performance */}
        <motion.div
          className="analytics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Assessment Performance</h3>
          <div className="performance-comparison">
            <div className="perf-item">
              <span className="perf-label">Avg Pre-Assessment</span>
              <div className="perf-bar-wrapper">
                <motion.div
                  className="perf-bar pre"
                  initial={{ width: 0 }}
                  animate={{ width: `${avgPreScore}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="perf-value">{avgPreScore}%</span>
            </div>
            <div className="perf-item">
              <span className="perf-label">Avg Post-Assessment</span>
              <div className="perf-bar-wrapper">
                <motion.div
                  className="perf-bar post"
                  initial={{ width: 0 }}
                  animate={{ width: `${avgPostScore}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
              <span className="perf-value">{avgPostScore}%</span>
            </div>
            <div className="improvement-stat">
              <span className="improvement-value">+{avgPostScore - avgPreScore}%</span>
              <span className="improvement-label">Average Improvement</span>
            </div>
          </div>
        </motion.div>

        {/* Top Performers */}
        <motion.div
          className="analytics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>Top Performers</h3>
          <div className="leaderboard">
            {topPerformers.map((student, index) => (
              <div key={student.id} className="leaderboard-item">
                <span className="rank">#{index + 1}</span>
                <img src={student.avatar} alt={student.name} className="avatar avatar-sm" />
                <div className="leader-info">
                  <span className="leader-name">{student.name}</span>
                  <span className="leader-grade">{student.grade}</span>
                </div>
                <span className="leader-points">{student.points} pts</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Module Popularity */}
        <motion.div
          className="analytics-card wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Module Popularity</h3>
          <div className="module-stats">
            {modulePopularity.slice(0, 5).map((module) => (
              <div key={module.id} className="module-stat-item">
                <div className="module-stat-header">
                  <span className="module-icon-small" style={{ background: module.color }}>
                    {module.icon}
                  </span>
                  <span className="module-name">{module.title}</span>
                </div>
                <div className="module-stat-bars">
                  <div className="stat-bar-group">
                    <span className="stat-bar-label">Assigned</span>
                    <div className="stat-bar-container">
                      <motion.div
                        className="stat-bar assigned"
                        initial={{ width: 0 }}
                        animate={{ width: `${(module.assignedCount / totalStudents) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="stat-bar-value">{module.assignedCount}</span>
                  </div>
                  <div className="stat-bar-group">
                    <span className="stat-bar-label">Completed</span>
                    <div className="stat-bar-container">
                      <motion.div
                        className="stat-bar completed"
                        initial={{ width: 0 }}
                        animate={{ width: `${(module.completedCount / totalStudents) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      />
                    </div>
                    <span className="stat-bar-value">{module.completedCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
