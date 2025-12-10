import React, { useEffect, useState } from "react";
import AdminLayout from "../../Layout/AdminLayout";
import TeacherProfileModal from "./TeacherProfileModal";

interface Teacher {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  teacherDetails: {
    fullName: string;
    teacherId: string;
    contactNumber: string;
    subjects: string;
    gender: string;
    nicNumber: string;
    createdAt: string;
  };
}

const TeacherProfiles: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const data: Teacher[] = await res.json();

      // Filter only teachers (backend returns all users)
      const teacherUsers = data.filter(
        (user) => user.role === "TEACHER" && user.teacherDetails
      );

      setTeachers(teacherUsers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-screen">
        <h2 className="text-2xl font-bold mb-6 text-black">Teacher Profiles</h2>

        {loading && <p>Loading teachers...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && teachers.length > 0 && (
          <div className="overflow-x-auto bg-white shadow rounded">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border text-black">Teacher ID</th>
                  <th className="p-3 border text-black">Full Name</th>
                  <th className="p-3 border text-black">Email</th>
                  <th className="p-3 border text-black">Subjects</th>
                  <th className="p-3 border text-black">Status</th>
                  <th className="p-3 border text-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="text-center text-black">
                    <td className="p-3 border">
                      {teacher.teacherDetails.teacherId}
                    </td>
                    <td className="p-3 border">
                      {teacher.teacherDetails.fullName}
                    </td>
                    <td className="p-3 border">{teacher.email}</td>
                    <td className="p-3 border">
                      {teacher.teacherDetails.subjects}
                    </td>
                    <td className="p-3 border">
                      {teacher.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="p-3 border">
                      <button
                        onClick={() => setSelectedTeacher(teacher)}
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {selectedTeacher && (
          <TeacherProfileModal
            teacher={selectedTeacher}
            onClose={() => setSelectedTeacher(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default TeacherProfiles;
