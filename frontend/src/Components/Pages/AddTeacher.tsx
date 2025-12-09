import React, { useState } from "react";
import AdminLayout from "../Layout/AdminLayout";

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
      <div className="w-screen bg-white p-8 shadow rounded">
        <h2 className="text-2xl font-bold mb-6 text-black">Add Teacher</h2>

        {responseMsg && (
          <div className="mb-4 text-center font-medium">{responseMsg}</div>
        )}

        <form onSubmit={submitTeacher} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <hr />

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.teacherDetails.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="teacherId"
            placeholder="Teacher ID"
            value={form.teacherDetails.teacherId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={form.teacherDetails.contactNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="nicNumber"
            placeholder="NIC Number"
            value={form.teacherDetails.nicNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="subjects"
            placeholder="Subjects (comma separated)"
            value={form.teacherDetails.subjects}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <select
            name="gender"
            value={form.teacherDetails.gender}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Add Teacher"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddTeacher;
