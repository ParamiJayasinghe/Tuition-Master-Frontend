import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SignInProps {}

const SignIn: React.FC<SignInProps> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        }
      );

      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      switch (data.role.toUpperCase()) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "TEACHER":
          navigate("/teacher/dashboard");
          break;
        case "STUDENT":
          navigate("/student/dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
    }
  };

  return (
    <div
      className="
        h-screen w-screen flex justify-center items-center 
        bg-gradient-to-br from-[#4e54c8] to-[#8f94fb]
      "
    >
      <form
        onSubmit={handleSubmit}
        className="
          bg-white p-8 rounded-xl shadow-lg w-[350px]
        "
      >
        <h2 className="mb-6 text-center text-black text-2xl font-semibold">
          Sign In
        </h2>

        {error && (
          <div className="text-red-600 mb-4 text-center">{error}</div>
        )}

        <div className="mb-4">
          <label className="text-black">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full p-2 mt-1 rounded-md border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
          />
        </div>

        <div className="mb-4">
          <label className="text-black">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full p-2 mt-1 rounded-md border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
          />
        </div>

        <div className="mb-4">
          <label className="text-black">User Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="
              w-full p-2 mt-1 rounded-md border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
          >
            <option value="Admin">Admin</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
        </div>

        <button
          type="submit"
          className="
            w-full p-3 rounded-md bg-[#646cff] text-white font-bold 
            hover:bg-[#4d56ff] transition cursor-pointer
          "
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
