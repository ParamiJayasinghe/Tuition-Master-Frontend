import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/TeacherLayout";

const TeacherDashboard: React.FC = () => {
  const [stats, setStats] = useState([
    { label: "My Students", value: "...", icon: "🎓", trend: "..." },
    { label: "Pending Assignments", value: "...", icon: "📝", trend: "..." },
    { label: "Attendance Rate", value: "...", icon: "📊", trend: "..." },
    { label: "Total Class Fees", value: "...", icon: "💰", trend: "..." },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Students Count
        const studentsResp = await fetch("http://localhost:8080/api/users", { headers });
        const studentsData = await studentsResp.json();
        const studentCount = studentsData.length;

        // 2. Fetch Pending Assignments
        // First get all assignments
        const assignmentsResp = await fetch("http://localhost:8080/api/assignments", { headers });
        const assignmentsData = await assignmentsResp.json();
        
        let pendingCount = 0;
        // For each assignment, fetch its submissions and count unmarked ones
        // This is slightly inefficient but works without backend changes
        await Promise.all(assignmentsData.map(async (assignment: any) => {
          const subResp = await fetch(`http://localhost:8080/api/assignments/${assignment.id}/submissions`, { headers });
          if (subResp.ok) {
            const submissions = await subResp.json();
            pendingCount += submissions.filter((s: any) => !s.isMarked).length;
          }
        }));

        // 3. Fetch Attendance Rate (Today)
        const today = new Date().toISOString().split('T')[0];
        const attendanceResp = await fetch(`http://localhost:8080/api/attendance?date=${today}`, { headers });
        const attendanceData = await attendanceResp.json();
        
        let attendanceRate = "0%";
        if (attendanceData.length > 0) {
          const presentCount = attendanceData.filter((a: any) => a.status === "PRESENT").length;
          const rate = Math.round((presentCount / attendanceData.length) * 100);
          attendanceRate = `${rate}%`;
        }

        // 4. Fetch Total Class Fees (Paid sum)
        const feesResp = await fetch("http://localhost:8080/api/fees?status=PAID", { headers });
        const feesData = await feesResp.json();
        const totalFees = feesData.reduce((sum: number, fee: any) => sum + (fee.amount || 0), 0);

        setStats([
          { label: "My Students", value: studentCount.toString(), icon: "🎓", trend: "Total" },
          { label: "Pending Assignments", value: pendingCount.toString(), icon: "📝", trend: "To Mark" },
          { label: "Attendance Rate", value: attendanceRate, icon: "📊", trend: "Today" },
          { label: "Total Class Fees", value: `Rs. ${totalFees.toLocaleString()}`, icon: "💰", trend: "Paid" },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
                <span className="text-emerald-600 text-sm font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  {stat.trend}
                </span>
                <span className="text-slate-400 text-sm">{stat.label === "Total Class Fees" ? "received" : "overview"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Recent Activity / Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ... remains unchanged but showing context ... */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-glass border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Classes</h3>
            {/* Mock content remains for now as requested only stats update */}
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
          {/* ... */}

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
