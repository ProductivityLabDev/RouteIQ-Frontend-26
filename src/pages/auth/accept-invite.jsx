import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { inviteService } from "@/services/vendorService";

export function AcceptInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError("Invite token is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await inviteService.verifyInvite(token);
        setInvite(response.data || null);
        setError("");
      } catch (verifyError) {
        setError(verifyError?.response?.data?.message || "This invite link is invalid or expired.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.password.trim()) {
      setError("Password is required.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await inviteService.acceptInvite({
        token,
        password: form.password,
      });
      setSuccess("Account created successfully. Redirecting to sign in...");
      setError("");
      window.setTimeout(() => navigate("/sign-in-vendor"), 1200);
    } catch (submitError) {
      setError(submitError?.response?.data?.message || "Failed to accept invite.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f5f1e6] px-4 py-10">
      <div className="mx-auto max-w-[640px] rounded-[28px] border border-[#ebe6da] bg-white p-8 shadow-sm md:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c01824]">
            Route IQ Invite
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#171a2a]">Create Your Account</h1>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Use your invite link to set a password and activate your access.
          </p>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl bg-[#f8f5ef] px-5 py-4 text-sm text-[#667085]">
            Verifying invite...
          </div>
        ) : error && !invite ? (
          <div className="mt-8 rounded-2xl bg-[#fff1f3] px-5 py-4 text-sm font-medium text-[#c01824]">
            {error}
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 rounded-2xl bg-[#f8f5ef] p-5 md:grid-cols-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#98A2B3]">Name</div>
                <div className="mt-2 text-sm font-semibold text-[#171a2a]">
                  {invite?.fullName || "--"}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#98A2B3]">Email</div>
                <div className="mt-2 break-all text-sm font-semibold text-[#171a2a]">
                  {invite?.email || "--"}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#98A2B3]">Role</div>
                <div className="mt-2 text-sm font-semibold text-[#171a2a]">
                  {invite?.role || "--"}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#171a2a]">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#171a2a]">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                />
              </div>

              {error ? (
                <div className="rounded-2xl bg-[#fff1f3] px-4 py-3 text-sm font-medium text-[#c01824]">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-2xl bg-[#edf7ef] px-4 py-3 text-sm font-medium text-[#147a38]">
                  {success}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-[#c01824] px-6 py-3 font-semibold text-white transition hover:bg-[#a61520] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 text-sm text-[#667085]">
          Already have access?{" "}
          <Link to="/sign-in-vendor" className="font-semibold text-[#c01824]">
            Go to sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AcceptInvite;
