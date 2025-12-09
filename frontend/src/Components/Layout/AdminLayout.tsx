import React from "react";
import { useState } from "react";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teachersOpen, setTeachersOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 font-bold text-xl">Admin Panel</div>
        <ul className="space-y-2 px-4">

          <li>
            <a 
              href="/admin/dashboard" 
              className="block p-2 hover:bg-gray-200 rounded"
            >
              Admin Dashboard
            </a>
          </li>

          <li>
            <a 
              href="/admin/bulk-upload-users" 
              className="block p-2 hover:bg-gray-200 rounded"
            >
              Bulk Upload Users
            </a>
          </li>

          {/* Teachers Accordion */}
          <li>
            <button
              onClick={() => setTeachersOpen(!teachersOpen)}
              className="w-full flex justify-between p-2 hover:bg-gray-200 rounded"
            >
              Teachers
              <span>{teachersOpen ? "▲" : "▼"}</span>
            </button>

            {teachersOpen && (
              <ul className="ml-4 mt-2 space-y-1">
                <li>
                  <a 
                    href="/admin/add-teacher" 
                    className="block p-2 hover:bg-gray-200 rounded text-sm"
                  >
                    Add Teachers
                  </a>
                </li>
                <li>
                  <a 
                    href="/admin/teachers/profiles" 
                    className="block p-2 hover:bg-gray-200 rounded text-sm"
                  >
                    Teacher Profiles
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <a 
              href="/admin/audit-logs" 
              className="block p-2 hover:bg-gray-200 rounded"
            >
              Audit Logs
            </a>
          </li>

        </ul>
      </aside>

      {/* Page Wrapper */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white shadow p-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </header>

        {/* Content */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
