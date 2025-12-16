import { useEffect, useState } from "react";
import TeacherLayout from "../../Layout/TeacherLayout";

interface StudentDetails {
  fullName: string;
  studentId: string;
  contactNumber: string;
  subjects: string;
  dateOfBirth: string;
  address: string;
  gender: string;
}

interface Student {
  id: number;
  email: string;
  role: string;
  studentDetails: StudentDetails;
}

const StudentProfile = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      const studentOnly = data.filter(
        (user: Student) => user.role === "STUDENT"
      );

      setStudents(studentOnly);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="bg-white p-6 rounded shadow w-screen text-black">
        <h2 className="text-2xl font-semibold mb-6">Student Profiles</h2>

        {loading ? (
          <p>Loading students...</p>
        ) : (
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Student ID</th>
                <th className="border p-2 text-left">Student Name</th>
                <th className="border p-2 text-left">Contact Number</th>
                <th className="border p-2 text-center">View More</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {student.studentDetails.studentId}
                  </td>
                  <td className="border p-2">
                    {student.studentDetails.fullName}
                  </td>
                  <td className="border p-2">
                    {student.studentDetails.contactNumber}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-full max-w-lg relative">
              <h3 className="text-xl font-semibold mb-4">
                Student Details
              </h3>

              <div className="space-y-2 text-sm">
                <p><strong>Full Name:</strong> {selectedStudent.studentDetails.fullName}</p>
                <p><strong>Student ID:</strong> {selectedStudent.studentDetails.studentId}</p>
                <p><strong>Email:</strong> {selectedStudent.email}</p>
                <p><strong>Contact:</strong> {selectedStudent.studentDetails.contactNumber}</p>
                <p><strong>Subjects:</strong> {selectedStudent.studentDetails.subjects}</p>
                <p><strong>Date of Birth:</strong> {selectedStudent.studentDetails.dateOfBirth}</p>
                <p><strong>Gender:</strong> {selectedStudent.studentDetails.gender}</p>
                <p><strong>Address:</strong> {selectedStudent.studentDetails.address}</p>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default StudentProfile;
