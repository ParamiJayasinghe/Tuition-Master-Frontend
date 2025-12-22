import { useState } from "react";
import TeacherLayout from "../../Layout/TeacherLayout";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "STUDENT",
    fullName: "",
    studentId: "",
    contactNumber: "",
    grade: "",
    subjects: "",
    dateOfBirth: "",
    address: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      role: "STUDENT",
      studentDetails: {
        fullName: formData.fullName,
        studentId: formData.studentId,
        contactNumber: formData.contactNumber,
        grade: formData.grade,
        subjects: formData.subjects,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        gender: formData.gender,
      },
    };

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });


      if (!response.ok) {
        throw new Error("Failed to add student");
      }

      setMessage("✅ Student added successfully");
      setFormData({
        username: "",
        password: "",
        email: "",
        role: "STUDENT",
        fullName: "",
        studentId: "",
        contactNumber: "",
        grade: "",
        subjects: "",
        dateOfBirth: "",
        address: "",
        gender: "",
      });
    } catch (error) {
      setMessage("❌ Error adding student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="w-full">
         <div className="bg-white p-8 shadow-glass rounded-xl border border-slate-100 animate-fade-in-up">
            <div className="mb-8">
               <h2 className="text-2xl font-bold text-slate-800">Add New Student</h2>
               <p className="text-slate-500 mt-1">Register a new student to the system.</p>
            </div>

            {message && (
               <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.includes("✅") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                  {message}
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
               
               {/* Account Info */}
               <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                        <input
                           type="text"
                           name="username"
                           placeholder="e.g. jdoe_student"
                           value={formData.username}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input
                           type="password"
                           name="password"
                           placeholder="••••••••"
                           value={formData.password}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                     </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <input
                           type="email"
                           name="email"
                           placeholder="email@example.com"
                           value={formData.email}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                     </div>
                  </div>
               </div>

               {/* Personal Details */}
               <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <input
                           type="text"
                           name="fullName"
                           placeholder="e.g. John Doe"
                           value={formData.fullName}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Student ID</label>
                        <input
                           type="text"
                           name="studentId"
                           placeholder="e.g. S-2024-001"
                           value={formData.studentId}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label>
                        <input
                           type="text"
                           name="contactNumber"
                           placeholder="+1 234..."
                           value={formData.contactNumber}
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
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subjects</label>
                        <input
                           type="text"
                           name="subjects"
                           placeholder="e.g. Math, Science"
                           value={formData.subjects}
                           onChange={handleChange}
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                         <select
                           name="gender"
                           value={formData.gender}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                         >
                           <option value="">Select Gender</option>
                           <option value="Male">Male</option>
                           <option value="Female">Female</option>
                         </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                        <input
                           type="date"
                           name="dateOfBirth"
                           value={formData.dateOfBirth}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                        <input
                           type="text"
                           name="address"
                           placeholder="Full Address"
                           value={formData.address}
                           onChange={handleChange}
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
                           Saving...
                        </span>
                     ) : (
                        "Add Student"
                     )}
                  </button>
               </div>
            </form>
         </div>
      </div>
    </TeacherLayout>
  );
};

export default AddStudent;
