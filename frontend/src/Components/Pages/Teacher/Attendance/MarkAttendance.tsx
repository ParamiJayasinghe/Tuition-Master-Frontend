import { useEffect, useState } from "react";
import TeacherLayout from "../../../Layout/TeacherLayout";
import AttendanceFilters from "./AttendanceFilters";
import type { Attendance } from "./types";
import { authFetch } from "../../../../utils/AuthFetch";

const MarkAttendance = () => {
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

      setAttendance(data.filter((a: Attendance) => a.status === "NONE"));
    } catch (error) {
      console.error(error);
    }
  };

  const markStatus = async (
    studentId: number,
    studentName: string,
    status: "PRESENT" | "ABSENT"
  ) => {

    try {
      const payload = [
        {
          studentId,
          studentName,
          date: filters.date,
          subject: filters.subject,
          status,
        },
      ];

      await authFetch("http://localhost:8080/api/attendance", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      fetchAttendance();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <TeacherLayout>
      <div className="w-screen animate-fade-in-up">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Mark Attendance
        </h2>

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
                   <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Mark Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {attendance.map((a) => (
                  <tr key={`${a.studentId}-${a.date}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                       {a.studentName}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                       #{a.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                      <button
                        onClick={() =>
                          markStatus(a.studentId, a.studentName, "PRESENT")
                        }
                        className="px-4 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-full text-xs font-bold transition-all uppercase tracking-wide"
                      >
                        Present
                      </button>

                      <button
                        onClick={() =>
                          markStatus(a.studentId, a.studentName, "ABSENT")
                        }
                        className="px-4 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white rounded-full text-xs font-bold transition-all uppercase tracking-wide"
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-500">
             No students found for attendance marking. Please refine your search.
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default MarkAttendance;
