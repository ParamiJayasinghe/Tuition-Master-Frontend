import { useEffect, useState } from "react";
import TeacherLayout from "../../Layout/TeacherLayout";

interface Assignment {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  dueDate: string;
  grade: string;
  subject: string;
}

const ViewAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/assignments", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Assignments</h2>

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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-slate-50/80 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {assignment.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {assignment.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {assignment.grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {assignment.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="text-primary hover:text-emerald-700 font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {assignments.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                           No assignments found.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 transform transition-all scale-100 relative">
              
              <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                 <h3 className="text-xl font-bold text-slate-800">Assignment Details</h3>
                 <button
                    onClick={() => setSelectedAssignment(null)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
              </div>

              <div className="space-y-4">
                 <DetailRow label="Title" value={selectedAssignment.title} />
                 <DetailRow label="Subject" value={selectedAssignment.subject} />
                 <DetailRow label="Grade" value={selectedAssignment.grade} />
                 <DetailRow label="Due Date" value={selectedAssignment.dueDate} />
                 
                 <div className="grid grid-cols-3 gap-2 py-1">
                    <span className="text-sm font-semibold text-slate-500 text-right pr-2">Description:</span>
                    <span className="text-sm text-slate-800 font-medium col-span-2 whitespace-pre-wrap">{selectedAssignment.description || "—"}</span>
                 </div>

                 {selectedAssignment.fileUrl && (
                    <div className="grid grid-cols-3 gap-2 py-1">
                       <span className="text-sm font-semibold text-slate-500 text-right pr-2">File:</span>
                       <a 
                          href={selectedAssignment.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary font-medium col-span-2 hover:underline truncate"
                       >
                          {selectedAssignment.fileUrl}
                       </a>
                    </div>
                 )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                   onClick={() => setSelectedAssignment(null)}
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

export default ViewAssignments;
