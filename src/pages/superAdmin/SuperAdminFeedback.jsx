import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import vendorFeedbackService from "@/services/vendorFeedbackService";

const statusColors = {
  Open: "bg-[#F9E8E9] text-[#C01824]",
  Read: "bg-[#EEF5FF] text-[#246BFD]",
  Resolved: "bg-[#EAF9F0] text-[#1F9254]",
  Pending: "bg-[#FFF7E8] text-[#B7791F]",
};

const ratingColors = {
  Positive: "bg-[#EAF9F0] text-[#1F9254]",
  Negative: "bg-[#F9E8E9] text-[#C01824]",
};

const FEEDBACK_TYPES = ["Complaint", "Suggestion", "Issue", "Appreciation", "General"];

const formatDateTime = (value) => {
  if (!value) return "--";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? String(value)
    : parsed.toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      });
};

const formatTime = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? ""
    : parsed.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
};

const StatCard = ({ label, value }) => (
  <div className="rounded-3xl border border-[#ebe6da] bg-white p-5 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8e8a80]">{label}</p>
    <div className="mt-3 text-3xl font-extrabold text-[#171a2a]">{value}</div>
  </div>
);

export default function SuperAdminFeedback() {
  const [stats, setStats] = useState({ total: 0, positive: 0, negative: 0, open: 0, resolved: 0 });
  const [filters, setFilters] = useState({
    search: "",
    feedbackType: "",
    status: "",
    limit: 20,
    offset: 0,
  });
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const response = await vendorFeedbackService.getSuperAdminStats();
      setStats(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load feedback stats");
    } finally {
      setLoadingStats(false);
    }
  };

  const loadList = async () => {
    try {
      setLoadingList(true);
      const response = await vendorFeedbackService.getSuperAdminFeedbackList({
        ...filters,
        search: filters.search.trim() || undefined,
        feedbackType: filters.feedbackType || undefined,
        status: filters.status || undefined,
      });
      const items = response.data || [];
      setFeedbackList(items);
      setSelectedId((prev) => {
        if (prev && items.some((item) => item.FeedbackId === prev)) return prev;
        return items[0]?.FeedbackId ?? null;
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load feedback list");
    } finally {
      setLoadingList(false);
    }
  };

  const loadDetail = async (feedbackId) => {
    if (!feedbackId) {
      setSelectedFeedback(null);
      return;
    }

    try {
      setLoadingDetail(true);
      const response = await vendorFeedbackService.getSuperAdminFeedbackDetail(feedbackId);
      setSelectedFeedback(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load feedback detail");
      setSelectedFeedback(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadList();
  }, [filters]);

  useEffect(() => {
    loadDetail(selectedId);
  }, [selectedId]);

  const detailData = useMemo(
    () => selectedFeedback || feedbackList.find((item) => item.FeedbackId === selectedId) || null,
    [feedbackList, selectedFeedback, selectedId]
  );

  const detailMeta = useMemo(() => {
    if (!detailData) return "";
    return detailData.email || detailData.companyName || detailData.senderType || "";
  }, [detailData]);

  const derivedStats = useMemo(() => {
    const total = feedbackList.length;
    const positive = feedbackList.filter((item) => String(item.Rating || "").toLowerCase() === "positive").length;
    const negative = feedbackList.filter((item) => String(item.Rating || "").toLowerCase() === "negative").length;
    const open = feedbackList.filter((item) => String(item.Status || "").toLowerCase() === "open").length;
    const resolved = feedbackList.filter((item) => String(item.Status || "").toLowerCase() === "resolved").length;

    return {
      total: stats.total || total,
      positive: stats.positive || positive,
      negative: stats.negative || negative,
      open: stats.open || open,
      resolved: stats.resolved || resolved,
    };
  }, [feedbackList, stats]);

  const handleStatusUpdate = async (status) => {
    if (!selectedId) return;

    try {
      setUpdatingStatus(true);
      await vendorFeedbackService.updateSuperAdminFeedbackStatus(selectedId, status);
      toast.success("Feedback status updated");
      setSelectedFeedback((prev) => (prev ? { ...prev, Status: status } : prev));
      setFeedbackList((prev) =>
        prev.map((item) => (item.FeedbackId === selectedId ? { ...item, Status: status } : item))
      );
      loadStats();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update feedback status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <StatCard label="Total" value={loadingStats ? "..." : derivedStats.total} />
        <StatCard label="Open" value={loadingStats ? "..." : derivedStats.open} />
        <StatCard label="Resolved" value={loadingStats ? "..." : derivedStats.resolved} />
        <StatCard label="Positive" value={loadingStats ? "..." : derivedStats.positive} />
        <StatCard label="Negative" value={loadingStats ? "..." : derivedStats.negative} />
      </div>

      <div className="rounded-3xl border border-[#ebe6da] bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#171a2a]">Company Feedback</h3>
            <p className="mt-1 text-sm text-[#7c7a73]">
              Review vendor feedback, inspect details, and update resolution status.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              type="text"
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, search: event.target.value, offset: 0 }))
              }
              placeholder="Search"
              className="rounded-2xl border border-[#e6dfd2] bg-[#fbfaf7] px-4 py-3 text-sm outline-none"
            />
            <select
              value={filters.feedbackType}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, feedbackType: event.target.value, offset: 0 }))
              }
              className="rounded-2xl border border-[#e6dfd2] bg-[#fbfaf7] px-4 py-3 text-sm outline-none"
            >
              <option value="">All Types</option>
              {FEEDBACK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, status: event.target.value, offset: 0 }))
              }
              className="rounded-2xl border border-[#e6dfd2] bg-[#fbfaf7] px-4 py-3 text-sm outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Read">Read</option>
              <option value="Resolved">Resolved</option>
              <option value="Pending">Pending</option>
            </select>
            <select
              value={filters.limit}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, limit: Number(event.target.value), offset: 0 }))
              }
              className="rounded-2xl border border-[#e6dfd2] bg-[#fbfaf7] px-4 py-3 text-sm outline-none"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-3xl border border-[#ebe6da]">
            <table className="min-w-full">
              <thead className="bg-[#f3f1eb]">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.15em] text-[#6f7280]">
                  <th className="px-5 py-4">Company / Contact</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="w-[96px] px-4 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {loadingList ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-sm text-[#7c7a73]">
                      Loading feedback...
                    </td>
                  </tr>
                ) : feedbackList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-sm text-[#7c7a73]">
                      No feedback found.
                    </td>
                  </tr>
                ) : (
                  feedbackList.map((item) => (
                    <tr
                      key={item.FeedbackId}
                      onClick={() => setSelectedId(item.FeedbackId)}
                      className={`cursor-pointer border-t border-[#eee9df] text-sm text-[#171a2a] ${
                        selectedId === item.FeedbackId ? "bg-[#fff7f7]" : "hover:bg-[#fbfaf7]"
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold">{item.senderName || "--"}</div>
                        <div className="mt-1 text-xs text-[#7c7a73] truncate">{item.Subject || "--"}</div>
                      </td>
                      <td className="px-5 py-4">{item.FeedbackType || "--"}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[item.Status] || "bg-[#f3f4f6] text-[#5d6372]"}`}>
                          {item.Status || "--"}
                        </span>
                      </td>
                      <td className="w-[96px] px-4 py-4 text-right align-top">
                        <div className="text-xs font-medium leading-4 text-[#5d6372]">
                          {formatDateTime(item.CreatedAt)}
                        </div>
                        <div className="mt-1 text-[11px] leading-4 text-[#9aa1af]">
                          {formatTime(item.CreatedAt) || "--"}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="rounded-3xl border border-[#ebe6da] bg-[#fbfaf7] p-6">
            {!selectedId ? (
              <div className="py-10 text-center text-sm text-[#7c7a73]">Select a feedback item to view details.</div>
            ) : loadingDetail ? (
              <div className="py-10 text-center text-sm text-[#7c7a73]">Loading feedback detail...</div>
            ) : !detailData ? (
              <div className="py-10 text-center text-sm text-[#7c7a73]">Feedback detail not found.</div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8a80]">Feedback Detail</p>
                    <h4 className="mt-2 text-2xl font-bold text-[#171a2a]">{detailData.Subject || "--"}</h4>
                    <p className="mt-2 text-sm text-[#7c7a73]">
                      {detailData.senderName || "--"}
                      {detailMeta ? ` (${detailMeta})` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[detailData.Status] || "bg-[#f3f4f6] text-[#5d6372]"}`}>
                      {detailData.Status || "--"}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ratingColors[detailData.Rating] || "bg-[#f3f4f6] text-[#5d6372]"}`}>
                      {detailData.Rating || "--"}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#5d6372]">
                      {detailData.FeedbackType || "--"}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#ebe6da] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8a80]">Message</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#202336]">
                    {detailData.Message || detailData.messagePreview || "--"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#ebe6da] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8a80]">Created</p>
                    <p className="mt-2 text-sm text-[#202336]">{formatDateTime(detailData.CreatedAt)}</p>
                  </div>
                  <div className="rounded-2xl border border-[#ebe6da] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8a80]">Updated</p>
                    <p className="mt-2 text-sm text-[#202336]">{formatDateTime(detailData.UpdatedAt)}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#ebe6da] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8a80]">Actions</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {["Open", "Read", "Resolved"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusUpdate(status)}
                        disabled={updatingStatus}
                        className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
                          detailData.Status === status
                            ? "bg-[#c01824] text-white"
                            : "border border-[#ddd5c7] bg-white text-[#171a2a] hover:bg-[#f7f5ef]"
                        } disabled:cursor-not-allowed disabled:opacity-70`}
                      >
                        {updatingStatus ? "Updating..." : `Mark as ${status}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
