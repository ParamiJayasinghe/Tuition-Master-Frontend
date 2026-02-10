import React, { useState } from "react";

interface Assignment {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  dueDate: string;
  grade: string;
  subject: string;
  createdBy: string;
  isActive: boolean;
  isSubmitted: boolean;
  submissionFileUrl?: string;
}

interface StudentSubmissionFormProps {
  assignment: Assignment;
  onCancel: () => void;
  onSuccess: () => void;
  onClose: () => void;
}

const StudentSubmissionForm: React.FC<StudentSubmissionFormProps> = ({
  assignment,
  onCancel,
  onSuccess,
  onClose,
}) => {
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionComments, setSubmissionComments] = useState("");
  const [submissionLoading, setSubmissionLoading] = useState(false);

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment || !submissionFile) return;

    setSubmissionLoading(true);
    try {
      // 1. Upload File
      const uploadFormData = new FormData();
      uploadFormData.append("file", submissionFile);

      const uploadResponse = await fetch(
        "http://localhost:8080/api/assignments/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: uploadFormData,
        },
      );

      if (!uploadResponse.ok)
        throw new Error("Failed to upload submission file");
      const fileUrl = await uploadResponse.text();

      // 2. Submit Logic
      const submissionPayload = {
        assignmentId: assignment.id,
        fileUrl: fileUrl,
        answerText: submissionComments,
      };

      const response = await fetch(
        `http://localhost:8080/api/assignments/${assignment.id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(submissionPayload),
        },
      );

      if (!response.ok) throw new Error("Failed to submit assignment");

      alert("Assignment submitted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Submission failed. Please try again.");
    } finally {
      setSubmissionLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmission} className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <h4 className="text-sm font-bold text-slate-700 mb-1">
          {assignment.title}
        </h4>
        <p className="text-xs text-slate-500">
          {assignment.subject} • Due: {assignment.dueDate}
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Upload Answer (PDF)
        </label>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-primary transition-colors bg-slate-50/30 group">
          <input
            type="file"
            accept=".pdf"
            required={!assignment.isSubmitted}
            onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
            className="hidden"
            id="submission-file"
          />
          <label htmlFor="submission-file" className="cursor-pointer">
            <div className="bg-white w-12 h-12 rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">
              {submissionFile
                ? submissionFile.name
                : "Click to select PDF or drag and drop"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Maximum file size: 100MB
            </p>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Comments (Optional)
        </label>
        <textarea
          rows={4}
          value={submissionComments}
          onChange={(e) => setSubmissionComments(e.target.value)}
          placeholder="Type any notes for the teacher here..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary bg-white text-sm"
        />
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          disabled={submissionLoading}
          onClick={onCancel}
          className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
        >
          Back to Details
        </button>
        <button
          type="submit"
          disabled={submissionLoading}
          className="flex-1 py-3 bg-primary text-white rounded-xl hover:bg-emerald-600 transition-all font-semibold shadow-md flex items-center justify-center gap-2"
        >
          {submissionLoading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          )}
          {submissionLoading
            ? "Submitting..."
            : assignment.isSubmitted
              ? "Update Submission"
              : assignment.isActive
                ? "Submit Answer"
                : "Submit Late"}
        </button>
      </div>
    </form>
  );
};

export default StudentSubmissionForm;
