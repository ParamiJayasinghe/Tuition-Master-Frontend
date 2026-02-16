import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/StudentLayout";

const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState([
    { label: "Subjects Enrolled", value: "...", icon: "📚", trend: "..." },
    { label: "Assignments Due", value: "...", icon: "📝", trend: "..." },
    { label: "Attendance Rate", value: "...", icon: "✅", trend: "..." },
    { label: "Average Grade", value: "...", icon: "🏆", trend: "..." },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Performance (Subjects and Average Grade)
        const perfResp = await fetch("http://localhost:8080/api/performance/me", { headers });
        const perfData = await perfResp.json();
        
        const subjectCount = perfData.subjectPerformances?.length || 0;
        const totalAvg = perfData.subjectPerformances?.length > 0
          ? perfData.subjectPerformances.reduce((acc: number, curr: any) => acc + curr.averageMarks, 0) / perfData.subjectPerformances.length
          : 0;
        
        const getLetterGrade = (marks: number) => {
          if (marks >= 75) return "A";
          if (marks >= 65) return "B";
          if (marks >= 55) return "C";
          if (marks >= 45) return "S";
          return "F";
        };

        // 2. Fetch Assignments Due
        const assignmentsResp = await fetch("http://localhost:8080/api/assignments", { headers });
        const assignmentsData = await assignmentsResp.json();
        const dueCount = assignmentsData.filter((a: any) => !a.isSubmitted && a.isActive).length;

        // 3. Fetch Attendance Rate
        const attendanceResp = await fetch("http://localhost:8080/api/attendance/my-attendance", { headers });
        const attendanceData = await attendanceResp.json();
        
        let attendanceRate = "0%";
        if (attendanceData.length > 0) {
          const presentCount = attendanceData.filter((a: any) => a.status === "PRESENT").length;
          const rate = Math.round((presentCount / attendanceData.length) * 100);
          attendanceRate = `${rate}%`;
        }

        setStats([
          { label: "Subjects Enrolled", value: subjectCount.toString(), icon: "📚", trend: "Active" },
          { label: "Assignments Due", value: dueCount.toString(), icon: "📝", trend: dueCount > 0 ? "Urgent" : "Cleared" },
          { label: "Attendance Rate", value: attendanceRate, icon: "✅", trend: "Overall" },
          { label: "Average Grade", value: getLetterGrade(totalAvg), icon: "🏆", trend: `${Math.round(totalAvg)}%` },
        ]);
      } catch (error) {
        console.error("Error fetching student dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="w-full space-y-6 animate-fade-in-up">
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">My Dashboard</h2>
            <p className="text-slate-500">Welcome back! Here's your learning overview.</p>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              View Schedule
            </button>
          </div>
        </div>

        {/* 2. Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-glass border border-slate-100 hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">
                    {loading ? <span className="animate-pulse">...</span> : stat.value}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${stat.trend === "Urgent" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                  {stat.trend}
                </span>
                <span className="text-slate-400 text-sm">status</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Recent Activity / Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upcoming Classes Mock */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-glass border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
               {[
                 { subject: "Mathematics", time: "10:00 AM - 11:30 AM", room: "Room A1", teacher: "Mr. Smith" },
                 { subject: "Physics", time: "01:00 PM - 02:30 PM", room: "Lab 2", teacher: "Ms. Johnson" },
                 { subject: "English", time: "03:00 PM - 04:30 PM", room: "Room B4", teacher: "Mrs. Davis" },
               ].map((cls, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-primary/30 transition-colors">
                     <div>
                       <h4 className="font-semibold text-slate-800">{cls.subject}</h4>
                       <p className="text-sm text-slate-500">{cls.teacher} • {cls.room}</p>
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
            <h3 className="text-lg font-bold text-slate-800 mb-4">Messages & Alerts</h3>
            <div className="space-y-4">
              {[
                { text: "Math Assignment due tomorrow", time: "2 hrs ago", type: "alert" },
                { text: "Physics class rescheduled", time: "5 hrs ago", type: "info" },
                { text: "New study material added: Biology", time: "1 day ago", type: "success" },
              ].map((note, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <span className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${note.type === 'alert' ? 'bg-rose-500' : 'bg-primary'}`}></span>
                  <div>
                    <p className="text-sm text-slate-700">{note.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{note.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
               View All Messages
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
