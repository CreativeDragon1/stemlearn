import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ModuleCard from '../../components/shared/ModuleCard';
import ProgressChart from '../../components/shared/ProgressChart';
import Modal from '../../components/shared/Modal';
import {
  ArrowLeft,
  BookOpen,
  Trophy,
  Target,
  Lock,
  Unlock,
  Plus,
  Minus,
} from 'lucide-react';
import './StudentDetailPage.css';

const StudentDetailPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const {
    students,
    modules,
    assignModuleToStudent,
    unassignModuleFromStudent,
    unlockModuleForStudent,
    updateStudentDifficulty,
    recordAssessment,
  } = useApp();

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [assessmentType, setAssessmentType] = useState('pre');
  const [assessmentScore, setAssessmentScore] = useState('');

  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Student not found</h3>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/teacher/students')}>
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  const assignedModules = modules.filter((m) => student.assignedModules?.includes(m.id));
  const unassignedModules = modules.filter((m) => !student.assignedModules?.includes(m.id));

  const handleRecordAssessment = () => {
    const score = parseInt(assessmentScore);
    if (score >= 0 && score <= 100 && selectedModule) {
      recordAssessment(student.id, selectedModule.id, assessmentType, score);
      setShowAssessmentModal(false);
      setSelectedModule(null);
      setAssessmentScore('');
    }
  };

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="btn btn-ghost mb-4" onClick={() => navigate('/teacher/students')}>
          <ArrowLeft size={18} />
          Back to Students
        </button>
      </motion.div>

      <motion.div
        className="student-detail-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="student-profile">
          <img src={student.avatar} alt={student.name} className="avatar avatar-xl" />
          <div className="student-info">
            <h1>{student.name}</h1>
            <p className="text-muted">{student.email}</p>
            <div className="student-meta">
              <span className="badge badge-primary">{student.grade}</span>
              <span className={`badge badge-${student.difficultyLevel}`}>
                {student.difficultyLevel}
              </span>
            </div>
          </div>
        </div>

        <div className="student-stats-row">
          <div className="stat-item">
            <BookOpen size={20} className="stat-icon" />
            <div>
              <span className="stat-value">{student.assignedModules?.length || 0}</span>
              <span className="stat-label">Assigned</span>
            </div>
          </div>
          <div className="stat-item">
            <Trophy size={20} className="stat-icon" />
            <div>
              <span className="stat-value">{student.completedModules?.length || 0}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-item">
            <Target size={20} className="stat-icon" />
            <div>
              <span className="stat-value">{student.points || 0}</span>
              <span className="stat-label">Points</span>
            </div>
          </div>
        </div>

        <div className="difficulty-selector">
          <span className="selector-label">Difficulty Level:</span>
          <div className="difficulty-buttons">
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                className={`diff-btn ${student.difficultyLevel === level ? 'active' : ''} ${level}`}
                onClick={() => updateStudentDifficulty(student.id, level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="detail-grid">
        <motion.section
          className="detail-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="section-header">
            <h2>Assigned Modules</h2>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAssignModal(true)}
            >
              <Plus size={16} />
              Assign Module
            </button>
          </div>

          {assignedModules.length > 0 ? (
            <div className="modules-list">
              {assignedModules.map((module) => {
                const isUnlocked = student.unlockedModules?.includes(module.id);
                const isCompleted = student.completedModules?.includes(module.id);
                const progress = student.progress?.[module.id] || 0;

                return (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    progress={progress}
                    isLocked={!isUnlocked}
                    isCompleted={isCompleted}
                    actions={
                      <>
                        {!isUnlocked ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              unlockModuleForStudent(student.id, module.id);
                            }}
                          >
                            <Unlock size={14} />
                            Unlock
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModule(module);
                              setShowAssessmentModal(true);
                            }}
                          >
                            <Target size={14} />
                            Record Score
                          </button>
                        )}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            unassignModuleFromStudent(student.id, module.id);
                          }}
                        >
                          <Minus size={14} />
                        </button>
                      </>
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <p>No modules assigned yet</p>
            </div>
          )}
        </motion.section>

        <motion.section
          className="detail-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-header">
            <h2>Assessment Results</h2>
          </div>

          {Object.keys(student.assessments || {}).length > 0 ? (
            <div className="assessments-list">
              {Object.entries(student.assessments).map(([moduleId, scores]) => {
                const module = modules.find((m) => m.id === moduleId);
                if (!module) return null;

                return (
                  <ProgressChart
                    key={moduleId}
                    label={module.title}
                    preScore={scores.preScore || 0}
                    postScore={scores.postScore}
                  />
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <p>No assessment results yet</p>
            </div>
          )}

          {student.badges?.length > 0 && (
            <div className="badges-section">
              <h3>Badges Earned</h3>
              <div className="badges-grid">
                {student.badges.map((badge) => (
                  <div key={badge} className="badge-item">
                    <span className="badge-emoji">
                      {badge === 'first-module' && '🎯'}
                      {badge === 'quick-learner' && '⚡'}
                      {badge === 'stem-star' && '⭐'}
                      {badge === 'perfectionist' && '💎'}
                      {badge === 'dedicated' && '🔥'}
                      {badge === 'explorer' && '🧭'}
                    </span>
                    <span className="badge-name">{badge.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.section>
      </div>

      {/* Assign Module Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Module"
        size="lg"
      >
        <div className="modal-content">
          {unassignedModules.length > 0 ? (
            <div className="assign-modules-list">
              {unassignedModules.map((module) => (
                <div key={module.id} className="assign-module-item">
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
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      assignModuleToStudent(student.id, module.id);
                    }}
                  >
                    <Plus size={14} />
                    Assign
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>All modules have been assigned to this student.</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Assessment Modal */}
      <Modal
        isOpen={showAssessmentModal}
        onClose={() => {
          setShowAssessmentModal(false);
          setSelectedModule(null);
          setAssessmentScore('');
        }}
        title="Record Assessment Score"
      >
        <div className="modal-content">
          {selectedModule && (
            <>
              <p>Record assessment score for <strong>{selectedModule.title}</strong></p>
              
              <div className="form-group mt-4">
                <label className="form-label">Assessment Type</label>
                <div className="assessment-type-selector">
                  <button
                    className={`type-btn ${assessmentType === 'pre' ? 'active' : ''}`}
                    onClick={() => setAssessmentType('pre')}
                  >
                    Pre-Assessment
                  </button>
                  <button
                    className={`type-btn ${assessmentType === 'post' ? 'active' : ''}`}
                    onClick={() => setAssessmentType('post')}
                  >
                    Post-Assessment
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Score (0-100)</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max="100"
                  value={assessmentScore}
                  onChange={(e) => setAssessmentScore(e.target.value)}
                  placeholder="Enter score..."
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAssessmentModal(false);
                    setSelectedModule(null);
                    setAssessmentScore('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleRecordAssessment}
                  disabled={!assessmentScore || assessmentScore < 0 || assessmentScore > 100}
                >
                  Save Score
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default StudentDetailPage;
