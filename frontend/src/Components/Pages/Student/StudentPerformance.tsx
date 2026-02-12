import { useEffect, useState } from "react";
import StudentLayout from "../../Layout/StudentLayout";

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

interface StudentPerformanceData {
  id: number;
  studentName: string;
  grade: string;
  subjectPerformances: SubjectPerformance[];
}

const StudentPerformance = () => {
  const [performance, setPerformance] = useState<StudentPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/performance/me`, {
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
    <StudentLayout>
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">My Performance</h2>
            <p className="text-slate-500 text-sm mt-1">Track your progress across all subjects</p>
          </div>
          
          {performance && (
            <div className="bg-white px-4 py-2 rounded-xl shadow-glass border border-slate-100 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {performance.studentName.charAt(0)}
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Grade</p>
                  <p className="text-sm font-bold text-slate-700">{performance.grade}</p>
               </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-slate-500 font-medium">Analyzing your results...</p>
          </div>
        ) : performance ? (
          <div className="grid grid-cols-1 gap-8 animate-fade-in-up">
            {performance.subjectPerformances.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-2xl shadow-glass border border-dashed border-slate-200">
                  <div className="text-5xl mb-4 opacity-20">📊</div>
                  <h3 className="text-lg font-bold text-slate-700">No performance records yet</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mt-2">Finish assignments and wait for your teacher to mark them to see your progress here.</p>
               </div>
            ) : (
              performance.subjectPerformances.map((subject, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-glass border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <h4 className="text-lg font-bold text-slate-800 uppercase tracking-wide">{subject.subjectName}</h4>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="text-right">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Score</p>
                           <p className={`text-xl font-black ${
                              subject.averageMarks >= 75 ? "text-emerald-500" :
                              subject.averageMarks >= 40 ? "text-amber-500" :
                              "text-rose-500"
                           }`}>
                              {subject.averageMarks.toFixed(1)}%
                           </p>
                        </div>
                        <div className="h-10 w-[2px] bg-slate-200 rounded-full mx-1"></div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submissions</span>
                           <span className="text-sm font-bold text-slate-700 text-center">{subject.submissions.length}</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-slate-100">
                        <thead>
                           <tr className="bg-white">
                              <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Assessment Title</th>
                              <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Submission Date</th>
                              <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Compliance</th>
                              <th className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Obtained Marks</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                           {subject.submissions.length === 0 ? (
                              <tr>
                                 <td colSpan={4} className="px-8 py-8 text-center text-sm text-slate-400 italic bg-slate-50/30">
                                    You haven't submitted any assignments for this subject yet.
                                 </td>
                              </tr>
                           ) : (
                              subject.submissions.map((sub) => (
                                 <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-8 py-5 text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                                       {sub.assignmentTitle}
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-500">
                                       {new Date(sub.submittedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-5">
                                       <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                                          sub.isLate ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                       }`}>
                                          {sub.isLate ? "Late Submission" : "On Time"}
                                       </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                       {sub.isMarked ? (
                                          <div className="flex flex-col items-end">
                                             <span className="text-base font-black text-primary">{sub.marks}</span>
                                             <span className="text-[10px] text-slate-400 font-bold uppercase">Points</span>
                                          </div>
                                       ) : (
                                          <span className="px-3 py-1 bg-slate-100 text-slate-400 text-xs font-bold rounded-full italic tracking-tight">
                                             Pending Review
                                          </span>
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
          <div className="text-center py-20 bg-white rounded-2xl shadow-glass border border-slate-100">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-slate-700">Connection Issue</h3>
            <p className="text-slate-500 mt-2">We couldn't retrieve your performance data at this time.</p>
            <button onClick={fetchPerformance} className="mt-6 px-6 py-2 bg-primary text-white rounded-xl hover:bg-emerald-600 transition-all font-bold shadow-lg shadow-primary/20">
              Retry Connection
            </button>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentPerformance;
