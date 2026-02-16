import { useEffect, useState } from "react";
import StudentLayout from "../../Layout/StudentLayout";

interface Fee {
  id: number | null;
  studentId: number;
  studentName: string;
  subject: string;
  grade: string;
  amount: number;
  month: number;
  year: number;
  status: string;
  paidOn: string | null;
  paymentMethod: string | null;
}

const StudentFees = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/fees/my-fees", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch fees");
      }

      const data = await response.json();
      setFees(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  };

  const filteredFees = fees.filter(f => f.year === filterYear);

  // Stats
  const totalPaid = filteredFees
    .filter(f => f.status === "PAID")
    .reduce((sum, f) => sum + (f.amount || 0), 0);

  const pendingCount = filteredFees.filter(f => f.status === "PENDING").length;

  return (
    <StudentLayout>
      <div className="w-full animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Fees & Payments</h2>
            <p className="text-slate-500 mt-1">Track your class fee payments.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                <button 
                  onClick={() => setFilterYear(filterYear - 1)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400"
                >
                   ◀
                </button>
                <span className="px-3 font-semibold text-slate-700">{filterYear}</span>
                <button 
                  onClick={() => setFilterYear(filterYear + 1)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400"
                >
                   ▶
                </button>
             </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
           <div className="bg-white p-6 rounded-xl shadow-glass border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-2xl">
                 💰
              </div>
              <div>
                 <p className="text-sm font-medium text-slate-500">Total Paid ({filterYear})</p>
                 <h3 className="text-2xl font-bold text-emerald-600">${totalPaid.toFixed(2)}</h3>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-glass border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-2xl">
                 ⏳
              </div>
              <div>
                 <p className="text-sm font-medium text-slate-500">Pending Months</p>
                 <h3 className="text-2xl font-bold text-amber-600">{pendingCount}</h3>
              </div>
           </div>
        </div>

        {loading ? (
           <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
           </div>
        ) : (
           <div className="bg-white rounded-xl shadow-glass border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                       <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Month</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Paid</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Date</th>
                       </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-50">
                       {filteredFees.length > 0 ? (
                          filteredFees.map((fee, idx) => (
                             <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="font-semibold text-slate-700">{fee.subject}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                   <span className="text-sm text-slate-600">{getMonthName(fee.month)}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                   <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                      fee.status === "PAID" ? "bg-emerald-100 text-emerald-700" :
                                      fee.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                                      "bg-slate-100 text-slate-500"
                                   }`}>
                                      {fee.status}
                                   </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                   <span className={`text-sm font-bold ${fee.status === "PAID" ? "text-slate-700" : "text-slate-400"}`}>
                                      {fee.status === "PAID" ? `$${fee.amount?.toFixed(2)}` : "-"}
                                   </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                   {fee.paidOn ? new Date(fee.paidOn).toLocaleDateString() : "-"}
                                </td>
                             </tr>
                          ))
                       ) : (
                          <tr>
                             <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                                No fee records found for {filterYear}.
                             </td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentFees;
