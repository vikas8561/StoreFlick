import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate
import axios from "axios";
import Header from "../components/Header";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role: string;
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
  };
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const navigate = useNavigate(); // ✅ initialize navigation

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post<ApiResponse>(
        "https://storeflick.onrender.com/user/signup",
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess("Signup successful! Please check your email to verify your account.");
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // ✅ Automatically redirect to verify-email page
        setTimeout(() => {
          navigate("/verify-email");
        }, 1500); // delay for user to see the success message
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Header />
      <div className="w-full max-w-md bg-white p-8 shadow rounded">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
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
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Login
          </a>
        </div>

        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
        {success && (
          <p className="text-green-500 mt-3 text-center">{success}</p>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
