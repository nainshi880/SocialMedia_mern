import { useState } from "react";
import { request } from "../api";
import { useNavigate } from "react-router-dom";
import freepikTalk from "../assets/freepik__talk__19417.jpeg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await request("/auth/forgot-password", {
        method: "POST",
        body: { email }
      });
      setMessage(res.message || "Password reset link sent! Check your email.");
      if (res.resetUrl) {
        setMessage(`Password reset link: ${res.resetUrl}`);
      }
    } catch (err) {
      setMessage("Error: " + (err.message || "Failed to send reset link"));
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
              Forgot Password
            </h1>
            <p className="text-center text-gray-600 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-center text-gray-600 text-sm">
              Remember your password?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => window.location.href = "/login"}
              >
                Log in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

