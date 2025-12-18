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
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="Grade"
        className="border p-2 rounded"
        value={filters.grade}
        onChange={(e) =>
          setFilters({ ...filters, grade: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Subject"
        className="border p-2 rounded"
        value={filters.subject}
        onChange={(e) =>
          setFilters({ ...filters, subject: e.target.value })
        }
      />

      <input
        type="date"
        className="border p-2 rounded"
        value={filters.date}
        onChange={(e) =>
          setFilters({ ...filters, date: e.target.value })
        }
      />

      <button
        onClick={onSearch}
        className="bg-blue-600 text-white px-4 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default AttendanceFilters;
