import DashboardLayout from "../Layout/StudentLayout";

const StudentDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 w-screen text-black">Student Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500">Subjects Enrolled</p>
          <h3 className="text-3xl font-bold">6</h3>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500">Assignments Due</p>
          <h3 className="text-3xl font-bold">3</h3>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
