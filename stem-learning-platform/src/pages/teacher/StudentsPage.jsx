import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StudentCard from '../../components/shared/StudentCard';
import Modal from '../../components/shared/Modal';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import './StudentsPage.css';

const StudentsPage = () => {
  const { students, modules, addDummyStudent, deleteStudent, updateStudentDifficulty } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || student.difficultyLevel === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const handleDeleteStudent = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      setShowDeleteModal(false);
      setSelectedStudent(null);
    }
  };

  const handleDifficultyChange = (level) => {
    if (selectedStudent) {
      updateStudentDifficulty(selectedStudent.id, level);
      setShowDifficultyModal(false);
      setSelectedStudent(null);
    }
  };

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Students</h1>
          <p className="text-muted">Manage and track your students' progress</p>
        </div>
        <button className="btn btn-primary" onClick={addDummyStudent}>
          <Plus size={18} />
          Add Dummy Student
        </button>
      </motion.div>

      <div className="filters-bar">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search students..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            className="form-select"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredStudents.length > 0 ? (
          <motion.div
            className="grid grid-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredStudents.map((student, index) => (
              <StudentCard
                key={student.id}
                student={student}
                modules={modules}
                onClick={() => navigate(`/teacher/students/${student.id}`)}
                actions={
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                        setShowDifficultyModal(true);
                      }}
                    >
                      <Edit size={14} />
                      Level
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/teacher/students/${student.id}`);
                      }}
                    >
                      <BookOpen size={14} />
                      Modules
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                }
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-state-icon">👥</div>
            <h3>No students found</h3>
            <p>Try adjusting your search or filters, or add a new student.</p>
            <button className="btn btn-primary mt-4" onClick={addDummyStudent}>
              <Plus size={18} />
              Add Dummy Student
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Student"
        size="sm"
      >
        <div className="modal-content">
          <p>Are you sure you want to delete <strong>{selectedStudent?.name}</strong>?</p>
          <p className="text-muted mt-2">This action cannot be undone.</p>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDeleteStudent}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Difficulty Modal */}
      <Modal
        isOpen={showDifficultyModal}
        onClose={() => setShowDifficultyModal(false)}
        title="Change Difficulty Level"
      >
        <div className="modal-content">
          <p>Select a new difficulty level for <strong>{selectedStudent?.name}</strong>:</p>
          <div className="difficulty-options">
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                className={`difficulty-option ${selectedStudent?.difficultyLevel === level ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(level)}
              >
                <span className={`difficulty-dot ${level}`} />
                <span className="difficulty-label">
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentsPage;
