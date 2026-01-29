import { motion } from 'framer-motion';
import './ProgressChart.css';

const ProgressChart = ({ preScore, postScore, label }) => {
  const improvement = postScore !== null ? postScore - preScore : 0;
  const maxScore = 100;

  return (
    <div className="progress-chart">
      {label && <h4 className="chart-label">{label}</h4>}
      
      <div className="chart-container">
        <div className="bar-group">
          <span className="bar-label">Pre</span>
          <div className="bar-wrapper">
            <motion.div
              className="bar bar-pre"
              initial={{ width: 0 }}
              animate={{ width: `${(preScore / maxScore) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <span className="bar-value">{preScore}%</span>
          </div>
        </div>
        
        <div className="bar-group">
          <span className="bar-label">Post</span>
          <div className="bar-wrapper">
            {postScore !== null ? (
              <>
                <motion.div
                  className="bar bar-post"
                  initial={{ width: 0 }}
                  animate={{ width: `${(postScore / maxScore) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                />
                <span className="bar-value">{postScore}%</span>
              </>
            ) : (
              <span className="bar-pending">Not yet taken</span>
            )}
          </div>
        </div>
      </div>

      {postScore !== null && (
        <motion.div
          className={`improvement ${improvement >= 0 ? 'positive' : 'negative'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {improvement >= 0 ? '📈' : '📉'} {improvement >= 0 ? '+' : ''}{improvement}% improvement
        </motion.div>
      )}
    </div>
  );
};

export default ProgressChart;
