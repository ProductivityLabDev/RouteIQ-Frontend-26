import React, { useEffect, useState } from "react";

const formatInviteDate = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString();
};

const normalizeInvites = (rows) => {
  if (!Array.isArray(rows)) return [];

  return rows.map((item, index) => ({
    id: item?.id ?? item?.InviteId ?? item?.inviteId ?? index,
    email: item?.email ?? item?.Email ?? "--",
    role: item?.role ?? item?.Role ?? "--",
    fullName: item?.fullName ?? item?.FullName ?? item?.name ?? "--",
    status: item?.status ?? item?.Status ?? "Pending",
    createdAt: item?.createdAt ?? item?.CreatedAt ?? null,
    expiresAt: item?.expiresAt ?? item?.ExpiresAt ?? null,
  }));
};

const deriveInviteName = (email) => {
  const localPart = String(email || "").split("@")[0].trim();
  if (!localPart) return "Invited User";

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export default function InviteManagementPanel({
  title,
  description,
  roleOptions,
  loadInvites,
  createInvite,
  deleteInvite,
  submitLabel = "Send Invite",
  emptyMessage = "No invites sent yet.",
  compact = false,
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: roleOptions?.[0]?.value || "",
  });
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const refreshInvites = async () => {
    try {
      setLoading(true);
      const rows = await loadInvites();
      setInvites(normalizeInvites(rows));
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.response?.data?.message || "Failed to load invites.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshInvites();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (feedback.message) {
      setFeedback({ type: "", message: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.role.trim()) {
      setFeedback({ type: "error", message: "Email and role are required." });
      return;
    }

    try {
      setSaving(true);
      const resolvedFullName = form.fullName.trim() || deriveInviteName(form.email);
      await createInvite({
        fullName: resolvedFullName,
        email: form.email.trim(),
        role: form.role,
      });
      setFeedback({ type: "success", message: "Invite sent successfully." });
      setForm({
        fullName: "",
        email: "",
        role: roleOptions?.[0]?.value || "",
      });
      await refreshInvites();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.response?.data?.message || "Failed to send invite.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (inviteId) => {
    try {
      setDeletingId(inviteId);
      await deleteInvite(inviteId);
      setFeedback({ type: "success", message: "Invite revoked successfully." });
      await refreshInvites();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.response?.data?.message || "Failed to revoke invite.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className={`${compact ? "text-xl" : "text-2xl"} font-bold text-[#171a2a]`}>{title}</h3>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-[#667085]">{description}</p>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px_auto]"}`}
      >
        {!compact ? (
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full rounded-xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
          />
        ) : null}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email address"
          className="w-full rounded-xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full rounded-xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
        >
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#c01824] px-5 py-3 font-semibold text-white transition hover:bg-[#a61520] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Sending..." : submitLabel}
        </button>
      </form>

      {feedback.message ? (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            feedback.type === "error"
              ? "bg-[#fff1f3] text-[#c01824]"
              : "bg-[#edf7ef] text-[#147a38]"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[#ebe6da] bg-white">
        <div className="overflow-x-auto">
          <div className="grid min-w-[760px] grid-cols-[minmax(0,1.4fr)_140px_120px_120px_120px] gap-4 border-b border-[#eee9df] bg-[#f8f5ef] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#667085]">
            <div>Invite</div>
            <div>Role</div>
            <div>Status</div>
            <div>Expires</div>
            <div>Action</div>
          </div>

          {loading ? (
            <div className="px-5 py-6 text-sm text-[#667085]">Loading invites...</div>
          ) : invites.length === 0 ? (
            <div className="px-5 py-6 text-sm text-[#667085]">{emptyMessage}</div>
          ) : (
            invites.map((invite) => (
              <div
                key={invite.id}
                className="grid min-w-[760px] grid-cols-[minmax(0,1.4fr)_140px_120px_120px_120px] gap-4 border-b border-[#f3eee5] px-5 py-4 text-sm text-[#171a2a] last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="truncate font-semibold">{invite.fullName}</div>
                  <div className="truncate text-xs text-[#667085]">{invite.email}</div>
                </div>
                <div className="font-medium">{invite.role}</div>
                <div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      String(invite.status).toLowerCase() === "accepted"
                        ? "bg-[#edf7ef] text-[#147a38]"
                        : String(invite.status).toLowerCase() === "expired"
                        ? "bg-[#fff5e8] text-[#b54708]"
                        : "bg-[#fff1f3] text-[#c01824]"
                    }`}
                  >
                    {invite.status}
                  </span>
                </div>
                <div className="text-[#667085]">{formatInviteDate(invite.expiresAt)}</div>
                <div>
                  <button
                    type="button"
                    disabled={deletingId === invite.id}
                    onClick={() => handleDelete(invite.id)}
                    className="text-sm font-semibold text-[#c01824] transition hover:text-[#9d121e] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === invite.id ? "Revoking..." : "Revoke"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
