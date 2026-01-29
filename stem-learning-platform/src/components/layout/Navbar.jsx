import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { userRole, setUserRole, currentStudent, students, setCurrentStudentId, resetAllData } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showStudentPicker, setShowStudentPicker] = useState(false);
  const navigate = useNavigate();

  const handleRoleSwitch = (role) => {
    setUserRole(role);
    setShowUserMenu(false);
    navigate(role === 'teacher' ? '/teacher' : '/student');
  };

  const handleStudentSelect = (studentId) => {
    setCurrentStudentId(studentId);
    setShowStudentPicker(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search modules, students..."
            className="search-input"
          />
        </div>
      </div>

      <div className="navbar-right">
        {userRole === 'student' && (
          <div className="student-picker-container">
            <button
              className="student-picker-btn"
              onClick={() => setShowStudentPicker(!showStudentPicker)}
            >
              <img
                src={currentStudent?.avatar}
                alt={currentStudent?.name}
                className="avatar avatar-sm"
              />
              <span>{currentStudent?.name}</span>
              <ChevronDown size={16} />
            </button>

            {showStudentPicker && (
              <motion.div
                className="dropdown-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="dropdown-header">Switch Student</div>
                {students.map((student) => (
                  <button
                    key={student.id}
                    className={`dropdown-item ${student.id === currentStudent?.id ? 'active' : ''}`}
                    onClick={() => handleStudentSelect(student.id)}
                  >
                    <img src={student.avatar} alt={student.name} className="avatar avatar-sm" />
                    <span>{student.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        )}

        <div className="role-switcher">
          <button
            className={`role-btn ${userRole === 'teacher' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('teacher')}
          >
            Teacher
          </button>
          <button
            className={`role-btn ${userRole === 'student' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('student')}
          >
            Student
          </button>
        </div>

        <button className="btn-icon notification-btn">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>

        <div className="user-menu-container">
          <button
            className="user-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <User size={18} />
            </div>
            <ChevronDown size={16} />
          </button>

          {showUserMenu && (
            <motion.div
              className="dropdown-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="dropdown-header">Account</div>
              <button className="dropdown-item" onClick={() => handleRoleSwitch('teacher')}>
                <User size={16} />
                <span>Teacher View</span>
              </button>
              <button className="dropdown-item" onClick={() => handleRoleSwitch('student')}>
                <User size={16} />
                <span>Student View</span>
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item" onClick={resetAllData}>
                <RefreshCw size={16} />
                <span>Reset All Data</span>
              </button>
              <button className="dropdown-item text-danger">
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
