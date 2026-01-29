import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ModuleCard from '../../components/shared/ModuleCard';
import { Search, Filter, Lock, Unlock } from 'lucide-react';
import './StudentModulesPage.css';

const StudentModulesPage = () => {
  const { currentStudent, modules } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  if (!currentStudent) {
    return <div className="page-container">Loading...</div>;
  }

  const assignedModules = modules.filter((m) =>
    currentStudent.assignedModules?.includes(m.id)
  );

  const filteredModules = assignedModules.filter((module) => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const progress = currentStudent.progress?.[module.id] || 0;
    const isLocked = !currentStudent.unlockedModules?.includes(module.id);
    const isCompleted = currentStudent.completedModules?.includes(module.id);
    
    let matchesStatus = true;
    if (filterStatus === 'completed') matchesStatus = isCompleted;
    if (filterStatus === 'in-progress') matchesStatus = !isCompleted && !isLocked && progress > 0;
    if (filterStatus === 'not-started') matchesStatus = !isCompleted && !isLocked && progress === 0;
    if (filterStatus === 'locked') matchesStatus = isLocked;

    return matchesSearch && matchesStatus;
  });

  const completedCount = assignedModules.filter((m) =>
    currentStudent.completedModules?.includes(m.id)
  ).length;

  const inProgressCount = assignedModules.filter((m) => {
    const progress = currentStudent.progress?.[m.id] || 0;
    return !currentStudent.completedModules?.includes(m.id) &&
      currentStudent.unlockedModules?.includes(m.id) &&
      progress > 0;
  }).length;

  const lockedCount = assignedModules.filter((m) =>
    !currentStudent.unlockedModules?.includes(m.id)
  ).length;

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>My Modules</h1>
          <p className="text-muted">Your assigned learning modules</p>
        </div>
      </motion.div>

      <div className="status-cards">
        <motion.button
          className={`status-card ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
          whileHover={{ y: -2 }}
        >
          <span className="status-icon">📚</span>
          <span className="status-value">{assignedModules.length}</span>
          <span className="status-label">All Modules</span>
        </motion.button>
        <motion.button
          className={`status-card ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
          whileHover={{ y: -2 }}
        >
          <span className="status-icon">✅</span>
          <span className="status-value">{completedCount}</span>
          <span className="status-label">Completed</span>
        </motion.button>
        <motion.button
          className={`status-card ${filterStatus === 'in-progress' ? 'active' : ''}`}
          onClick={() => setFilterStatus('in-progress')}
          whileHover={{ y: -2 }}
        >
          <span className="status-icon">🔥</span>
          <span className="status-value">{inProgressCount}</span>
          <span className="status-label">In Progress</span>
        </motion.button>
        <motion.button
          className={`status-card ${filterStatus === 'locked' ? 'active' : ''}`}
          onClick={() => setFilterStatus('locked')}
          whileHover={{ y: -2 }}
        >
          <span className="status-icon">🔒</span>
          <span className="status-value">{lockedCount}</span>
          <span className="status-label">Locked</span>
        </motion.button>
      </div>

      <div className="filters-bar">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search modules..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredModules.length > 0 ? (
          <motion.div
            className="grid grid-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                progress={currentStudent.progress?.[module.id] || 0}
                isLocked={!currentStudent.unlockedModules?.includes(module.id)}
                isCompleted={currentStudent.completedModules?.includes(module.id)}
                onClick={() => navigate(`/student/modules/${module.id}`)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-state-icon">📭</div>
            <h3>No modules found</h3>
            <p>
              {filterStatus === 'all'
                ? "You don't have any assigned modules yet."
                : `No ${filterStatus.replace('-', ' ')} modules.`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentModulesPage;
