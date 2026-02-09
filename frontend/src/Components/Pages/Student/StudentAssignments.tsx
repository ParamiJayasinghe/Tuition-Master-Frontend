import { useEffect, useState } from "react";
import StudentLayout from "../../Layout/StudentLayout";

interface Assignment {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  dueDate: string;
  grade: string;
  subject: string;
  createdBy: string;
}

const StudentAssignments = () => {
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
    <StudentLayout>
      <div className="w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">My Assignments</h2>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-xl shadow-glass border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                 <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                       <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wide">
                          {assignment.subject}
                       </span>
                       <span className="text-xs text-slate-400 font-medium">
                          Due: {assignment.dueDate}
                       </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{assignment.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                       {assignment.description || "No description provided."}
                    </p>
                    
                    <div className="text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50">
                       Posted by: <span className="text-slate-600 font-medium">{assignment.createdBy}</span>
                    </div>
                 </div>
                 
                 <div className="bg-slate-50 p-4 border-t border-slate-100">
                    <button
                       onClick={() => setSelectedAssignment(assignment)}
                       className="w-full py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                    >
                       View Details
                    </button>
                 </div>
              </div>
            ))}
            
            {assignments.length === 0 && (
               <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-100 border-dashed">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-lg font-medium text-slate-800">All caught up!</h3>
                  <p className="text-slate-500">No pending assignments found for your subjects.</p>
               </div>
            )}
          </div>
        )}

        {/* Details Modal */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 transform transition-all scale-100 relative max-h-[90vh] overflow-y-auto">
              
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
                 <div className="grid grid-cols-3 gap-2 py-1">
                    <span className="text-sm font-semibold text-slate-500 text-right pr-2">Title:</span>
                    <span className="text-sm text-slate-800 font-medium col-span-2">{selectedAssignment.title}</span>
                 </div>
                 <div className="grid grid-cols-3 gap-2 py-1">
                    <span className="text-sm font-semibold text-slate-500 text-right pr-2">Subject:</span>
                    <span className="text-sm text-slate-800 font-medium col-span-2">{selectedAssignment.subject}</span>
                 </div>
                 <div className="grid grid-cols-3 gap-2 py-1">
                    <span className="text-sm font-semibold text-slate-500 text-right pr-2">Due Date:</span>
                    <span className="text-sm text-slate-800 font-medium col-span-2">{selectedAssignment.dueDate}</span>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-2 py-1">
                    <span className="text-sm font-semibold text-slate-500 text-right pr-2">Description:</span>
                    <span className="text-sm text-slate-800 font-medium col-span-2 whitespace-pre-wrap">{selectedAssignment.description || "—"}</span>
                 </div>

                 {selectedAssignment.fileUrl && (
                    <div className="mt-4">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-slate-500">Attachment:</span>
                          <a 
                             href={selectedAssignment.fileUrl} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-full font-medium transition-colors flex items-center gap-2"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                             </svg>
                             Open PDF
                          </a>
                       </div>
                       
                       <div className="border border-slate-200 rounded-lg overflow-hidden h-64 bg-slate-50 flex items-center justify-center relative group">
                          <iframe 
                             src={selectedAssignment.fileUrl} 
                             className="w-full h-full"
                             title="PDF Preview"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                       </div>
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
    </StudentLayout>
  );
};

export default StudentAssignments;
