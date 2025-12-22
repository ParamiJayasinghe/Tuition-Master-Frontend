import React, { useState } from "react";
import AdminLayout from "../../Layout/AdminLayout";

interface TeacherDetails {
  fullName: string;
  contactNumber: string;
  nicNumber: string;
  teacherId: string;
  subjects: string;
  gender: string;
}

interface AddTeacherForm {
  username: string;
  password: string;
  email: string;
  role: "TEACHER";
  teacherDetails: TeacherDetails;
}

const AddTeacher: React.FC = () => {
  const [form, setForm] = useState<AddTeacherForm>({
    username: "",
    password: "",
    email: "",
    role: "TEACHER",
    teacherDetails: {
      fullName: "",
      contactNumber: "",
      nicNumber: "",
      teacherId: "",
      subjects: "",
      gender: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name in form.teacherDetails) {
      setForm({
        ...form,
        teacherDetails: {
          ...form.teacherDetails,
          [name]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value } as AddTeacherForm);
    }
  };

  const submitTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Admin not authenticated");

      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg);
      }

      setResponseMsg("✅ Teacher created successfully");
      setForm({
        username: "",
        password: "",
        email: "",
        role: "TEACHER",
        teacherDetails: {
          fullName: "",
          contactNumber: "",
          nicNumber: "",
          teacherId: "",
          subjects: "",
          gender: "",
        },
      });
    } catch (err: any) {
      setResponseMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="bg-white p-8 shadow-glass rounded-xl border border-slate-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Add New Teacher</h2>
            <p className="text-slate-500 mt-1">Create a new teacher account and profile.</p>
          </div>

          {responseMsg && (
            <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${responseMsg.includes("✅") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
              {responseMsg}
            </div>
          )}

          <form onSubmit={submitTeacher} className="space-y-6">
            
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="e.g. jdoe123"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="e.g. John Doe"
                    value={form.teacherDetails.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Teacher ID</label>
                  <input
                    type="text"
                    name="teacherId"
                    placeholder="e.g. T-2024-001"
                    value={form.teacherDetails.teacherId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    placeholder="e.g. +1 234 567 890"
                    value={form.teacherDetails.contactNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">NIC Number</label>
                  <input
                    type="text"
                    name="nicNumber"
                    placeholder="National Identity Card"
                    value={form.teacherDetails.nicNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={form.teacherDetails.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subjects</label>
                  <input
                    type="text"
                    name="subjects"
                    placeholder="e.g. Mathematics, Science"
                    value={form.teacherDetails.subjects}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg shadow-lg shadow-emerald-500/30 transition-all duration-200 transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Teacher...
                  </span>
                ) : (
                  "Create Teacher Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddTeacher;
