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
      <div className="w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Student Profiles</h2>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white shadow-glass rounded-xl border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Number</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {student.studentDetails.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {student.studentDetails.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {student.studentDetails.contactNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="text-primary hover:text-emerald-700 font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                     <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                           No students found.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 transform transition-all scale-100 relative">
              
              <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                 <h3 className="text-xl font-bold text-slate-800">Student Details</h3>
                 <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
              </div>

              <div className="space-y-4">
                 <DetailRow label="Full Name" value={selectedStudent.studentDetails.fullName} />
                 <DetailRow label="Student ID" value={selectedStudent.studentDetails.studentId} />
                 <DetailRow label="Email" value={selectedStudent.email} />
                 <DetailRow label="Contact" value={selectedStudent.studentDetails.contactNumber} />
                 <DetailRow label="Subjects" value={selectedStudent.studentDetails.subjects} />
                 <DetailRow label="Date of Birth" value={selectedStudent.studentDetails.dateOfBirth} />
                 <DetailRow label="Gender" value={selectedStudent.studentDetails.gender} />
                 <DetailRow label="Address" value={selectedStudent.studentDetails.address} />
              </div>

              <div className="mt-8 flex justify-end">
                <button
                   onClick={() => setSelectedStudent(null)}
                   className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                   Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
   <div className="grid grid-cols-3 gap-2 py-1">
      <span className="text-sm font-semibold text-slate-500 text-right pr-2">{label}:</span>
      <span className="text-sm text-slate-800 font-medium col-span-2">{value || "—"}</span>
   </div>
);

export default StudentProfile;
