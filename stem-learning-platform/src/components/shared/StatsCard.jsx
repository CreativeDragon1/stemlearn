import { motion } from 'framer-motion';
import './StatsCard.css';

const StatsCard = ({ icon, label, value, change, color, delay = 0 }) => {
  return (
    <motion.div
      className="stats-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div
        className="stats-icon"
        style={{ background: color ? `${color}20` : 'var(--info-bg)' }}
      >
        <span style={{ color: color || 'var(--info)' }}>{icon}</span>
      </div>
      <div className="stats-content">
        <motion.span
          className="stats-value"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
        >
          {value}
        </motion.span>
        <span className="stats-label">{label}</span>
        {change !== undefined && (
          <span className={`stats-change ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
