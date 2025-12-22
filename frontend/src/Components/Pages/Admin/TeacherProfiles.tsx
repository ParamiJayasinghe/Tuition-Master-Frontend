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
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6 text-black">Teacher Profiles</h2>

        {loading && <p>Loading teachers...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && teachers.length > 0 && (
          <div className="bg-white shadow-glass rounded-xl border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Teacher ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subjects</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {teacher.teacherDetails.teacherId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {teacher.teacherDetails.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {teacher.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {teacher.teacherDetails.subjects}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {teacher.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedTeacher(teacher)}
                          className="text-primary hover:text-emerald-700 font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
