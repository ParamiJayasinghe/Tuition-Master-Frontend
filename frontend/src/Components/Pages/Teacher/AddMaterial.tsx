import { useState } from "react";
import TeacherLayout from "../../Layout/TeacherLayout";

const AddMaterial = () => {
  const [formData, setFormData] = useState({
    lessonName: "",
    subject: "",
    grade: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
        let uploadedFileUrl = "";

        // 1. Upload File if selected
        if (file) {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            const uploadResponse = await fetch("http://localhost:8080/api/materials/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: uploadFormData,
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to upload file");
            }

            uploadedFileUrl = await uploadResponse.text();
        } else {
            throw new Error("Please select a file to upload");
        }

        // 2. Create Material with file URL
        const payload = {
            lessonName: formData.lessonName,
            subject: formData.subject,
            grade: formData.grade,
            fileUrl: uploadedFileUrl
        };

      const response = await fetch("http://localhost:8080/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });


      if (!response.ok) {
        throw new Error("Failed to add material");
      }

      setMessage("✅ Material added successfully");
      setFormData({
        lessonName: "",
        subject: "",
        grade: "",
      });
      setFile(null);
    } catch (error: any) {
      console.error(error);
      setMessage(`❌ ${error.message || "Error adding material"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="w-full">
         <div className="bg-white p-8 shadow-glass rounded-xl border border-slate-100 animate-fade-in-up">
            <div className="mb-8">
               <h2 className="text-2xl font-bold text-slate-800">Add New Material</h2>
               <p className="text-slate-500 mt-1">Upload and categorize study materials for students.</p>
            </div>

            {message && (
               <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.includes("✅") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                  {message}
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
               
               <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Material Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Lesson Name</label>
                        <input
                           type="text"
                           name="lessonName"
                           placeholder="e.g. Intro to Algebra"
                           value={formData.lessonName}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                     </div>
                     
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                        <input
                           type="text"
                           name="subject"
                           placeholder="e.g. Mathematics"
                           value={formData.subject}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Grade</label>
                        <input
                           type="text"
                           name="grade"
                           placeholder="e.g. Grade 10"
                           value={formData.grade}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                     </div>

                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Upload File (PDF/Image)</label>
                        <input
                           type="file"
                           accept=".pdf,image/*"
                           onChange={handleFileChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                        {file && <p className="text-sm text-slate-500 mt-1">Selected: {file.name}</p>}
                     </div>

                  </div>
               </div>

               <div className="pt-6">
                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full bg-primary hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg shadow-lg shadow-emerald-500/30 transition-all duration-200 transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                     {loading ? (
                        <span className="flex items-center justify-center gap-2">
                           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Uploading Material...
                        </span>
                     ) : (
                        "Upload Material"
                     )}
                  </button>
               </div>
            </form>
         </div>
      </div>
    </TeacherLayout>
  );
};

export default AddMaterial;
