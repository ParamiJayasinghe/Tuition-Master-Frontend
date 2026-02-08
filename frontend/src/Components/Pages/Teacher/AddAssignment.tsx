import { useState } from "react";
import TeacherLayout from "../../Layout/TeacherLayout";

const AddAssignment = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    dueDate: "",
    grade: "",
    subject: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Payload matching the user's requirements
    const payload = {
        title: formData.title,
        description: formData.description,
        fileUrl: formData.fileUrl,
        dueDate: formData.dueDate,
        grade: formData.grade,
        subject: formData.subject
    };

    try {
      const response = await fetch("http://localhost:8080/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });


      if (!response.ok) {
        throw new Error("Failed to add assignment");
      }

      setMessage("✅ Assignment added successfully");
      setFormData({
        title: "",
        description: "",
        fileUrl: "",
        dueDate: "",
        grade: "",
        subject: "",
      });
    } catch (error) {
      setMessage("❌ Error adding assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="w-full">
         <div className="bg-white p-8 shadow-glass rounded-xl border border-slate-100 animate-fade-in-up">
            <div className="mb-8">
               <h2 className="text-2xl font-bold text-slate-800">Add New Assignment</h2>
               <p className="text-slate-500 mt-1">Create and post a new assignment for students.</p>
            </div>

            {message && (
               <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.includes("✅") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                  {message}
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
               
               {/* Assignment Details */}
               <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Assignment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                        <input
                           type="text"
                           name="title"
                           placeholder="e.g. Algebra Homework 2"
                           value={formData.title}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                     </div>
                     
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                           name="description"
                           placeholder="Detailed description of the assignment..."
                           value={formData.description}
                           onChange={handleChange}
                           required
                           rows={4}
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                        />
                     </div>

                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">File URL (Optional)</label>
                        <input
                           type="url"
                           name="fileUrl"
                           placeholder="https://example.com/assignment.pdf"
                           value={formData.fileUrl}
                           onChange={handleChange}
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

                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                        <input
                           type="date"
                           name="dueDate"
                           value={formData.dueDate}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
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
                           Posting Assignment...
                        </span>
                     ) : (
                        "Post Assignment"
                     )}
                  </button>
               </div>
            </form>
         </div>
      </div>
    </TeacherLayout>
  );
};

export default AddAssignment;
