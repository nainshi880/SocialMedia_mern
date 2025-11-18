import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request } from "../api";
import freepikTalk from "../assets/freepik__talk__19417.jpeg";

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await request(`/auth/reset-password/${token}`, {
        method: "POST",
        body: { password }
      });
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => nav("/login"), 2000);
    } catch (err) {
      setMessage("Error: " + (err.message || "Failed to reset password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f9ff] flex items-center justify-center px-4 py-10">
      <div className="max-w-5xl flex flex-col md:flex-row rounded-[32px] overflow-hidden shadow-2xl bg-white">
        {/* LEFT IMAGE SECTION */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-10">
          <img
            src={freepikTalk}
            alt="Auth Background"
            className="w-4/5 h-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-white">
          <form
            onSubmit={submit}
            className="w-full max-w-sm space-y-6"
          >
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Reset Password
            </h1>

            <div className="space-y-6">
              <input
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {message && (
              <p className={`text-sm text-center ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

