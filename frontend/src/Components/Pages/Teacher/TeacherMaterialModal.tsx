import React, { useState } from "react";

interface Material {
  id: number;
  lessonName: string;
  subject: string;
  grade: string;
  fileUrl: string;
  createdAt: string;
}

interface TeacherMaterialModalProps {
  material: Material;
  onClose: () => void;
  onUpdateSuccess: (updated: Material) => void;
  onDeleteSuccess: (id: number) => void;
}

const TeacherMaterialModal: React.FC<TeacherMaterialModalProps> = ({
  material,
  onClose,
  onUpdateSuccess,
  onDeleteSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...material });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      let finalFileUrl = formData.fileUrl;

      // 1. Upload new file if selected
      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        const uploadRes = await fetch("http://localhost:8080/api/materials/upload", {
          method: "POST",
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
          body: uploadFormData,
        });
        if (uploadRes.ok) {
           finalFileUrl = await uploadRes.text();
        }
      }

      // 2. Update material metadata
      const response = await fetch(`http://localhost:8080/api/materials/${material.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...formData, fileUrl: finalFileUrl }),
      });

      if (!response.ok) throw new Error("Failed to update material");
      
      const updated = await response.json();
      onUpdateSuccess(updated);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Error updating material");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/materials/${material.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to delete material");
      onDeleteSuccess(material.id);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error deleting material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">
            {isEditing ? "Edit Material" : "Material Details"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            ✕
          </button>
        </div>

        <div className="p-8 space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lesson Name</label>
                <input
                  name="lessonName"
                  value={formData.lessonName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Grade</label>
                  <input
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Change File (Optional)</label>
                 <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                 />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{material.subject} • {material.grade}</p>
                   <h4 className="text-2xl font-bold text-slate-800">{material.lessonName}</h4>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                       📄
                    </div>
                    <div>
                       <p className="text-sm font-medium text-slate-800">Study Material</p>
                       <p className="text-xs text-slate-500">Uploaded on {new Date(material.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <a 
                    href={material.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                 >
                    View File
                 </a>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              >
                Edit Details
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-rose-50 border border-rose-200 text-rose-600 py-2 rounded-lg font-semibold hover:bg-rose-100 transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherMaterialModal;
