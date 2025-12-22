import React from "react";
import DashboardLayout from "../../Layout/TeacherLayout";

const TeacherDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="w-full space-y-6 animate-fade-in-up">
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">My Dashboard</h2>
            <p className="text-slate-500">Overview of your classes and student performance.</p>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              View Schedule
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
              + Create Assignment
            </button>
          </div>
        </div>

        {/* 2. Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "My Students", value: "145", icon: "🎓", trend: "+12%" },
            { label: "Active Classes", value: "4", icon: "🏫", trend: "Now" },
            { label: "Pending Assignments", value: "24", icon: "📝", trend: "High" },
            { label: "Attendance Rate", value: "92%", icon: "📊", trend: "+2%" },
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-glass border border-slate-100 hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-emerald-600 text-sm font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  {stat.trend}
                </span>
                <span className="text-slate-400 text-sm">vs last week</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Recent Activity / Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upcoming Classes Mock */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-glass border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Classes</h3>
            <div className="space-y-3">
               {[
                 { subject: "Mathematics - Grade 10", time: "10:00 AM - 11:30 AM", room: "Room A1" },
                 { subject: "Science - Grade 9", time: "01:00 PM - 02:30 PM", room: "Lab 2" },
                 { subject: "Mathematics - Grade 11", time: "03:00 PM - 05:00 PM", room: "Room B4" },
               ].map((cls, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-primary/30 transition-colors">
                    <div>
                       <h4 className="font-semibold text-slate-800">{cls.subject}</h4>
                       <p className="text-sm text-slate-500">Room: {cls.room}</p>
                    </div>
                    <div className="text-right">
                       <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600">
                         {cls.time}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Quick Actions / Notifications */}
          <div className="bg-white p-6 rounded-xl shadow-glass border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Notifications</h3>
            <div className="space-y-4">
              {[
                { text: "Admin approved new syllabus", time: "2 hrs ago" },
                { text: "System maintenance at midnight", time: "5 hrs ago" },
                { text: "New student enrollment: John D.", time: "1 day ago" },
              ].map((note, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                  <div>
                    <p className="text-sm text-slate-700">{note.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{note.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
               View All Notifications
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
