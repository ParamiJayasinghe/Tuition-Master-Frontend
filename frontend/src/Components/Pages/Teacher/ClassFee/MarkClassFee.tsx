import { useEffect, useState } from "react";
import TeacherLayout from "../../../Layout/TeacherLayout";
import { authFetch } from "../../../../utils/AuthFetch";

interface StudentFee {
  id?: number;
  studentId: number;
  studentName: string;
  grade: string;
  subject: string;
  amount: number;
  month: number;
  year: number;
  status: string;
  dueDate: string;
  notes?: string;
}

const MarkClassFee = () => {
  const [students, setStudents] = useState<StudentFee[]>([]);
  const [filters, setFilters] = useState({
    grade: "",
    subject: "",
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
    status: "PENDING",
  });

  // Fetch students with their pending fees for the logged-in teacher
  const fetchStudents = async () => {
    try {
      const paramsObj: any = {};
      for (let key in filters) {
        if (filters[key as keyof typeof filters]) {
          paramsObj[key] = filters[key as keyof typeof filters];
        }
      }

      const params = new URLSearchParams(paramsObj).toString();

      const data = await authFetch(`http://localhost:8080/api/fees?${params}`, {
        method: "GET",
      });

      // The backend now returns virtual PENDING fees, so we can display them directly.
      // Filter locally just in case, though backend handles it.
      setStudents(data.filter((s: StudentFee) => s.status === "PENDING"));
    } catch (err) {
      console.error(err);
    }
  };

  const markPaid = async (studentFee: StudentFee) => {
    try {
      if (studentFee.id) {
        // Existing fee record
        await authFetch(`http://localhost:8080/api/fees/${studentFee.id}`, {
          method: "PUT",
          body: JSON.stringify({ status: "PAID" }),
        });
      } else {
        // Virtual fee record - create new
        await authFetch(`http://localhost:8080/api/fees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: studentFee.studentId,
            subject: studentFee.subject,
            month: studentFee.month,
            year: studentFee.year,
            amount: studentFee.amount || 0, // Default to 0 if not set
            status: "PAID",
            dueDate: new Date().toISOString().split('T')[0], // Default due date
            grade: studentFee.grade,
          }),
        });
      }

      // Refresh the list
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to mark as paid");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <TeacherLayout>
      <div className="w-full animate-fade-in-up">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Mark Class Fees
        </h2>

        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <input
            placeholder="Grade"
            className="border p-2 rounded"
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
          />
          <input
            placeholder="Subject"
            className="border p-2 rounded"
            value={filters.subject}
            onChange={(e) =>
              setFilters({ ...filters, subject: e.target.value })
            }
          />
          <input
            placeholder="Month"
            type="number"
            className="border p-2 rounded"
            value={filters.month}
            onChange={(e) =>
              setFilters({ ...filters, month: e.target.value })
            }
          />
          <input
            placeholder="Year"
            type="number"
            className="border p-2 rounded"
            value={filters.year}
            onChange={(e) =>
              setFilters({ ...filters, year: e.target.value })
            }
          />
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            onClick={fetchStudents}
          >
            Search
          </button>
        </div>

        {students.length > 0 ? (
          <div className="bg-white shadow-glass rounded-xl border border-slate-100 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {students.map((s, index) => (
                  <tr key={s.id || `virtual-${index}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {s.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {s.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {s.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {s.month}/{s.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {s.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => markPaid(s)}
                        className="px-4 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-full text-xs font-bold transition-all uppercase tracking-wide"
                      >
                        Mark as Paid
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-500">
            No students found for fee marking. Please refine your search.
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default MarkClassFee;
