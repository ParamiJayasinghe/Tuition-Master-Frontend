import { useEffect, useState } from "react";
import TeacherLayout from "../../Layout/TeacherLayout";
import TeacherAssignmentModal from "./TeacherAssignmentModal";

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

const ViewAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [filters, setFilters] = useState({
    subject: "",
    grade: ""
  });

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

  const handleUpdateSuccess = (updated: Assignment) => {
    setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSelectedAssignment(updated);
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

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-glass border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-end animate-fade-in">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <input
              type="text"
              placeholder="Filter by subject..."
              className="w-full px-4 py-2 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Grade</label>
            <input
              type="text"
              placeholder="Filter by grade..."
              className="w-full px-4 py-2 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              value={filters.grade}
              onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            />
          </div>
          <button
            onClick={() => setFilters({ subject: "", grade: "" })}
            className="px-4 py-2 text-slate-500 hover:text-rose-500 text-sm font-medium transition-colors mb-1"
          >
            Clear Filters
          </button>
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
                    .filter(a => 
                      a.subject.toLowerCase().includes(filters.subject.toLowerCase()) &&
                      a.grade.toLowerCase().includes(filters.grade.toLowerCase())
                    )
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
                            onClick={() => setSelectedAssignment(assignment)}
                            className="text-primary hover:text-emerald-700 font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  {assignments.filter(a => 
                    (activeTab === 'active' ? a.isActive : !a.isActive) &&
                    a.subject.toLowerCase().includes(filters.subject.toLowerCase()) &&
                    a.grade.toLowerCase().includes(filters.grade.toLowerCase())
                  ).length === 0 && (
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
          <TeacherAssignmentModal 
            assignment={selectedAssignment}
            onClose={() => setSelectedAssignment(null)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </TeacherLayout>
  );
};

export default ViewAssignments;
