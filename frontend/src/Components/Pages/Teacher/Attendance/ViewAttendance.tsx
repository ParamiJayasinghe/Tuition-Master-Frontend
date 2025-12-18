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
      <h2 className="text-black w-screen text-2xl font-semibold mb-4">View Attendance</h2>

      <AttendanceFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchAttendance}
      />

      <table className="w-full border text-black">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Student</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a) => (
            <tr key={a.id}>
              <td className="p-2 border">{a.studentName}</td>
              <td className="p-2 border font-semibold">
                {a.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TeacherLayout>
  );
};

export default ViewAttendance;
