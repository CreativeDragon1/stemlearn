import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  GraduationCap,
  Trophy,
  Target,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { userRole } = useApp();
  const location = useLocation();

  const teacherLinks = [
    { to: '/teacher', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/teacher/students', icon: Users, label: 'Students' },
    { to: '/teacher/modules', icon: BookOpen, label: 'Modules' },
    { to: '/teacher/assessments', icon: Target, label: 'Assessments' },
    { to: '/teacher/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const studentLinks = [
    { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/student/modules', icon: BookOpen, label: 'My Modules' },
    { to: '/student/progress', icon: BarChart3, label: 'My Progress' },
    { to: '/student/achievements', icon: Trophy, label: 'Achievements' },
  ];

  const links = userRole === 'teacher' ? teacherLinks : studentLinks;

  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="sidebar-header">
        <div className="logo">
          <GraduationCap size={28} className="logo-icon" />
          <span className="logo-text">STEM Learn</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">
            {userRole === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
          </span>
          <ul className="nav-list">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          className="nav-link-bg"
                          layoutId="activeNav"
                          initial={false}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}
                      <link.icon size={20} className="nav-icon" />
                      <span>{link.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-link">
          <Settings size={20} className="nav-icon" />
          <span>Settings</span>
        </NavLink>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
