import React from "react";
import DashboardLayout from "../../Layout/AdminLayout";

const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="w-screen space-y-6">
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
            <p className="text-slate-500">Welcome back, here is what’s happening today.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              Export Report
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
              + New User
            </button>
          </div>
        </div>

        {/* 2. Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Students", value: "12,540", icon: "👥", trend: "+12%" },
            { label: "Active Teachers", value: "850", icon: "👨‍🏫", trend: "+5%" },
            { label: "Courses Offered", value: "320", icon: "📚", trend: "+8%" },
            { label: "Revenue (M)", value: "$45,200", icon: "💲", trend: "+22%" },
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
                <span className="text-slate-400 text-sm">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Charts & Activity Grid relative to Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Mock Chart Area */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-glass border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Student Enrollment</h3>
              <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-1 outline-none focus:border-primary">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            {/* Visual Mock of a Chart */}
            <div className="h-64 w-full bg-slate-50 rounded-lg flex items-end justify-between px-4 pb-0 overflow-hidden relative group">
               {/* Simple CSS Bar Chart Mock */}
               {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                 <div key={i} className="w-[6%] bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-sm relative group-hover:bg-primary/30" style={{ height: `${h}%` }}></div>
               ))}
               {/* Line overlay mock */}
               <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm pointer-events-none">
                  [Interactive Chart Component Would Go Here]
               </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white p-6 rounded-xl shadow-glass border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { user: "Loreen Smith", action: " Enrolled in Math 101", time: "2 min ago" },
                { user: "Cleva Goveny", action: " Uploaded new syllabus", time: "15 min ago" },
                { user: "Sutven Rixia", action: " Paid tuition fees", time: "1 hr ago" },
                { user: "Baston Huns", action: " Joined as Teacher", time: "3 hrs ago" },
                { user: "Rosh Marneu", action: " Updated profile", time: "5 hrs ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                   <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${activity.user}&background=random`} alt="Avatar" />
                   </div>
                   <div>
                      <p className="text-sm text-slate-800 font-medium">
                        {activity.user}
                        <span className="text-slate-500 font-normal">{activity.action}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                   </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-primary text-sm font-medium hover:bg-primary/5 rounded-lg transition-colors">
              View All History
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
