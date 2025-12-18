import { useNavigate } from "react-router-dom";
import TeacherLayout from "../../../Layout/TeacherLayout";

const AttendanceHome = () => {
  const navigate = useNavigate();

  return (
    <TeacherLayout>
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <button
          onClick={() => navigate("/teacher/attendance/mark")}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700"
        >
          Mark Attendance
        </button>

        <button
          onClick={() => navigate("/teacher/attendance/view")}
          className="px-8 py-4 bg-green-600 text-white rounded-lg text-lg hover:bg-green-700"
        >
          View Attendance
        </button>
      </div>
    </TeacherLayout>
  );
};

export default AttendanceHome;
