import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [learningOpen, setLearningOpen] = useState(false);
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
            Student Panel
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          
          <a href="/student/dashboard" className={getLinkClasses("/student/dashboard")}>
            <span>Dashboard</span>
          </a>

          <a href="/student/assignments" className={getLinkClasses("/student/assignments")}>
            <span>Assignments</span>
          </a>

          {/* Learning Accordion */}
          <div>
            <button
              onClick={() => setLearningOpen(!learningOpen)}
              className={`w-full flex justify-between items-center p-3 rounded-lg transition-colors duration-200 text-slate-400 hover:bg-slate-800 hover:text-white ${learningOpen ? 'text-white bg-slate-800' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span>Learning Base</span>
              </div>
              <span className={`transform transition-transform duration-200 ${learningOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${learningOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <ul className="pl-4 space-y-1 border-l-2 border-slate-700 ml-4">
                <li><a href="/student/materials" className={getSubLinkClasses("/student/materials")}>Materials</a></li>
                <li><a href="/student/questions" className={getSubLinkClasses("/student/questions")}>Question Platform</a></li>
              </ul>
            </div>
          </div>

          <a href="/student/performance" className={getLinkClasses("/student/performance")}>
            <span>Performance</span>
          </a>

          <a href="/student/attendance" className={getLinkClasses("/student/attendance")}>
            <span>My Attendance</span>
          </a>

          <a href="/student/fees" className={getLinkClasses("/student/fees")}>
            <span>Fees Paid</span>
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
          <h1 className="text-xl font-semibold text-slate-800">Student Dashboard</h1>
          
          <div className="flex items-center gap-4">
             <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                🔔
             </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">Student User</p>
                <p className="text-xs text-slate-400">Class 10</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                <img src="https://ui-avatars.com/api/?name=Student+User&background=0EA5E9&color=fff" alt="Profile" />
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

export default StudentLayout;
