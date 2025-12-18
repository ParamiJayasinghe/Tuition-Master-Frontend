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

  const markStatus = async (id: number, status: "PRESENT" | "ABSENT") => {
    try {
      await authFetch("http://localhost:8080/api/attendance", {
        method: "POST",
        body: JSON.stringify({ id, status }),
      });

      fetchAttendance();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <TeacherLayout>
      <h2 className="w-screen text-2xl font-semibold mb-4 text-black">
        Mark Attendance
      </h2>

      <AttendanceFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchAttendance}
      />

      <table className="w-full border text-black">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Student</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a) => (
            <tr key={`${a.studentId}-${a.date}`}>
              <td className="p-2 border">{a.studentName}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => markStatus(a.studentId, "PRESENT")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Present
                </button>
                <button
                  onClick={() => markStatus(a.studentId, "ABSENT")}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Absent
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TeacherLayout>
  );
};

export default MarkAttendance;
