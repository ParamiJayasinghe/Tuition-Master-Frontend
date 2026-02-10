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
  isActive: boolean;
  isSubmitted: boolean;
  submissionFileUrl?: string;
}

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionComments, setSubmissionComments] = useState("");
  const [submissionLoading, setSubmissionLoading] = useState(false);

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

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionFile) return;

    setSubmissionLoading(true);
    try {
        // 1. Upload File
        const uploadFormData = new FormData();
        uploadFormData.append("file", submissionFile);

        const uploadResponse = await fetch("http://localhost:8080/api/assignments/upload", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: uploadFormData,
        });

        if (!uploadResponse.ok) throw new Error("Failed to upload submission file");
        const fileUrl = await uploadResponse.text();

        // 2. Submit Logic
        const submissionPayload = {
            assignmentId: selectedAssignment.id,
            fileUrl: fileUrl,
            answerText: submissionComments
        };

        const response = await fetch(`http://localhost:8080/api/assignments/${selectedAssignment.id}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(submissionPayload),
        });

        if (!response.ok) throw new Error("Failed to submit assignment");

        alert("Assignment submitted successfully!");
        setIsSubmitting(false);
        setSubmissionFile(null);
        setSubmissionComments("");
        setSelectedAssignment(null);
        fetchAssignments(); // Refresh list

    } catch (error) {
        console.error(error);
        alert("Submission failed. Please try again.");
    } finally {
        setSubmissionLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-800">My Assignments</h2>
          
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {assignments
              .filter(a => activeTab === 'active' ? a.isActive : !a.isActive)
              .map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-xl shadow-glass border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                   <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                         <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wide">
                            {assignment.subject}
                         </span>
                         <div className="flex flex-col items-end gap-1">
                            <span className={`text-xs font-medium ${activeTab === 'past' ? 'text-rose-500' : 'text-slate-400'}`}>
                                {activeTab === 'past' ? 'Expired: ' : 'Due: '} {assignment.dueDate}
                            </span>
                            {assignment.isSubmitted && (
                               <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md flex items-center gap-1 ${
                                  !assignment.isActive ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                               }`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  {assignment.isActive ? "SUBMITTED" : "LATE SUBMISSION"}
                               </span>
                            )}
                         </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{assignment.title}</h3>
                      <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                         {assignment.description || "No description provided."}
                      </p>
                      
                      <div className="text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50">
                         Posted by: <span className="text-slate-600 font-medium">{assignment.createdBy}</span>
                      </div>
                   </div>
                   
                   <div className="bg-slate-50 p-4 border-t border-slate-100 flex gap-2">
                      <button
                         onClick={() => setSelectedAssignment(assignment)}
                         className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 transition-all shadow-sm"
                      >
                         Details
                      </button>
                      <button
                         onClick={() => { setSelectedAssignment(assignment); setIsSubmitting(true); }}
                         className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${
                            assignment.isSubmitted 
                            ? (assignment.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100")
                            : (assignment.isActive ? "bg-primary text-white hover:bg-emerald-600" : "bg-rose-500 text-white hover:bg-rose-600")
                         }`}
                      >
                         {assignment.isSubmitted ? "Update" : (assignment.isActive ? "Submit" : "Submit Late")}
                      </button>
                   </div>
                </div>
              ))}
            
            {assignments.filter(a => activeTab === 'active' ? a.isActive : !a.isActive).length === 0 && (
               <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-100 border-dashed">
                  <div className="text-5xl mb-4 opacity-50">
                    {activeTab === 'active' ? "🎉" : "📄"}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {activeTab === 'active' ? "All caught up!" : "No old assignments"}
                  </h3>
                  <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                    {activeTab === 'active' 
                      ? "No pending assignments found for your subjects." 
                      : "You don't have any assignments in the past due archive."}
                  </p>
               </div>
            )}
          </div>
        )}

        {/* Details & Submission Modal */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className={`bg-white w-full rounded-2xl shadow-2xl transform transition-all scale-100 relative max-h-[90vh] overflow-y-auto ${isSubmitting ? 'max-w-xl' : 'max-w-lg'} p-8`}>
              
              <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                 <h3 className="text-xl font-bold text-slate-800">
                    {isSubmitting ? "Submit Assignment" : "Assignment Details"}
                 </h3>
                 <button
                    onClick={() => { setSelectedAssignment(null); setIsSubmitting(false); }}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
              </div>

              {isSubmitting ? (
                 <form onSubmit={handleSubmission} className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                       <h4 className="text-sm font-bold text-slate-700 mb-1">{selectedAssignment.title}</h4>
                       <p className="text-xs text-slate-500">{selectedAssignment.subject} • Due: {selectedAssignment.dueDate}</p>
                    </div>

                    <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Answer (PDF)</label>
                       <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-primary transition-colors bg-slate-50/30 group">
                          <input 
                             type="file" 
                             accept=".pdf" 
                             required={!selectedAssignment.isSubmitted}
                             onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                             className="hidden" 
                             id="submission-file"
                          />
                          <label htmlFor="submission-file" className="cursor-pointer">
                             <div className="bg-white w-12 h-12 rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                             </div>
                             <p className="text-sm font-medium text-slate-700">
                                {submissionFile ? submissionFile.name : "Click to select PDF or drag and drop"}
                             </p>
                             <p className="text-xs text-slate-400 mt-1">Maximum file size: 100MB</p>
                          </label>
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-2">Comments (Optional)</label>
                       <textarea 
                          rows={4}
                          value={submissionComments}
                          onChange={(e) => setSubmissionComments(e.target.value)}
                          placeholder="Type any notes for the teacher here..."
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary bg-white text-sm"
                       />
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                       <button
                          type="button"
                          disabled={submissionLoading}
                          onClick={() => setIsSubmitting(false)}
                          className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
                       >
                          Back to Details
                       </button>
                       <button
                          type="submit"
                          disabled={submissionLoading}
                          className="flex-1 py-3 bg-primary text-white rounded-xl hover:bg-emerald-600 transition-all font-semibold shadow-md flex items-center justify-center gap-2"
                       >
                          {submissionLoading ? (
                             <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                             </svg>
                          )}
                          {submissionLoading ? "Submitting..." : (selectedAssignment.isSubmitted ? "Update Submission" : (selectedAssignment.isActive ? "Submit Answer" : "Submit Late"))}
                       </button>
                    </div>
                 </form>
              ) : (
                 <>
                    <div className="space-y-4">
                       <div className="grid grid-cols-3 gap-2 py-1">
                          <span className="text-sm font-semibold text-slate-500 text-right pr-2">Title:</span>
                          <span className="text-sm text-slate-800 font-medium col-span-2">{selectedAssignment.title}</span>
                       </div>
                       <div className="grid grid-cols-3 gap-2 py-1">
                          <span className="text-sm font-semibold text-slate-500 text-right pr-2">Status:</span>
                          <span className={`text-sm font-bold col-span-2 ${selectedAssignment.isActive ? "text-emerald-600" : "text-rose-500"}`}>
                             {selectedAssignment.isActive ? "Active" : "Past Due (Locked for normal submission)"}
                          </span>
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
                           <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <div className="flex justify-between items-center mb-3">
                                 <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Assignment File</span>
                                    <span className="text-sm font-semibold text-slate-700">Assignment PDF</span>
                                 </div>
                                 <div className="flex gap-2">
                                    <a 
                                       href={selectedAssignment.fileUrl} 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1.5"
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                       </svg>
                                       Preview
                                    </a>
                                    <a 
                                       href={selectedAssignment.fileUrl} 
                                       download
                                       className="text-xs bg-primary text-white hover:bg-emerald-600 px-3 py-1.5 rounded-lg font-bold transition-all shadow-md flex items-center gap-1.5"
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                       </svg>
                                       Download
                                    </a>
                                 </div>
                              </div>
                              <div className="border border-slate-200 rounded-lg overflow-hidden h-40 bg-white">
                                 <iframe 
                                    src={selectedAssignment.fileUrl} 
                                    className="w-full h-full"
                                    title="PDF Preview"
                                 />
                              </div>
                           </div>
                        )}

                        {selectedAssignment.isSubmitted && selectedAssignment.submissionFileUrl && (
                           <div className="mt-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                              <div className="flex justify-between items-center mb-1">
                                 <div>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-0.5">Your Submission</span>
                                    <span className="text-sm font-semibold text-slate-700">Answer PDF</span>
                                 </div>
                                 <div className="flex gap-2">
                                    <a 
                                       href={selectedAssignment.submissionFileUrl} 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="text-xs bg-white border border-emerald-100 text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1.5"
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                       </svg>
                                       View
                                    </a>
                                    <a 
                                       href={selectedAssignment.submissionFileUrl} 
                                       download
                                       className="text-xs bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg font-bold transition-all shadow-md flex items-center gap-1.5"
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                       </svg>
                                       Download
                                    </a>
                                 </div>
                              </div>
                           </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                       <button
                          onClick={() => setIsSubmitting(true)}
                          className={`px-6 py-2 rounded-xl transition-all font-semibold shadow-md text-white ${
                             selectedAssignment.isActive ? "bg-primary hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600"
                          }`}
                       >
                          {selectedAssignment.isSubmitted ? "Update Submission" : (selectedAssignment.isActive ? "Submit Answer" : "Submit Late")}
                       </button>
                       <button
                          onClick={() => setSelectedAssignment(null)}
                          className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
                       >
                          Close
                       </button>
                    </div>
                 </>
              )}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentAssignments;
