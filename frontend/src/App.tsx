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
import Attendance from "./Components/Pages/Teacher/Attendance";
import ClassFee from "./Components/Pages/Teacher/ClassFee";
import Performance from "./Components/Pages/Teacher/Performance";
import QnA from "./Components/Pages/Teacher/QnA";
import AuditLogs from "./Components/Pages/Teacher/AuditLogs";

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
      <Route path="/teacher/attendance" element={<Attendance />} />
      <Route path="/teacher/class-fee" element={<ClassFee />} />
      <Route path="/teacher/performance" element={<Performance />} />
      <Route path="/teacher/qna" element={<QnA />} />
      <Route path="/teacher/audit-logs" element={<AuditLogs />} />
    </Routes>
  );
}

export default App;
