import { useEffect, useState } from "react";
import StudentLayout from "../../Layout/StudentLayout";
import { authFetch } from "../../../utils/AuthFetch";
import type { Attendance } from "../Teacher/Attendance/types";
import DateRangePicker from "../../Common/DateRangePicker";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    subject: "",
    dateFrom: "",
    dateTo: "",
  });

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await authFetch(
        `http://localhost:8080/api/attendance/my-attendance`,
        { method: "GET" }
      );
      setAttendance(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filteredAttendance = attendance.filter((a) => {
    // Debug logging for developers to check data if it doesn't show up
    console.log("Checking record:", a);
    
    const subject = a.subject || "";
    const matchesSubject = !filters.subject || subject.toLowerCase().includes(filters.subject.toLowerCase());
    const matchesDateFrom = !filters.dateFrom || (a.date && new Date(a.date) >= new Date(filters.dateFrom));
    const matchesDateTo = !filters.dateTo || (a.date && new Date(a.date) <= new Date(filters.dateTo));
    
    return matchesSubject && matchesDateFrom && matchesDateTo;
  });

  const stats = {
    total: filteredAttendance.length,
    present: filteredAttendance.filter((a) => a.status === "PRESENT").length,
    absent: filteredAttendance.filter((a) => a.status === "ABSENT").length,
  };

  const attendancePercentage = stats.total > 0 
    ? ((stats.present / stats.total) * 100).toFixed(1) 
    : "0.0";

  return (
    <StudentLayout>
      <div className="w-full animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">My Attendance</h2>
            <p className="text-slate-500 mt-1">Track your presence and consistency</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-primary/10 rounded-lg border border-primary/20 text-primary font-semibold">
                Overall: {attendancePercentage}%
             </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-100 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 animate-shake">
            <span className="text-xl">⚠️</span>
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl">
              📊
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Classes</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.total}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-xl">
              ✅
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Present</p>
              <h3 className="text-2xl font-bold text-slate-800 text-emerald-600">{stats.present}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 text-xl">
              ❌
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Absent</p>
              <h3 className="text-2xl font-bold text-slate-800 text-rose-600">{stats.absent}</h3>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
              <input 
                type="text" 
                placeholder="Search subject..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
              />
            </div>
            <DateRangePicker 
              startDate={filters.dateFrom}
              endDate={filters.dateTo}
              onChange={(start: string, end: string) => setFilters({...filters, dateFrom: start, dateTo: end})}
              label="Filter by Date Range"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-glass rounded-2xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading attendance records...</div>
          ) : filteredAttendance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                  {filteredAttendance.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                           <span className="text-sm font-semibold text-slate-700">{new Date(a.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                           <span className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wide">
                          {a.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          a.status === "PRESENT" 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-rose-100 text-rose-700"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${a.status === 'PRESENT' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
               <div className="text-4xl mb-4">🔍</div>
               <h3 className="text-lg font-bold text-slate-800">No records found</h3>
               <p className="text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentAttendance;
