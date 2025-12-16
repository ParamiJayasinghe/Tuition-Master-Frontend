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

      setMessage("Student added successfully");
      setFormData({
        username: "",
        password: "",
        email: "",
        role: "STUDENT",
        fullName: "",
        studentId: "",
        contactNumber: "",
        subjects: "",
        dateOfBirth: "",
        address: "",
        gender: "",
      });
    } catch (error) {
      setMessage("Error adding student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout>
    <div className="w-screen  mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold text-black mb-6">Add Student</h2>

      {message && (
        <div className="mb-4 text-sm text-blue-600 font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account Info */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />

        {/* Student Details */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="subjects"
            placeholder="Subjects"
            value={formData.subjects}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Student"}
        </button>
      </form>
    </div>
    </TeacherLayout>
  );
};

export default AddStudent;
