import { Routes, Route } from "react-router-dom";
import SignIn from "./Components/SignIn";
import AdminDashboard from "./Components/Pages/Admin/AdminDashboard";
import TeacherDashboard from "./Components/Pages/Teacher/TeacherDashboard";
import StudentDashboard from "./Components/Pages/Student/StudentDashboard";
import AddTeacher from "./Components/Pages/Admin/AddTeacher";
import TeacherProfiles from "./Components/Pages/Admin/TeacherProfiles";
import AddStudent from "./Components/Pages/Teacher/AddStudent";
import StudentProfiles from "./Components/Pages/Teacher/StudentProfile";
import AddAssignment from "./Components/Pages/Teacher/AddAssignment";
import ViewAssignments from "./Components/Pages/Teacher/ViewAssignment";
import AttendanceHome from "./Components/Pages/Teacher/Attendance/AttendanceHome";
import MarkAttendance from "./Components/Pages/Teacher/Attendance/MarkAttendance"
import ViewAttendance from "./Components/Pages/Teacher/Attendance/ViewAttendance";
import ClassFee from "./Components/Pages/Teacher/ClassFee";
import Performance from "./Components/Pages/Teacher/Performance";
import QnA from "./Components/Pages/Teacher/QnA";
import AuditLogs from "./Components/Pages/Teacher/AuditLogs";
import StudentPerformance from "./Components/Pages/Student/StudentPerformance";
import StudentAssignments from "./Components/Pages/Student/StudentAssignment";
import StudentMaterials from "./Components/Pages/Student/StudentMaterial";
import StudentQuestions from "./Components/Pages/Student/StudentQuestions";
import StudentAttendance from "./Components/Pages/Student/StudentAttendance";
import StudentFees from "./Components/Pages/Student/StudentFee";

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/add-teacher" element={<AddTeacher />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/admin/teachers/profiles" element={<TeacherProfiles />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher/students/add" element={<AddStudent />} />
      <Route path="/teacher/students" element={<StudentProfiles />} />
      <Route path="/teacher/assignments/add" element={<AddAssignment />} />
      <Route path="/teacher/assignments" element={<ViewAssignments />} />
      <Route path="/teacher/attendance" element={<AttendanceHome />} />
      <Route path="/teacher/attendance/mark" element={<MarkAttendance />} />
<Route path="/teacher/attendance/view" element={<ViewAttendance />} />
      <Route path="/teacher/class-fee" element={<ClassFee />} />
      <Route path="/teacher/performance" element={<Performance />} />
      <Route path="/teacher/qna" element={<QnA />} />
      <Route path="/teacher/audit-logs" element={<AuditLogs />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/performance" element={<StudentPerformance />} />
      <Route path="/student/assignments" element={<StudentAssignments />} />
      <Route path="/student/materials" element={<StudentMaterials />} />
      <Route path="/student/questions" element={<StudentQuestions />} />
      <Route path="/student/attendance" element={<StudentAttendance />} />
      <Route path="/student/fees" element={<StudentFees />} />
    </Routes>
  );
}

export default App;
