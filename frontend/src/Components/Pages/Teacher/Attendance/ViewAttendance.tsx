import { useState } from "react";
import TeacherLayout from "../../../Layout/TeacherLayout";
import AttendanceFilters from "./AttendanceFilters";
import type { Attendance } from "./types";
import { authFetch } from "../../../../utils/AuthFetch";

const ViewAttendance = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [filters, setFilters] = useState({
    grade: "",
    subject: "",
    date: "",
  });

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams(filters as any).toString();

      const data = await authFetch(
        `http://localhost:8080/api/attendance?${params}`,
        { method: "GET" }
      );

      setAttendance(
        data.filter(
          (a: Attendance) =>
            a.status === "PRESENT" || a.status === "ABSENT"
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TeacherLayout>
      <div className="w-full animate-fade-in-up">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">View Attendance</h2>

        <AttendanceFilters
          filters={filters}
          setFilters={setFilters}
          onSearch={fetchAttendance}
        />

        {attendance.length > 0 ? (
           <div className="bg-white shadow-glass rounded-xl border border-slate-100 overflow-hidden">
             <table className="min-w-full divide-y divide-slate-200">
               <thead className="bg-slate-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                   <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-slate-200">
                 {attendance.map((a) => (
                   <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{a.studentName}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                         a.status === "PRESENT" 
                           ? "bg-emerald-100 text-emerald-700" 
                           : "bg-rose-100 text-rose-700"
                       }`}>
                         {a.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        ) : (
           <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-500">
              No attendance records found.
           </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default ViewAttendance;
