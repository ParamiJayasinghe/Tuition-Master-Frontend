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
          username: username, // 🔥 Correct field expected by backend
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
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
        backgroundSize: "cover",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          width: "350px",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "black" }}>
          Sign In
        </h2>

        {error && (
          <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: "black" }}>Username</label> {/* 🔥 Changed */}
          <input
            type="text" // 🔥 Changed from "email"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.3rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: "black" }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.3rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: "black" }}>User Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.3rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="Admin">Admin</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.7rem",
            borderRadius: "6px",
            border: "none",
            background: "#646cff",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
