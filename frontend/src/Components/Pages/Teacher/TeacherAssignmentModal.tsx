import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Assignment {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  dueDate: string;
  grade: string;
  subject: string;
  isActive: boolean;
}

interface TeacherAssignmentModalProps {
  assignment: Assignment;
  onClose: () => void;
  onUpdateSuccess: (updated: Assignment) => void;
}

const TeacherAssignmentModal: React.FC<TeacherAssignmentModalProps> = ({ 
  assignment, 
  onClose, 
  onUpdateSuccess 
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Assignment>>(assignment);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditFile(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      let uploadedFileUrl = editFormData.fileUrl || "";

      // 1. Upload new file if selected
      if (editFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", editFile);

        const uploadResponse = await fetch("http://localhost:8080/api/assignments/upload", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: uploadFormData,
        });

        if (!uploadResponse.ok) throw new Error("Failed to upload file");
        uploadedFileUrl = await uploadResponse.text();
      }

      // 2. Update Assignment
      const payload = {
        ...editFormData,
        fileUrl: uploadedFileUrl
      };

      const response = await fetch(`http://localhost:8080/api/assignments/${assignment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update assignment");

      const updatedAssignment = await response.json();
      onUpdateSuccess(updatedAssignment);
      setIsEditing(false);
      alert("Assignment updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update assignment.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 transform transition-all scale-100 relative max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
          <h3 className="text-xl font-bold text-slate-800">
            {isEditing ? "Edit Assignment" : "Assignment Details"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Title</label>
              <input 
                type="text" 
                name="title" 
                value={editFormData.title || ""} 
                onChange={handleEditChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Subject</label>
              <input 
                type="text" 
                name="subject" 
                value={editFormData.subject || ""} 
                onChange={handleEditChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Grade</label>
              <input 
                type="text" 
                name="grade" 
                value={editFormData.grade || ""} 
                onChange={handleEditChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Due Date</label>
              <input 
                type="date" 
                name="dueDate" 
                value={editFormData.dueDate || ""} 
                onChange={handleEditChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea 
                name="description" 
                value={editFormData.description || ""} 
                onChange={handleEditChange}
                rows={3}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Replace File (Optional)</label>
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleEditFileChange}
                className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {editFormData.fileUrl && !editFile && (
                <p className="text-xs text-slate-500 mt-1">Current file: ...{editFormData.fileUrl.slice(-20)}</p>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                disabled={updating}
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                {updating && <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-4">
              <DetailRow label="Title" value={assignment.title} />
              <DetailRow label="Subject" value={assignment.subject} />
              <DetailRow label="Grade" value={assignment.grade} />
              <DetailRow label="Due Date" value={assignment.dueDate} />
              
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-sm font-semibold text-slate-500 text-right pr-2">Description:</span>
                <span className="text-sm text-slate-800 font-medium col-span-2 whitespace-pre-wrap">{assignment.description || "—"}</span>
              </div>

              {assignment.fileUrl && (
                <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-500 font-bold uppercase tracking-wider block">Assignment Attachment</span>
                    <div className="flex gap-2">
                      <a 
                        href={assignment.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-white text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg font-bold transition-all border border-slate-100 flex items-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Preview
                      </a>
                      <a 
                        href={assignment.fileUrl} 
                        download
                        className="text-xs bg-primary text-white hover:bg-emerald-600 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => navigate(`/teacher/assignments/${assignment.id}/submissions`)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Submissions
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Assignment
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"
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

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-3 gap-2 py-1">
    <span className="text-sm font-semibold text-slate-500 text-right pr-2">{label}:</span>
    <span className="text-sm text-slate-800 font-medium col-span-2">{value || "—"}</span>
  </div>
);

export default TeacherAssignmentModal;
