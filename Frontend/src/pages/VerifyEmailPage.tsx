import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const VerifyEmailPage: React.FC = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "https://storeflick.onrender.com/user/verify-email",
        { code },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess(response.data.message);

        // ✅ Save user and token
        localStorage.setItem("user", JSON.stringify(response.data.user));
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        // ✅ Redirect to dashboard after short delay
        setTimeout(() => {
          window.location.href = "/"; // replace with your actual page
        }, 1500);
      } else {
        setError(response.data.message || "Verification failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 shadow rounded">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Verify Your Email
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            Please enter the 6-digit verification code sent to your email.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="code"
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded text-center tracking-widest text-lg"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Verify
            </button>
          </form>
          {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
          {success && (
            <p className="text-green-500 mt-3 text-center">{success}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
