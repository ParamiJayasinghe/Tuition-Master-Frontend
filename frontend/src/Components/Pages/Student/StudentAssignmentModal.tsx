import React, { useState } from "react";
import StudentSubmissionForm from "./StudentSubmissionForm";

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

interface StudentAssignmentModalProps {
  assignment: Assignment;
  isSubmittingInitial: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const StudentAssignmentModal: React.FC<StudentAssignmentModalProps> = ({
  assignment,
  isSubmittingInitial,
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(isSubmittingInitial);

  return (
    <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className={`bg-white w-full rounded-2xl shadow-2xl transform transition-all scale-100 relative max-h-[90vh] overflow-y-auto ${isSubmitting ? "max-w-xl" : "max-w-lg"} p-8`}
      >
        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
          <h3 className="text-xl font-bold text-slate-800">
            {isSubmitting ? "Submit Assignment" : "Assignment Details"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {isSubmitting ? (
          <StudentSubmissionForm
            assignment={assignment}
            onCancel={() => setIsSubmitting(false)}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        ) : (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-sm font-semibold text-slate-500 text-right pr-2">
                  Title:
                </span>
                <span className="text-sm text-slate-800 font-medium col-span-2">
                  {assignment.title}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-sm font-semibold text-slate-500 text-right pr-2">
                  Status:
                </span>
                <span
                  className={`text-sm font-bold col-span-2 ${assignment.isActive ? "text-emerald-600" : "text-rose-500"}`}
                >
                  {assignment.isActive
                    ? "Active"
                    : "Past Due (Locked for normal submission)"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-sm font-semibold text-slate-500 text-right pr-2">
                  Subject:
                </span>
                <span className="text-sm text-slate-800 font-medium col-span-2">
                  {assignment.subject}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-sm font-semibold text-slate-500 text-right pr-2">
                  Due Date:
                </span>
                <span className="text-sm text-slate-800 font-medium col-span-2">
                  {assignment.dueDate}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-sm font-semibold text-slate-500 text-right pr-2">
                  Description:
                </span>
                <span className="text-sm text-slate-800 font-medium col-span-2 whitespace-pre-wrap">
                  {assignment.description || "—"}
                </span>
              </div>

              {assignment.fileUrl && (
                <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Assignment File
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        Assignment PDF
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={assignment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Preview
                      </a>
                      <a
                        href={assignment.fileUrl}
                        download
                        className="text-xs bg-primary text-white hover:bg-emerald-600 px-3 py-1.5 rounded-lg font-bold transition-all shadow-md flex items-center gap-1.5"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </a>
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden h-40 bg-white">
                    <iframe
                      src={assignment.fileUrl}
                      className="w-full h-full"
                      title="PDF Preview"
                    />
                  </div>
                </div>
              )}

              {assignment.isSubmitted && assignment.submissionFileUrl && (
                <div className="mt-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-0.5">
                        Your Submission
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        Answer PDF
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={assignment.submissionFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-white border border-emerald-100 text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        View
                      </a>
                      <a
                        href={assignment.submissionFileUrl}
                        download
                        className="text-xs bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg font-bold transition-all shadow-md flex items-center gap-1.5"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setIsSubmitting(true)}
                className={`px-6 py-2 rounded-xl transition-all font-semibold shadow-md text-white ${
                  assignment.isActive
                    ? "bg-primary hover:bg-emerald-600"
                    : "bg-rose-500 hover:bg-rose-600"
                }`}
              >
                {assignment.isSubmitted
                  ? "Update Submission"
                  : assignment.isActive
                    ? "Submit Answer"
                    : "Submit Late"}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentModal;
