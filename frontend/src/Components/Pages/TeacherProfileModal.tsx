import React from "react";

interface Props {
  teacher: any;
  onClose: () => void;
}

const TeacherProfileModal: React.FC<Props> = ({ teacher, onClose }) => {
  const t = teacher.teacherDetails;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded shadow p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-black">Teacher Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" value={t.fullName} />
          <Field label="Teacher ID" value={t.teacherId} />
          <Field label="Email" value={teacher.email} />
          <Field label="Contact Number" value={t.contactNumber} />
          <Field label="NIC" value={t.nicNumber} />
          <Field label="Gender" value={t.gender} />
          <Field label="Subjects" value={t.subjects} />
          <Field
            label="Created At"
            value={new Date(t.createdAt).toLocaleString()}
          />
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
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
    <label className="block text-sm font-semibold text-gray-600 mb-1">
      {label}
    </label>
    <input
      value={value}
      readOnly
      className="w-full border rounded px-3 py-2 bg-gray-100"
    />
  </div>
);

export default TeacherProfileModal;
