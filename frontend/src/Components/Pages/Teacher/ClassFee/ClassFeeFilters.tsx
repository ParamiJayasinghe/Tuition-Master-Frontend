const ClassFeeFilters = ({ filters, setFilters, onSearch }: any) => {
  return (
    <div className="flex gap-3 mb-6">
      <input
        placeholder="Grade"
        value={filters.grade}
        onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
      />

      <input
        placeholder="Subject"
        value={filters.subject}
        onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
      />

      <input
        type="number"
        placeholder="Month"
        value={filters.month}
        onChange={(e) => setFilters({ ...filters, month: e.target.value })}
      />

      <input
        type="number"
        placeholder="Year"
        value={filters.year}
        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
      />

      <button
        onClick={onSearch}
        className="bg-slate-700 text-white px-4 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default ClassFeeFilters;
