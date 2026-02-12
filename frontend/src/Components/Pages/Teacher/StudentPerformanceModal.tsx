import { useEffect, useState } from "react";

interface Submission {
  id: number;
  assignmentTitle: string;
  submittedAt: string;
  isLate: boolean;
  marks: number | null;
  isMarked: boolean;
}

interface SubjectPerformance {
  subjectName: string;
  averageMarks: number;
  submissions: Submission[];
}

interface StudentPerformance {
  id: number;
  studentName: string;
  grade: string;
  subjectPerformances: SubjectPerformance[];
}

interface StudentPerformanceModalProps {
  userId: number;
  onClose: () => void;
}

const StudentPerformanceModal = ({ userId, onClose }: StudentPerformanceModalProps) => {
  const [performance, setPerformance] = useState<StudentPerformance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, [userId]);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/performance/student/${userId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPerformance(data);
      }
    } catch (error) {
      console.error("Error fetching performance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Student Performance</h3>
            {performance && (
              <p className="text-slate-500 text-sm">
                {performance.studentName} • Grade {performance.grade}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-slate-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
              <p className="text-slate-500 font-medium">Loading performance data...</p>
            </div>
          ) : performance ? (
            <div className="space-y-8">
              {performance.subjectPerformances.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500">No performance data available yet.</p>
                 </div>
              ) : (
                performance.subjectPerformances.map((subject, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                       <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                          {subject.subjectName}
                       </h4>
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Marks:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${
                             subject.averageMarks >= 75 ? "bg-emerald-100 text-emerald-700" :
                             subject.averageMarks >= 40 ? "bg-amber-100 text-amber-700" :
                             "bg-rose-100 text-rose-700"
                          }`}>
                             {subject.averageMarks.toFixed(1)}%
                          </span>
                       </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                       <table className="min-w-full divide-y divide-slate-100">
                          <thead className="bg-white">
                             <tr>
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignment</th>
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Marks</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {subject.submissions.length === 0 ? (
                                <tr>
                                   <td colSpan={4} className="px-6 py-4 text-center text-xs text-slate-400 italic">No submissions recorded for this subject</td>
                                </tr>
                             ) : (
                                subject.submissions.map((sub) => (
                                   <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">{sub.assignmentTitle}</td>
                                      <td className="px-6 py-4 text-xs text-slate-500">
                                         {new Date(sub.submittedAt).toLocaleDateString()}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            sub.isLate ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                         }`}>
                                            {sub.isLate ? "Late" : "On Time"}
                                         </span>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                         {sub.isMarked ? (
                                            <span className="text-sm font-bold text-primary">{sub.marks}</span>
                                         ) : (
                                            <span className="text-xs text-slate-400 italic">Pending</span>
                                         )}
                                      </td>
                                   </tr>
                                ))
                             )}
                          </tbody>
                       </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-rose-500 font-medium">Failed to load performance data.</p>
              <button onClick={fetchPerformance} className="mt-4 text-primary hover:underline font-semibold">Try Again</button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-bold text-sm"
          >
            Close Performance View
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformanceModal;
