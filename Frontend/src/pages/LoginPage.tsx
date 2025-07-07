import React, { useState, ChangeEvent, FormEvent } from "react";
import Header from "../components/Header";
import axios from "axios";

interface LoginFormData {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    lastLogin?: string;
  };
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post<ApiResponse>(
        "http://localhost:8000/user/login",
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // ✅ Redirect immediately to home page
        window.location.href = "/";
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm p-8 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <div className="text-center mt-4 text-sm">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign up
            </a>
          </div>
          {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
          {success && (
            <p className="text-green-500 mt-3 text-center">{success}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
