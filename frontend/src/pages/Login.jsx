import { useState } from "react";
import { request } from "../api";
import { useNavigate } from "react-router-dom";
import freepikTalk from "../assets/freepik__talk__19417.jpeg";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await request("/auth/login", { method: "POST", body: form });

      if (res.token) {
        localStorage.setItem("token", res.token);
        if (res.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
        }
        nav("/feed");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-stretch gap-16 lg:gap-28">
        {/* Illustration Block */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={freepikTalk}
            alt="Community Illustration"
            className="w-full max-w-[42rem] lg:max-w-[48rem] object-contain"
          />
        </div>

        {/* Form Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[32px] shadow-[0_25px_60px_rgba(62,103,217,0.18)] px-8 py-10 border border-white/60">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-[#1f2a44]">
                Welcome Back
              </h1>
              <p className="text-[#5e6c87] mt-2">
                Enter your credentials to access your account
              </p>
            </div>

            <form className="space-y-4" onSubmit={submit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#1f2a44]">
                  Username
                </label>
                <input
                  className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent focus:border-[#4d6bfe] focus:ring-0 px-4 py-3 text-[#1f2a44] placeholder:text-[#98a0b8] transition"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={(e) => {
                    setForm({ ...form, username: e.target.value });
                    setError("");
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#1f2a44]">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent focus:border-[#4d6bfe] focus:ring-0 px-4 py-3 text-[#1f2a44] placeholder:text-[#98a0b8] transition"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setError("");
                  }}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-[#0a65ff] font-medium hover:underline"
                  onClick={() => nav("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              <button className="w-full bg-[#0a65ff] hover:bg-[#084fcb] text-white font-semibold rounded-2xl py-3.5 mt-4 transition-shadow">
                Login
              </button>

              <p className="text-center text-[#5e6c87] text-sm">
                Don't have an account?{" "}
                <span
                  className="text-[#0a65ff] font-medium cursor-pointer"
                  onClick={() => nav("/")}
                >
                  Sign up
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}