import React from "react";

const TeacherLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 font-bold text-xl">Teacher Panel</div>
        <ul className="space-y-2 px-4">
          <li><a href="/admin/dashboard" className="block p-2 hover:bg-gray-200 rounded">Dashboard</a></li>
          <li><a href="/admin/users" className="block p-2 hover:bg-gray-200 rounded">Users</a></li>
          <li><a href="/admin/students" className="block p-2 hover:bg-gray-200 rounded">Students</a></li>
        </ul>
      </aside>

      {/* Page Wrapper */}
      <div className="flex-1 flex flex-col">

        {/* Admin Header */}
        <header className="bg-white shadow p-4">
          <h1 className="text-xl font-semibold">Teacher Dashboard</h1>
        </header>

        {/* Content Section */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default TeacherLayout;
