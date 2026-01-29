import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle,
  Circle,
  Play,
  ChevronRight,
} from 'lucide-react';
import './ModuleViewPage.css';

const ModuleViewPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { currentStudent, modules, updateStudentProgress, recordAssessment } = useApp();

  const [activeTab, setActiveTab] = useState('lessons');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizType, setQuizType] = useState('pre');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const module = modules.find((m) => m.id === moduleId);

  if (!module || !currentStudent) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Module not found</h3>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/student/modules')}>
            Back to Modules
          </button>
        </div>
      </div>
    );
  }

  const isLocked = !currentStudent.unlockedModules?.includes(module.id);
  const isCompleted = currentStudent.completedModules?.includes(module.id);
  const progress = currentStudent.progress?.[module.id] || 0;
  const assessment = currentStudent.assessments?.[module.id];

  const lessons = module.lessons || [];
  const exercises = module.exercises || [];

  const handleLessonComplete = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
    
    const newProgress = Math.min(
      100,
      Math.round(((currentLessonIndex + 1) / lessons.length) * 60) + (assessment?.preScore ? 20 : 0)
    );
    updateStudentProgress(currentStudent.id, module.id, newProgress);
  };

  const startQuiz = (type) => {
    setQuizType(type);
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setQuizScore(0);
  };

  const questions = quizType === 'pre' 
    ? module.preAssessment?.questions || []
    : module.postAssessment?.questions || [];

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answerIndex });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      let correct = 0;
      questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correct++;
        }
      });
      const score = Math.round((correct / questions.length) * 100);
      setQuizScore(score);
      setQuizCompleted(true);
      recordAssessment(currentStudent.id, module.id, quizType, score);

      // Update progress after post-assessment
      if (quizType === 'post') {
        updateStudentProgress(currentStudent.id, module.id, 100);
      }
    }
  };

  if (isLocked) {
    return (
      <div className="page-container">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button className="btn btn-ghost mb-4" onClick={() => navigate('/student/modules')}>
            <ArrowLeft size={18} />
            Back to Modules
          </button>
        </motion.div>
        <div className="locked-module-message">
          <span className="lock-icon-large">🔒</span>
          <h2>Module Locked</h2>
          <p>This module hasn't been unlocked yet. Complete previous modules or ask your teacher to unlock it.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/student/modules')}>
            View Other Modules
          </button>
        </div>
      </div>
    );
  }

  if (showQuiz) {
    return (
      <div className="page-container">
        <motion.div
          className="quiz-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="quiz-header">
            <h2>{quizType === 'pre' ? 'Pre-Assessment' : 'Post-Assessment'}</h2>
            {!quizCompleted && (
              <span className="question-counter">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            )}
          </div>

          {!quizCompleted ? (
            <div className="quiz-content">
              <div className="quiz-progress">
                <div
                  className="quiz-progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="question-card"
                >
                  <h3 className="question-text">{questions[currentQuestionIndex]?.question}</h3>
                  <div className="options-list">
                    {questions[currentQuestionIndex]?.options.map((option, index) => (
                      <button
                        key={index}
                        className={`option-btn ${selectedAnswers[questions[currentQuestionIndex].id] === index ? 'selected' : ''}`}
                        onClick={() => handleAnswerSelect(questions[currentQuestionIndex].id, index)}
                      >
                        <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                        <span className="option-text">{option}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="quiz-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowQuiz(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[questions[currentQuestionIndex]?.id] === undefined}
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              className="quiz-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={`score-circle ${quizScore >= 70 ? 'good' : quizScore >= 50 ? 'okay' : 'poor'}`}>
                <span className="score-value">{quizScore}%</span>
              </div>
              <h3>
                {quizScore >= 70
                  ? '🎉 Great job!'
                  : quizScore >= 50
                  ? '👍 Good effort!'
                  : '💪 Keep practicing!'}
              </h3>
              <p>
                You answered {Math.round((quizScore / 100) * questions.length)} out of {questions.length} questions correctly.
              </p>
              <button
                className="btn btn-primary btn-lg mt-4"
                onClick={() => setShowQuiz(false)}
              >
                Continue Learning
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button className="btn btn-ghost mb-4" onClick={() => navigate('/student/modules')}>
          <ArrowLeft size={18} />
          Back to Modules
        </button>
      </motion.div>

      <motion.div
        className="module-hero"
        style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}dd)` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hero-content">
          <span className="module-icon-large">{module.icon}</span>
          <div>
            <span className={`badge badge-${module.difficulty}`}>{module.difficulty}</span>
            <h1>{module.title}</h1>
            <p>{module.description}</p>
            <div className="module-meta-row">
              <span><Clock size={16} /> {module.estimatedTime}</span>
              <span><BookOpen size={16} /> {lessons.length} lessons</span>
            </div>
          </div>
        </div>
        {isCompleted && (
          <div className="completed-stamp">
            <CheckCircle size={24} />
            Completed
          </div>
        )}
      </motion.div>

      <div className="module-progress-section">
        <div className="progress-info">
          <span>Your Progress</span>
          <span className="progress-percent">{progress}%</span>
        </div>
        <div className="progress-bar large">
          <motion.div
            className={`progress-fill ${progress === 100 ? 'success' : ''}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="assessment-actions">
        {!assessment?.preScore && (
          <button
            className="btn btn-primary btn-lg"
            onClick={() => startQuiz('pre')}
          >
            <Play size={18} />
            Take Pre-Assessment
          </button>
        )}
        {assessment?.preScore && !assessment?.postScore && progress >= 80 && (
          <button
            className="btn btn-success btn-lg"
            onClick={() => startQuiz('post')}
          >
            <Play size={18} />
            Take Post-Assessment
          </button>
        )}
        {assessment?.preScore && (
          <div className="assessment-status">
            <span className="status-item">
              Pre-Assessment: <strong>{assessment.preScore}%</strong>
            </span>
            {assessment.postScore && (
              <span className="status-item">
                Post-Assessment: <strong>{assessment.postScore}%</strong>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'lessons' ? 'active' : ''}`}
          onClick={() => setActiveTab('lessons')}
        >
          Lessons
        </button>
        <button
          className={`tab ${activeTab === 'exercises' ? 'active' : ''}`}
          onClick={() => setActiveTab('exercises')}
        >
          Exercises
        </button>
      </div>

      {activeTab === 'lessons' && (
        <motion.div
          className="lessons-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              className={`lesson-card ${index === currentLessonIndex ? 'active' : ''} ${index < currentLessonIndex ? 'completed' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="lesson-status">
                {index < currentLessonIndex ? (
                  <CheckCircle size={20} className="status-completed" />
                ) : index === currentLessonIndex ? (
                  <Play size={20} className="status-current" />
                ) : (
                  <Circle size={20} className="status-pending" />
                )}
              </div>
              <div className="lesson-content">
                <h3>{lesson.title}</h3>
                <p>{lesson.content}</p>
                <span className="lesson-duration">{lesson.duration}</span>
              </div>
              {index === currentLessonIndex && (
                <button className="btn btn-primary btn-sm" onClick={handleLessonComplete}>
                  {index < lessons.length - 1 ? 'Mark Complete' : 'Finish'}
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'exercises' && (
        <motion.div
          className="exercises-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {exercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              className="exercise-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="exercise-header">
                <h3>{exercise.title}</h3>
                <span className={`badge badge-${exercise.difficulty}`}>
                  {exercise.points} pts
                </span>
              </div>
              <p className="exercise-question">{exercise.question}</p>
              <div className="exercise-options">
                {exercise.options?.map((option, optIndex) => (
                  <div key={optIndex} className="exercise-option">
                    <span className="option-letter">{String.fromCharCode(65 + optIndex)}</span>
                    <span>{option}</span>
                  </div>
                ))}
              </div>
              <div className="exercise-explanation">
                <strong>💡 Explanation:</strong> {exercise.explanation}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ModuleViewPage;
