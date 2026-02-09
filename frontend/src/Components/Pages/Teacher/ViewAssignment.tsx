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
  isActive: boolean;
}

interface Submission {
  id: number;
  studentName: string;
  submittedAt: string;
  isLate: boolean;
  fileUrl: string;
  answerText: string;
}

const ViewAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Assignment>>({});
  const [editFile, setEditFile] = useState<File | null>(null);

  const [isViewingSubmissions, setIsViewingSubmissions] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

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

  const startEditing = () => {
     if (selectedAssignment) {
        setEditFormData({
           title: selectedAssignment.title,
           description: selectedAssignment.description,
           dueDate: selectedAssignment.dueDate,
           grade: selectedAssignment.grade,
           subject: selectedAssignment.subject,
           fileUrl: selectedAssignment.fileUrl
        });
        setEditFile(null);
        setIsEditing(true);
     }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value } = e.target;
     setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
        setEditFile(e.target.files[0]);
     }
  };

  const handleUpdate = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!selectedAssignment) return;

     try {
        let uploadedFileUrl = editFormData.fileUrl || "";

        // 1. Upload new file if selected
        if (editFile) {
            const uploadFormData = new FormData();
            uploadFormData.append("file", editFile);

            const uploadResponse = await fetch("http://localhost:8080/api/assignments/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: uploadFormData,
            });

            if (!uploadResponse.ok) throw new Error("Failed to upload file");
            uploadedFileUrl = await uploadResponse.text();
        }

        // 2. Update Assignment
        const payload = {
           ...editFormData,
           fileUrl: uploadedFileUrl
        };

        const response = await fetch(`http://localhost:8080/api/assignments/${selectedAssignment.id}`, {
           method: "PUT",
           headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
           },
           body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to update assignment");

        const updatedAssignment = await response.json();
        
        // Update local state
        setAssignments(prev => prev.map(a => a.id === updatedAssignment.id ? updatedAssignment : a));
        setSelectedAssignment(updatedAssignment);
        setIsEditing(false);
        setEditFile(null);
        
        // Optional: Show success feedback (simulated)
        alert("Assignment updated successfully!");

     } catch (error) {
        console.error(error);
        alert("Failed to update assignment.");
     }
  };

  const fetchSubmissions = async (assignmentId: number) => {
     setSubmissionsLoading(true);
     try {
        const response = await fetch(`http://localhost:8080/api/assignments/${assignmentId}/submissions`, {
           headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
           },
        });

        if (!response.ok) throw new Error("Failed to fetch submissions");
        const data = await response.json();
        setSubmissions(data || []);
        setIsViewingSubmissions(true);
     } catch (error) {
        console.error(error);
        alert("Failed to load submissions.");
     } finally {
        setSubmissionsLoading(false);
     }
  };

  return (
    <TeacherLayout>
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Assignments</h2>
          
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'active' 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'past' 
                  ? "bg-white text-rose-500 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`}
            >
              Past Due
            </button>
          </div>
        </div>

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
                  {assignments
                    .filter(a => activeTab === 'active' ? a.isActive : !a.isActive)
                    .map((assignment) => (
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
                            onClick={() => { setSelectedAssignment(assignment); setIsEditing(false); }}
                            className="text-primary hover:text-emerald-700 font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  {assignments.filter(a => activeTab === 'active' ? a.isActive : !a.isActive).length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                           {activeTab === 'active' ? "No active assignments found." : "No past due assignments found."}
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
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 transform transition-all scale-100 relative max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                 <h3 className="text-xl font-bold text-slate-800">
                    {isEditing ? "Edit Assignment" : "Assignment Details"}
                 </h3>
                 <button
                    onClick={() => { setSelectedAssignment(null); setIsEditing(false); }}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
              </div>

              {isEditing ? (
                 <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                       <label className="block text-sm font-medium text-slate-700">Title</label>
                       <input 
                          type="text" 
                          name="title" 
                          value={editFormData.title || ""} 
                          onChange={handleEditChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                          required 
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700">Subject</label>
                       <input 
                          type="text" 
                          name="subject" 
                          value={editFormData.subject || ""} 
                          onChange={handleEditChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                          required 
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700">Grade</label>
                       <input 
                          type="text" 
                          name="grade" 
                          value={editFormData.grade || ""} 
                          onChange={handleEditChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                          required 
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700">Due Date</label>
                       <input 
                          type="date" 
                          name="dueDate" 
                          value={editFormData.dueDate || ""} 
                          onChange={handleEditChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                          required 
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700">Description</label>
                       <textarea 
                          name="description" 
                          value={editFormData.description || ""} 
                          onChange={handleEditChange}
                          rows={3}
                          className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                          required 
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700">Replace File (Optional)</label>
                       <input 
                          type="file" 
                          accept=".pdf"
                          onChange={handleEditFileChange}
                          className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                       />
                       {editFormData.fileUrl && !editFile && (
                          <p className="text-xs text-slate-500 mt-1">Current file: ...{editFormData.fileUrl.slice(-20)}</p>
                       )}
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t">
                       <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                       >
                          Cancel
                       </button>
                       <button
                          type="submit"
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition-colors"
                       >
                          Save Changes
                       </button>
                    </div>
                 </form>
              ) : (
                 <>
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
                                   Open PDF in New Tab
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

                    <div className="mt-8 flex justify-end gap-3">
                      <button
                         onClick={() => fetchSubmissions(selectedAssignment.id)}
                         disabled={submissionsLoading}
                         className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center gap-2"
                      >
                         {submissionsLoading ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                         )}
                         View Submissions
                      </button>
                      <button
                         onClick={startEditing}
                         className="px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors font-medium flex items-center gap-2"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                         </svg>
                         Edit Assignment
                      </button>
                      <button
                         onClick={() => setSelectedAssignment(null)}
                         className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                      >
                         Close
                      </button>
                    </div>
                 </>
              )}
            </div>
          </div>
        )}

        {/* Submissions Modal */}
        {isViewingSubmissions && selectedAssignment && (
           <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
              <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-8 transform transition-all scale-100 relative max-h-[90vh] overflow-hidden flex flex-col">
                 <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Student Submissions</h3>
                        <p className="text-sm text-slate-500">{selectedAssignment.title} • {selectedAssignment.subject}</p>
                    </div>
                    <button
                       onClick={() => setIsViewingSubmissions(false)}
                       className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                       </svg>
                    </button>
                 </div>

                 <div className="overflow-y-auto flex-1">
                    {submissions.length === 0 ? (
                       <div className="py-20 text-center text-slate-500">
                          <div className="text-4xl mb-3 opacity-30">📁</div>
                          <p>No submissions found for this assignment.</p>
                       </div>
                    ) : (
                       <table className="min-w-full divide-y divide-slate-200">
                          <thead className="bg-slate-50 sticky top-0">
                             <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted At</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                             </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                             {submissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{sub.studentName}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                      {new Date(sub.submittedAt).toLocaleString()}
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                         sub.isLate ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                                      }`}>
                                         {sub.isLate ? "Late" : "On Time"}
                                      </span>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <div className="flex justify-end gap-3">
                                         {sub.fileUrl && (
                                            <a 
                                               href={sub.fileUrl} 
                                               target="_blank" 
                                               rel="noopener noreferrer"
                                               className="text-primary hover:text-emerald-700 flex items-center gap-1"
                                            >
                                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                               </svg>
                                               View PDF
                                            </a>
                                         )}
                                      </div>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    )}
                 </div>

                 <div className="mt-6 pt-4 border-t flex justify-end">
                    <button
                       onClick={() => setIsViewingSubmissions(false)}
                       className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-semibold transition-colors"
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
