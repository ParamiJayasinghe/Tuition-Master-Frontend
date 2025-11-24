import React from "react";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-4 text-black">Dashboard</h2>
        <ul className="space-y-3">
          <li><a className="text-gray-700 hover:text-blue-600" href="/admin">Admin</a></li>
          <li><a className="text-gray-700 hover:text-blue-600" href="/teacher">Teacher</a></li>
          <li><a className="text-gray-700 hover:text-blue-600" href="/student">Student</a></li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4">
          <h1 className="text-lg font-semibold text-black">Dashboard</h1>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
