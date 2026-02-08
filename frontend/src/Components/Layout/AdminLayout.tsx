import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teachersOpen, setTeachersOpen] = useState(false);
  const location = useLocation();

  // Helper for active link styling
  const getLinkClasses = (path: string) => {
    const isActive = location.pathname === path;
    return `block p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
			Tuition Master
		   </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          
          <a href="/admin/dashboard" className={getLinkClasses("/admin/dashboard")}>
            <span>Dashboard</span>
          </a>

          <a href="/admin/bulk-upload-users" className={getLinkClasses("/admin/bulk-upload-users")}>
            <span>Bulk Upload</span>
          </a>

          {/* Teachers Accordion */}
          <div>
            <button
              onClick={() => setTeachersOpen(!teachersOpen)}
              className={`w-full flex justify-between items-center p-3 rounded-lg transition-colors duration-200 text-slate-400 hover:bg-slate-800 hover:text-white ${teachersOpen ? 'text-white bg-slate-800' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span>Teachers</span>
              </div>
              <span className={`transform transition-transform duration-200 ${teachersOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${teachersOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <ul className="pl-4 space-y-1 border-l-2 border-slate-700 ml-4">
                <li>
                  <a href="/admin/add-teacher" className="block py-2 pl-4 text-sm text-slate-400 hover:text-primary transition-colors">
                    Add Teachers
                  </a>
                </li>
                <li>
                  <a href="/admin/teachers/profiles" className="block py-2 pl-4 text-sm text-slate-400 hover:text-primary transition-colors">
                    Teacher Profiles
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <a href="/admin/audit-logs" className={getLinkClasses("/admin/audit-logs")}>
            <span>Audit Logs</span>
          </a>

        </nav>

        {/* Sidebar Footer (optional) */}
        <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500 text-center">
          v1.0.0 Tuition Master
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">Admin Dashboard</h1>
          
          <div className="flex items-center gap-4">
			{/* Notifications (Mock) */}
			<button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
				<span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
				🔔
			</button>

            {/* Profile Dropdown (Mock) */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">Admin User</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=10B981&color=fff" alt="Profile" />
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

export default AdminLayout;
