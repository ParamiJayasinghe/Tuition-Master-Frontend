import DashboardLayout from "../Layout/AdminLayout";

const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 w-screen text-black">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500">Total Users</p>
          <h3 className="text-3xl font-bold">120</h3>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500">Teachers</p>
          <h3 className="text-3xl font-bold">32</h3>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500">Students</p>
          <h3 className="text-3xl font-bold">340</h3>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
