import { useEffect, useState } from "react";
import StudentLayout from "../../Layout/StudentLayout";
import StudentAssignmentModal from "./StudentAssignmentModal";

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
  marks?: number;
  isMarked?: boolean;
}

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);

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

  const openDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitting(false);
  };

  const openSubmission = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitting(true);
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

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-xl shadow-glass border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-end animate-fade-in">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Subject</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Mathematics..."
                className="w-full pl-10 pr-4 py-2 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm h-[42px]">
              <input 
                type="checkbox" 
                id="markedFilter"
                checked={showMarkedOnly}
                onChange={(e) => setShowMarkedOnly(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary shadow-sm cursor-pointer"
              />
              <label htmlFor="markedFilter" className="text-sm font-semibold text-slate-600 cursor-pointer select-none">
                Show Marked Only
              </label>
            </div>

            <button
              onClick={() => setSubjectFilter("")}
              className="px-4 py-2 text-slate-500 hover:text-rose-500 text-sm font-medium transition-colors h-[42px]"
            >
              Clear Filter
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
              .filter(a => a.subject.toLowerCase().includes(subjectFilter.toLowerCase()))
              .filter(a => showMarkedOnly ? a.isMarked : true)
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
                             {assignment.isMarked && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md">
                                   MARKS: {assignment.marks}
                                </span>
                             )}
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
                         onClick={() => openDetails(assignment)}
                         className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 transition-all shadow-sm"
                      >
                         Details
                      </button>
                      <button
                         onClick={() => openSubmission(assignment)}
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
            
            {assignments.filter(a => 
              (activeTab === 'active' ? a.isActive : !a.isActive) &&
              a.subject.toLowerCase().includes(subjectFilter.toLowerCase())
            ).length === 0 && (
               <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-100 border-dashed">
                  <div className="text-5xl mb-4 opacity-50">
                    {activeTab === 'active' ? "🎉" : "📄"}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {activeTab === 'active' 
                      ? (subjectFilter ? "No matching assignments" : "All caught up!") 
                      : (subjectFilter ? "No matching assignments in archive" : "No old assignments")}
                  </h3>
                  <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                    {activeTab === 'active' 
                      ? (subjectFilter ? `No active assignments found for "${subjectFilter}".` : "No pending assignments found for your subjects.") 
                      : (subjectFilter ? `No past assignments found for "${subjectFilter}".` : "You don't have any assignments in the past due archive.")}
                  </p>
               </div>
            )}
          </div>
        )}

        {/* Details & Submission Modal */}
        {selectedAssignment && (
          <StudentAssignmentModal 
            assignment={selectedAssignment}
            isSubmittingInitial={isSubmitting}
            onClose={() => { setSelectedAssignment(null); setIsSubmitting(false); }}
            onSuccess={fetchAssignments}
          />
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentAssignments;
