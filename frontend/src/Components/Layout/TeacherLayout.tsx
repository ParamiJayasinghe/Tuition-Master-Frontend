import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const TeacherLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [assignmentsOpen, setAssignmentsOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const location = useLocation();

  // Helper for active link styling
  const getLinkClasses = (pathUrl: string) => {
    const isActive = location.pathname === pathUrl;
    return `block p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
      isActive
        ? "bg-primary/10 text-primary font-medium"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;
  };

  const getSubLinkClasses = (pathUrl: string) => {
    const isActive = location.pathname === pathUrl;
    return `block py-2 pl-4 text-sm transition-colors ${
      isActive ? "text-primary font-medium" : "text-slate-400 hover:text-primary"
    }`;
  };

  return (
    <div className="flex h-screen bg-background font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-secondary flex flex-col shadow-xl z-20 transition-all duration-300">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
           <div className="text-white font-bold text-xl tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">TM</span>
            Teacher Panel
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          
          <a href="/teacher/dashboard" className={getLinkClasses("/teacher/dashboard")}>
            <span>Dashboard</span>
          </a>

          {/* Students Accordion */}
          <div>
            <button
              onClick={() => setStudentsOpen(!studentsOpen)}
              className={`w-full flex justify-between items-center p-3 rounded-lg transition-colors duration-200 text-slate-400 hover:bg-slate-800 hover:text-white ${studentsOpen ? 'text-white bg-slate-800' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span>Students</span>
              </div>
              <span className={`transform transition-transform duration-200 ${studentsOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${studentsOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <ul className="pl-4 space-y-1 border-l-2 border-slate-700 ml-4">
                <li><a href="/teacher/students/add" className={getSubLinkClasses("/teacher/students/add")}>Add Students</a></li>
                <li><a href="/teacher/students" className={getSubLinkClasses("/teacher/students")}>Student Profiles</a></li>
              </ul>
            </div>
          </div>

          {/* Assignments Accordion */}
          <div>
            <button
              onClick={() => setAssignmentsOpen(!assignmentsOpen)}
              className={`w-full flex justify-between items-center p-3 rounded-lg transition-colors duration-200 text-slate-400 hover:bg-slate-800 hover:text-white ${assignmentsOpen ? 'text-white bg-slate-800' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span>Assignments</span>
              </div>
              <span className={`transform transition-transform duration-200 ${assignmentsOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${assignmentsOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <ul className="pl-4 space-y-1 border-l-2 border-slate-700 ml-4">
                <li><a href="/teacher/assignments/add" className={getSubLinkClasses("/teacher/assignments/add")}>Add Assignment</a></li>
                <li><a href="/teacher/assignments" className={getSubLinkClasses("/teacher/assignments")}>View Assignments</a></li>
              </ul>
            </div>
          </div>

          {/* Materials Accordion */}
          <div>
            <button
              onClick={() => setMaterialsOpen(!materialsOpen)}
              className={`w-full flex justify-between items-center p-3 rounded-lg transition-colors duration-200 text-slate-400 hover:bg-slate-800 hover:text-white ${materialsOpen ? 'text-white bg-slate-800' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span>Materials</span>
              </div>
              <span className={`transform transition-transform duration-200 ${materialsOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${materialsOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <ul className="pl-4 space-y-1 border-l-2 border-slate-700 ml-4">
                <li><a href="/teacher/materials/add" className={getSubLinkClasses("/teacher/materials/add")}>Add Material</a></li>
                <li><a href="/teacher/materials" className={getSubLinkClasses("/teacher/materials")}>View Materials</a></li>
              </ul>
            </div>
          </div>

          <a href="/teacher/attendance" className={getLinkClasses("/teacher/attendance")}>
            <span>Attendance</span>
          </a>

          <a href="/teacher/class-fee" className={getLinkClasses("/teacher/class-fee")}>
            <span>Class Fee</span>
          </a>

          <a href="/teacher/performance" className={getLinkClasses("/teacher/performance")}>
            <span>Performance</span>
          </a>

          <a href="/teacher/qna" className={getLinkClasses("/teacher/qna")}>
            <span>Q & A</span>
          </a>

          <a href="/teacher/audit-logs" className={getLinkClasses("/teacher/audit-logs")}>
            <span>Audit Logs</span>
          </a>

        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500 text-center">
          v1.0.0 Tuition Master
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">Teacher Dashboard</h1>
          
          <div className="flex items-center gap-4">
             <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                🔔
             </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">Teacher User</p>
                <p className="text-xs text-slate-400">Instructor</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                <img src="https://ui-avatars.com/api/?name=Teacher+User&background=10B981&color=fff" alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-background scroll-smooth">
          <div className="w-full mx-auto animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
