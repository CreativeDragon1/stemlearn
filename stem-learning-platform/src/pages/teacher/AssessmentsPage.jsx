import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ProgressChart from '../../components/shared/ProgressChart';
import './AssessmentsPage.css';

const AssessmentsPage = () => {
  const { students, modules } = useApp();

  // Collect all assessments across students
  const allAssessments = students.flatMap((student) =>
    Object.entries(student.assessments || {}).map(([moduleId, scores]) => ({
      student,
      module: modules.find((m) => m.id === moduleId),
      scores,
    }))
  ).filter((a) => a.module);

  const completedAssessments = allAssessments.filter((a) => a.scores.postScore !== null);
  const pendingAssessments = allAssessments.filter((a) => a.scores.postScore === null);

  const avgImprovement = completedAssessments.length > 0
    ? Math.round(
        completedAssessments.reduce((sum, a) => sum + (a.scores.postScore - a.scores.preScore), 0) /
        completedAssessments.length
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
          <h1>Assessments</h1>
          <p className="text-muted">Track pre and post assessment results</p>
        </div>
      </motion.div>

      <div className="assessment-stats">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="stat-icon">📝</span>
          <div>
            <span className="stat-value">{allAssessments.length}</span>
            <span className="stat-label">Total Assessments</span>
          </div>
        </motion.div>
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="stat-icon">✅</span>
          <div>
            <span className="stat-value">{completedAssessments.length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </motion.div>
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="stat-icon">⏳</span>
          <div>
            <span className="stat-value">{pendingAssessments.length}</span>
            <span className="stat-label">Pending Post-Assessment</span>
          </div>
        </motion.div>
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="stat-icon">📈</span>
          <div>
            <span className="stat-value">{avgImprovement >= 0 ? '+' : ''}{avgImprovement}%</span>
            <span className="stat-label">Avg Improvement</span>
          </div>
        </motion.div>
      </div>

      <div className="assessments-grid">
        <motion.section
          className="assessments-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Completed Assessments</h2>
          {completedAssessments.length > 0 ? (
            <div className="assessment-list">
              {completedAssessments.map((assessment, index) => (
                <div key={index} className="assessment-item">
                  <div className="assessment-header">
                    <img
                      src={assessment.student.avatar}
                      alt={assessment.student.name}
                      className="avatar avatar-sm"
                    />
                    <div className="assessment-info">
                      <h4>{assessment.student.name}</h4>
                      <p>{assessment.module.title}</p>
                    </div>
                  </div>
                  <ProgressChart
                    preScore={assessment.scores.preScore}
                    postScore={assessment.scores.postScore}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No completed assessments yet</p>
            </div>
          )}
        </motion.section>

        <motion.section
          className="assessments-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2>Pending Post-Assessments</h2>
          {pendingAssessments.length > 0 ? (
            <div className="assessment-list">
              {pendingAssessments.map((assessment, index) => (
                <div key={index} className="assessment-item pending">
                  <div className="assessment-header">
                    <img
                      src={assessment.student.avatar}
                      alt={assessment.student.name}
                      className="avatar avatar-sm"
                    />
                    <div className="assessment-info">
                      <h4>{assessment.student.name}</h4>
                      <p>{assessment.module.title}</p>
                    </div>
                  </div>
                  <div className="pre-score">
                    <span className="label">Pre-Assessment Score:</span>
                    <span className="score">{assessment.scores.preScore}%</span>
                  </div>
                  <div className="pending-badge">
                    <span>⏳ Awaiting post-assessment</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No pending assessments</p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default AssessmentsPage;
