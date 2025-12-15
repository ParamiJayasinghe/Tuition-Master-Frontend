import React from "react";

const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Student Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 font-bold text-xl border-b">
          Student Panel
        </div>

        <nav className="p-4 space-y-2 text-sm">
          <a
            href="/student/dashboard"
            className="block p-2 rounded hover:bg-gray-200 font-medium"
          >
            Dashboard
          </a>

          <a
            href="/student/performance"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Performance
          </a>

          <a
            href="/student/assignments"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Assignments
          </a>

          <a
            href="/student/materials"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Materials
          </a>

          <a
            href="/student/questions"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Question Platform
          </a>

          <a
            href="/student/attendance"
            className="block p-2 rounded hover:bg-gray-200"
          >
            My Attendance
          </a>

          <a
            href="/student/fees"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Fees Paid
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        <header className="bg-white shadow p-4">
          <h1 className="text-xl font-semibold">Student Dashboard</h1>
        </header>

        <main className="p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default StudentLayout;
