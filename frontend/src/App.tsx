import { Routes, Route } from "react-router-dom";
import SignIn from "./Components/SignIn";
import AdminDashboard from "./Components/Pages/AdminDashboard";
import TeacherDashboard from "./Components/Pages/TeacherDashboard";
import StudentDashboard from "./Components/Pages/StudentDashboard";

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
    </Routes>
  );
}

export default App;
