import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ModuleCard from '../../components/shared/ModuleCard';
import Modal from '../../components/shared/Modal';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
} from 'lucide-react';
import './ModulesPage.css';

const ModulesPage = () => {
  const { modules, addDummyModule, deleteModule, updateModule } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedModule, setSelectedModule] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    estimatedTime: '',
  });

  const categories = [...new Set(modules.map((m) => m.category))];

  const filteredModules = modules.filter((module) => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || module.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === 'all' || module.category === filterCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const handleDeleteModule = () => {
    if (selectedModule) {
      deleteModule(selectedModule.id);
      setShowDeleteModal(false);
      setSelectedModule(null);
    }
  };

  const handleEditModule = () => {
    if (selectedModule) {
      updateModule(selectedModule.id, editForm);
      setShowEditModal(false);
      setSelectedModule(null);
    }
  };

  const openEditModal = (module) => {
    setSelectedModule(module);
    setEditForm({
      title: module.title,
      description: module.description,
      difficulty: module.difficulty,
      estimatedTime: module.estimatedTime,
    });
    setShowEditModal(true);
  };

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Modules</h1>
          <p className="text-muted">Create and manage learning modules</p>
        </div>
        <button className="btn btn-primary" onClick={addDummyModule}>
          <Plus size={18} />
          Add Dummy Module
        </button>
      </motion.div>

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

        <div className="filter-group">
          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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
                showProgress={false}
                onClick={() => navigate(`/teacher/modules/${module.id}`)}
                actions={
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(module);
                      }}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModule(module);
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
            <div className="empty-state-icon">📚</div>
            <h3>No modules found</h3>
            <p>Try adjusting your filters or create a new module.</p>
            <button className="btn btn-primary mt-4" onClick={addDummyModule}>
              <Plus size={18} />
              Add Dummy Module
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Module"
        size="sm"
      >
        <div className="modal-content">
          <p>Are you sure you want to delete <strong>{selectedModule?.title}</strong>?</p>
          <p className="text-muted mt-2">This will also remove it from all assigned students.</p>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDeleteModule}>
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Module"
      >
        <div className="modal-content">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Difficulty</label>
            <select
              className="form-select form-input"
              value={editForm.difficulty}
              onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Estimated Time</label>
            <input
              type="text"
              className="form-input"
              value={editForm.estimatedTime}
              onChange={(e) => setEditForm({ ...editForm, estimatedTime: e.target.value })}
              placeholder="e.g., 30 min"
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleEditModule}>
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModulesPage;
