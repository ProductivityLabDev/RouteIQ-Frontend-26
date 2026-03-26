import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authBg from "@/assets/authbg.png";

export default function SuperAdminSignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("superadmin@routeiq.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    localStorage.setItem(
      "superAdminSession",
      JSON.stringify({
        active: true,
        email: email.trim(),
        role: "SUPER_ADMIN",
        signedInAt: new Date().toISOString(),
      })
    );

    const nextPath = location.state?.from || "/super-admin/dashboard";
    navigate(nextPath, { replace: true });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f5ef] px-4">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${authBg})` }}
      />
      <div className="absolute inset-0 bg-white/70" />

      <div className="relative z-10 w-full max-w-lg rounded-[32px] border border-[#ebe6da] bg-white p-10 shadow-xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#8e8a80]">
          Route IQ
        </p>
        <h1 className="text-4xl font-bold text-[#171a2a]">Super Admin Sign In</h1>
        <p className="mt-3 text-sm text-[#6e6d67]">
          Separate access for platform-level monitoring and vendor workspace control.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
              placeholder="superadmin@routeiq.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
              placeholder="Enter password"
            />
          </div>

          {error ? <p className="text-sm font-medium text-[#c01824]">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#c01824] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#a61520]"
          >
            Continue to Super Admin
          </button>
        </form>
      </div>
    </section>
  );
}
