import React from "react";

interface Props {
  teacher: any;
  onClose: () => void;
}

const TeacherProfileModal: React.FC<Props> = ({ teacher, onClose }) => {
  const t = teacher.teacherDetails;

  return (
    <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 transform transition-all scale-100">
        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Teacher Profile</h2>
            <p className="text-slate-500 text-sm mt-1">{t.fullName} ({t.teacherId})</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <Field label="Full Name" value={t.fullName} />
          <Field label="Teacher ID" value={t.teacherId} />
          <Field label="Email Address" value={teacher.email} />
          <Field label="Contact Number" value={t.contactNumber} />
          <Field label="NIC Number" value={t.nicNumber} />
          <Field label="Gender" value={t.gender} />
          <Field label="Subjects" value={t.subjects} />
          <Field
            label="Joined Date"
            value={new Date(t.createdAt).toLocaleDateString(undefined, {
               year: 'numeric', month: 'long', day: 'numeric'
            })}
          />
        </div>

        <div className="mt-8 flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <div className="text-slate-800 font-medium text-base break-words">
      {value || "—"}
    </div>
  </div>
);

export default TeacherProfileModal;
