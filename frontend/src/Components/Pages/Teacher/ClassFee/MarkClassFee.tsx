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

      // The backend returns virtual PENDING fees if no paid fee exists.
      // We filter locally as a safety measure to ensure only PENDING items show up in this specific list.
      setStudents(data.filter((s: StudentFee) => s.status === "PENDING"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAmountChange = (index: number, value: string) => {
    const newStudents = [...students];
    newStudents[index].amount = Number(value);
    setStudents(newStudents);
  };

  const markPaid = async (studentFee: StudentFee) => {
    try {
      if (studentFee.id) {
        // Existing fee record (if any PENDING record actually existed in DB)
        await authFetch(`http://localhost:8080/api/fees/${studentFee.id}`, {
          method: "PUT",
          body: JSON.stringify({ 
            status: "PAID",
            amount: studentFee.amount, // Ensure updated amount is sent
            paidOn: new Date().toISOString().split('T')[0] // Set paid date to today
          }),
        });
      } else {
        // Virtual fee record - create new PAID record
        await authFetch(`http://localhost:8080/api/fees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: studentFee.studentId,
            subject: studentFee.subject,
            month: studentFee.month,
            year: studentFee.year,
            amount: studentFee.amount || 0, 
            status: "PAID",
            // Calculate last day of the specific fee month
            dueDate: new Date(Number(studentFee.year), Number(studentFee.month), 0).toISOString().split('T')[0],
            // Paid on today
            paidOn: new Date().toISOString().split('T')[0],
            grade: studentFee.grade,
          }),
        });
      }

      // Refresh the list - the student should disappear as they are now PAID
      // fetchStudents(); 
      // Optimization: Instead of refetching, just remove the student from the list locally
      setStudents(students.filter(s => s.studentId !== studentFee.studentId || s.subject !== studentFee.subject));

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
                      <input
                        type="number"
                        className="border border-slate-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={s.amount || ""}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                        placeholder="0.00"
                      />
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
