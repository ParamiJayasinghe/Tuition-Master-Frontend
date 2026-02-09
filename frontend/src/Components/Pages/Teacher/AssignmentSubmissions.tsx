import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeacherLayout from "../../Layout/TeacherLayout";

interface Submission {
  id: number;
  studentName: string;
  submittedAt: string;
  isLate: boolean;
  fileUrl: string;
  answerText: string;
}

interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
}

const AssignmentSubmissions = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Assignment Details
      const assignmentRes = await fetch(`http://localhost:8080/api/assignments/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (assignmentRes.ok) {
        setAssignment(await assignmentRes.json());
      }

      // Fetch Submissions
      const submissionsRes = await fetch(`http://localhost:8080/api/assignments/${id}/submissions`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (submissionsRes.ok) {
        setSubmissions(await submissionsRes.json());
      }
    } catch (error) {
      console.error("Error fetching submission data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
             <button 
                onClick={() => navigate("/teacher/assignments")}
                className="text-primary hover:text-emerald-700 text-sm font-semibold flex items-center gap-1 mb-2 transition-colors"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Assignments
             </button>
             <h2 className="text-2xl font-bold text-slate-800">
                {assignment ? `Submissions for ${assignment.title}` : "Submissions"}
             </h2>
             {assignment && (
                <p className="text-slate-500 mt-1">
                   {assignment.subject} • Due: {assignment.dueDate}
                </p>
             )}
          </div>

          <button 
             onClick={fetchData}
             className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 text-sm font-medium"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
             Refresh
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-glass border border-slate-100 overflow-hidden animate-fade-in-up">
             {submissions.length === 0 ? (
                <div className="py-24 text-center">
                   <div className="text-6xl mb-4 opacity-20">📂</div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">No submissions yet</h3>
                   <p className="text-slate-500 max-w-sm mx-auto">
                      Students haven't uploaded their answers for this assignment yet. Check back later!
                   </p>
                </div>
             ) : (
                <div className="overflow-x-auto">
                   <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50/50">
                         <tr>
                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Submission Date</th>
                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-8 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                         </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100">
                         {submissions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                               <td className="px-8 py-5 whitespace-nowrap">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {sub.studentName.charAt(0)}
                                     </div>
                                     <span className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">
                                        {sub.studentName}
                                     </span>
                                  </div>
                               </td>
                               <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-600">
                                  {new Date(sub.submittedAt).toLocaleString('en-US', {
                                     month: 'short',
                                     day: 'numeric',
                                     year: 'numeric',
                                     hour: '2-digit',
                                     minute: '2-digit'
                                  })}
                               </td>
                               <td className="px-8 py-5 whitespace-nowrap">
                                  <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                                     sub.isLate 
                                     ? "bg-amber-50 text-amber-600 border border-amber-100" 
                                     : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  }`}>
                                     {sub.isLate ? "Late Submission" : "On Time"}
                                  </span>
                               </td>
                               <td className="px-8 py-5 whitespace-nowrap text-right">
                                  <div className="flex justify-end items-center gap-3">
                                     {sub.fileUrl ? (
                                        <a 
                                           href={sub.fileUrl} 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           className="px-4 py-2 bg-slate-50 text-primary hover:bg-primary hover:text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-slate-100"
                                        >
                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                           </svg>
                                           View Answer
                                        </a>
                                     ) : (
                                        <span className="text-xs text-slate-400 italic">No file attached</span>
                                     )}
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             )}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default AssignmentSubmissions;
