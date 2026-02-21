import { useEffect, useState } from "react";
import TeacherLayout from "../../Layout/TeacherLayout";

interface AuditLog {
  id: number;
  action: string;
  actorUsername: string;
  actorRole: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/audit-logs", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audit logs");
      }

      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actorUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === "" || log.action === filterAction;
    
    return matchesSearch && matchesAction;
  });

  const uniqueActions = Array.from(new Set(logs.map(l => l.action)));

  const getActionBadgeColor = (action: string) => {
    if (action.startsWith("CREATE")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (action.startsWith("UPDATE")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (action.startsWith("DELETE")) return "bg-rose-100 text-rose-700 border-rose-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <TeacherLayout>
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">System Audit Logs</h2>
            <p className="text-slate-500 text-sm">Track all teacher-initiated activities across the platform</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
              ))}
            </select>

            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Target</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">{log.actorUsername}</span>
                          <span className="text-xs text-slate-500 uppercase">{log.actorRole.replace(/[\[\]]/g, '')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getActionBadgeColor(log.action)}`}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        <span className="font-medium">{log.targetType}</span>
                        {log.targetId && <span className="ml-1 text-slate-400">#{log.targetId}</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={log.details}>
                        {log.details}
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                           No matching audit records found.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default AuditLogs;
