import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { badges as allBadges } from '../../data/dummyData';
import './AchievementsPage.css';

const AchievementsPage = () => {
  const { currentStudent } = useApp();

  if (!currentStudent) {
    return <div className="page-container">Loading...</div>;
  }

  const earnedBadges = allBadges.filter((badge) =>
    currentStudent.badges?.includes(badge.id)
  );

  const lockedBadges = allBadges.filter((badge) =>
    !currentStudent.badges?.includes(badge.id)
  );

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Achievements</h1>
          <p className="text-muted">Celebrate your learning milestones</p>
        </div>
      </motion.div>

      <motion.div
        className="achievements-summary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="summary-card">
          <span className="summary-icon">🏆</span>
          <div>
            <span className="summary-value">{earnedBadges.length}</span>
            <span className="summary-label">Badges Earned</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">🎯</span>
          <div>
            <span className="summary-value">{currentStudent.points || 0}</span>
            <span className="summary-label">Total Points</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">✨</span>
          <div>
            <span className="summary-value">{currentStudent.completedModules?.length || 0}</span>
            <span className="summary-label">Modules Completed</span>
          </div>
        </div>
      </motion.div>

      {earnedBadges.length > 0 && (
        <motion.section
          className="achievements-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2>🎖️ Earned Badges</h2>
          <div className="badges-grid">
            {earnedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                className="achievement-badge earned"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div
                  className="badge-icon-wrapper"
                  style={{ background: `${badge.color}20`, borderColor: badge.color }}
                >
                  <span className="badge-icon">{badge.icon}</span>
                </div>
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
                <div className="earned-label">✓ Earned</div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {lockedBadges.length > 0 && (
        <motion.section
          className="achievements-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>🔒 Badges to Unlock</h2>
          <div className="badges-grid">
            {lockedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                className="achievement-badge locked"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="badge-icon-wrapper locked">
                  <span className="badge-icon">🔒</span>
                </div>
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        className="points-history"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2>💰 Points Guide</h2>
        <div className="points-list">
          <div className="points-item">
            <span className="points-action">Complete a lesson</span>
            <span className="points-value">+5 points</span>
          </div>
          <div className="points-item">
            <span className="points-action">Complete a module</span>
            <span className="points-value">+50 points</span>
          </div>
          <div className="points-item">
            <span className="points-action">Pre-assessment</span>
            <span className="points-value">+10 points</span>
          </div>
          <div className="points-item">
            <span className="points-action">Post-assessment</span>
            <span className="points-value">+score points</span>
          </div>
          <div className="points-item">
            <span className="points-action">Score 90%+ on assessment</span>
            <span className="points-value">💎 Perfectionist badge</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AchievementsPage;
