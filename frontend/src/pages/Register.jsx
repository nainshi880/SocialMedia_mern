import { useState } from "react";
import { request } from "../api";
import { useNavigate } from "react-router-dom";
import freepikTalk from "../assets/freepik__talk__19417.jpeg";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password
      };

      await request("/auth/register", { method: "POST", body: payload });

      const res = await request("/auth/login", {
        method: "POST",
        body: { username: form.username, password: form.password }
      });

      if (res.token) {
        localStorage.setItem("token", res.token);
        if (res.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
        }
        nav("/feed");
      } else {
        nav("/login");
      }
    } catch (err) {
      alert(err.message || "Registration failed");
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
                Create an Account
              </h1>
              <p className="text-[#5e6c87] mt-2">
                Enter your details to get started
              </p>
            </div>

            <form className="space-y-4" onSubmit={submit}>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#1f2a44]">
                  Username
                </label>
                <input
                  className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent focus:border-[#4d6bfe] focus:ring-0 px-4 py-3 text-[#1f2a44] placeholder:text-[#98a0b8] transition"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#1f2a44]">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent focus:border-[#4d6bfe] focus:ring-0 px-4 py-3 text-[#1f2a44] placeholder:text-[#98a0b8] transition"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#1f2a44]">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent focus:border-[#4d6bfe] focus:ring-0 px-4 py-3 text-[#1f2a44] placeholder:text-[#98a0b8] transition"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#1f2a44]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent focus:border-[#4d6bfe] focus:ring-0 px-4 py-3 text-[#1f2a44] placeholder:text-[#98a0b8] transition"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
              </div>

              <button className="w-full bg-[#0a65ff] hover:bg-[#084fcb] text-white font-semibold rounded-2xl py-3.5 mt-6 transition-shadow">
                Sign Up
              </button>

              <p className="text-center text-[#5e6c87] text-sm">
                Already have an account?{" "}
                <span
                  className="text-[#0a65ff] font-medium cursor-pointer"
                  onClick={() => nav("/login")}
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}