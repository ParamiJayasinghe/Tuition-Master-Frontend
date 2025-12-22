interface Props {
  filters: {
    grade: string;
    subject: string;
    date: string;
  };
  setFilters: (filters: any) => void;
  onSearch: () => void;
}

const AttendanceFilters = ({ filters, setFilters, onSearch }: Props) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-glass border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1">Grade</label>
        <input
          type="text"
          placeholder="e.g. Grade 10"
          className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          value={filters.grade}
          onChange={(e) =>
            setFilters({ ...filters, grade: e.target.value })
          }
        />
      </div>

      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
        <input
          type="text"
          placeholder="e.g. Mathematics"
          className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          value={filters.subject}
          onChange={(e) =>
            setFilters({ ...filters, subject: e.target.value })
          }
        />
      </div>

      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
        <input
          type="date"
          className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          value={filters.date}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value })
          }
        />
      </div>

      <button
        onClick={onSearch}
        className="px-6 py-2 bg-primary hover:bg-emerald-600 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105 h-[42px]"
      >
        Search
      </button>
    </div>
  );
};

export default AttendanceFilters;
