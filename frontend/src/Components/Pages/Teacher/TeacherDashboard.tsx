import DashboardLayout from "../../Layout/TeacherLayout";

const TeacherDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 w-screen text-black">Teacher Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500">Total Students</p>
          <h3 className="text-3xl font-bold">45</h3>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500">Classes Today</p>
          <h3 className="text-3xl font-bold">4</h3>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
