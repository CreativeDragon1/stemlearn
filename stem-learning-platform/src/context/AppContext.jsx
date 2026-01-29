import { createContext, useContext, useState, useEffect } from 'react';
import { initialStudents, initialModules, badges } from '../data/dummyData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || 'teacher';
  });
  
  const [currentStudentId, setCurrentStudentId] = useState(() => {
    return localStorage.getItem('currentStudentId') || 'student-1';
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [modules, setModules] = useState(() => {
    const saved = localStorage.getItem('modules');
    return saved ? JSON.parse(saved) : initialModules;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('userRole', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('currentStudentId', currentStudentId);
  }, [currentStudentId]);

  // Get current student
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  // Student functions
  const updateStudentProgress = (studentId, moduleId, progress) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const newProgress = { ...student.progress, [moduleId]: progress };
        const completedModules = progress === 100 && !student.completedModules.includes(moduleId)
          ? [...student.completedModules, moduleId]
          : student.completedModules;
        
        // Award badges
        let newBadges = [...student.badges];
        if (completedModules.length === 1 && !newBadges.includes('first-module')) {
          newBadges.push('first-module');
        }
        if (completedModules.length >= 3 && !newBadges.includes('stem-star')) {
          newBadges.push('stem-star');
        }

        return {
          ...student,
          progress: newProgress,
          completedModules,
          badges: newBadges,
          points: student.points + (progress === 100 ? 50 : 5),
        };
      }
      return student;
    }));
  };

  const recordAssessment = (studentId, moduleId, type, score) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const currentAssessment = student.assessments[moduleId] || { preScore: null, postScore: null, completed: false };
        const newAssessment = type === 'pre'
          ? { ...currentAssessment, preScore: score }
          : { ...currentAssessment, postScore: score, completed: true };
        
        // Award perfectionist badge
        let newBadges = [...student.badges];
        if (type === 'post' && score >= 90 && !newBadges.includes('perfectionist')) {
          newBadges.push('perfectionist');
        }

        return {
          ...student,
          assessments: { ...student.assessments, [moduleId]: newAssessment },
          badges: newBadges,
          points: student.points + (type === 'post' ? score : 10),
        };
      }
      return student;
    }));
  };

  const assignModuleToStudent = (studentId, moduleId) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId && !student.assignedModules.includes(moduleId)) {
        const isFirstModule = student.assignedModules.length === 0;
        return {
          ...student,
          assignedModules: [...student.assignedModules, moduleId],
          unlockedModules: isFirstModule ? [moduleId] : student.unlockedModules,
          progress: { ...student.progress, [moduleId]: 0 },
        };
      }
      return student;
    }));
  };

  const unassignModuleFromStudent = (studentId, moduleId) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const { [moduleId]: _, ...restProgress } = student.progress;
        const { [moduleId]: __, ...restAssessments } = student.assessments;
        return {
          ...student,
          assignedModules: student.assignedModules.filter(id => id !== moduleId),
          unlockedModules: student.unlockedModules.filter(id => id !== moduleId),
          completedModules: student.completedModules.filter(id => id !== moduleId),
          progress: restProgress,
          assessments: restAssessments,
        };
      }
      return student;
    }));
  };

  const unlockModuleForStudent = (studentId, moduleId) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId && !student.unlockedModules.includes(moduleId)) {
        return {
          ...student,
          unlockedModules: [...student.unlockedModules, moduleId],
        };
      }
      return student;
    }));
  };

  const updateStudentDifficulty = (studentId, difficulty) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return { ...student, difficultyLevel: difficulty };
      }
      return student;
    }));
  };

  const addDummyStudent = () => {
    const names = ['Oliver Smith', 'Ava Brown', 'Liam Davis', 'Isabella Wilson', 'Noah Garcia', 'Mia Martinez'];
    const grades = ['6th Grade', '7th Grade', '8th Grade', '9th Grade'];
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomGrade = grades[Math.floor(Math.random() * grades.length)];
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    const newStudent = {
      id: `student-${Date.now()}`,
      name: randomName,
      email: `${randomName.toLowerCase().replace(' ', '.')}@school.edu`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomName.replace(' ', '')}`,
      grade: randomGrade,
      difficultyLevel: randomDifficulty,
      assignedModules: ['module-1'],
      completedModules: [],
      unlockedModules: ['module-1'],
      points: 0,
      badges: [],
      assessments: {},
      progress: { 'module-1': 0 },
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const deleteStudent = (studentId) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  // Module functions
  const addModule = (moduleData) => {
    const newModule = {
      ...moduleData,
      id: `module-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isPublished: true,
    };
    setModules(prev => [...prev, newModule]);
    return newModule;
  };

  const updateModule = (moduleId, updates) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        return { ...module, ...updates };
      }
      return module;
    }));
  };

  const deleteModule = (moduleId) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
    // Also remove from all students
    setStudents(prev => prev.map(student => ({
      ...student,
      assignedModules: student.assignedModules.filter(id => id !== moduleId),
      unlockedModules: student.unlockedModules.filter(id => id !== moduleId),
      completedModules: student.completedModules.filter(id => id !== moduleId),
    })));
  };

  const addDummyModule = () => {
    const titles = [
      'Recursion Fundamentals',
      'Binary Search Trees',
      'Graph Traversal',
      'Dynamic Programming Intro',
      'Web APIs Basics',
      'Database Design'
    ];
    const categories = ['Algorithms', 'Data Structures', 'Web Development', 'Mathematics'];
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    const icons = ['🧮', '🌲', '🕸️', '📐', '🌐', '💾'];
    const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4'];

    const randomIndex = Math.floor(Math.random() * titles.length);
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    const newModule = {
      id: `module-${Date.now()}`,
      title: titles[randomIndex],
      description: `Learn the fundamentals of ${titles[randomIndex].toLowerCase()} through interactive lessons and exercises.`,
      category: randomCategory,
      difficulty: randomDifficulty,
      estimatedTime: `${30 + Math.floor(Math.random() * 45)} min`,
      skills: ['Core Concepts', 'Problem Solving', 'Application'],
      icon: icons[randomIndex],
      color: colors[randomIndex],
      lessons: [
        {
          id: `lesson-${Date.now()}-1`,
          title: 'Introduction',
          content: 'Welcome to this module. Let\'s explore the core concepts together.',
          type: 'concept',
          duration: '10 min',
        },
      ],
      exercises: [
        {
          id: `exercise-${Date.now()}-1`,
          title: 'Quick Check',
          type: 'multiple-choice',
          question: 'What is the main topic of this module?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0,
          explanation: 'This is a placeholder exercise.',
          difficulty: randomDifficulty,
          points: 10,
        },
      ],
      preAssessment: {
        id: `pre-${Date.now()}`,
        questions: [
          {
            id: 'q1',
            question: 'Sample pre-assessment question?',
            options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
            correctAnswer: 0,
          },
        ],
      },
      postAssessment: {
        id: `post-${Date.now()}`,
        questions: [
          {
            id: 'q1',
            question: 'Sample post-assessment question?',
            options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
            correctAnswer: 0,
          },
        ],
      },
      createdAt: new Date().toISOString().split('T')[0],
      isPublished: true,
    };

    setModules(prev => [...prev, newModule]);
    return newModule;
  };

  // Reset data
  const resetAllData = () => {
    setStudents(initialStudents);
    setModules(initialModules);
    localStorage.removeItem('students');
    localStorage.removeItem('modules');
  };

  const value = {
    // State
    userRole,
    setUserRole,
    currentStudentId,
    setCurrentStudentId,
    currentStudent,
    students,
    modules,
    badges,

    // Student actions
    updateStudentProgress,
    recordAssessment,
    assignModuleToStudent,
    unassignModuleFromStudent,
    unlockModuleForStudent,
    updateStudentDifficulty,
    addDummyStudent,
    deleteStudent,

    // Module actions
    addModule,
    updateModule,
    deleteModule,
    addDummyModule,

    // Utility
    resetAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
