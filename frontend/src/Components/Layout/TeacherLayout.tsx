import React from "react";

const TeacherLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Teacher Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 font-bold text-xl border-b">
          Teacher Panel
        </div>

        <nav className="p-4 space-y-4 text-sm">
          <a
            href="/teacher/dashboard"
            className="block p-2 rounded hover:bg-gray-200 font-medium"
          >
            Dashboard
          </a>

          {/* Students */}
          <div>
            <p className="text-gray-500 uppercase text-xs mb-1">Students</p>
            <ul className="space-y-1 ml-2">
              <li>
                <a
                  href="/teacher/students/add"
                  className="block p-2 rounded hover:bg-gray-200"
                >
                  Add Students
                </a>
              </li>
              <li>
                <a
                  href="/teacher/students"
                  className="block p-2 rounded hover:bg-gray-200"
                >
                  Student Profiles
                </a>
              </li>
            </ul>
          </div>

          {/* Assignments */}
          <div>
            <p className="text-gray-500 uppercase text-xs mb-1">Assignments</p>
            <ul className="space-y-1 ml-2">
              <li>
                <a
                  href="/teacher/assignments/add"
                  className="block p-2 rounded hover:bg-gray-200"
                >
                  Add Assignment
                </a>
              </li>
              <li>
                <a
                  href="/teacher/assignments"
                  className="block p-2 rounded hover:bg-gray-200"
                >
                  View Assignments
                </a>
              </li>
            </ul>
          </div>

          {/* Attendance */}
          <a
            href="/teacher/attendance"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Attendance
          </a>

          {/* Class Fee */}
          <a
            href="/teacher/class-fee"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Class Fee
          </a>

          {/* Performance */}
          <a
            href="/teacher/performance"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Performance
          </a>

          {/* Q & A */}
          <a
            href="/teacher/qna"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Q &amp; A
          </a>

          {/* Audit Logs */}
          <a
            href="/teacher/audit-logs"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Audit Logs
          </a>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <header className="bg-white shadow p-4">
          <h1 className="text-xl font-semibold">Teacher Dashboard</h1>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default TeacherLayout;
