import React, { useEffect, useState } from "react";
import { dismissFeedback, subscribeToFeedback, toast } from "@/lib/feedbackToast";

const variants = {
  success: {
    title: "Success",
    accent: "bg-[#C01824]",
    soft: "bg-[#FFF4F4]",
    text: "text-[#C01824]",
    icon: "check",
  },
  error: {
    title: "Error",
    accent: "bg-[#C01824]",
    soft: "bg-[#FFF4F4]",
    text: "text-[#C01824]",
    icon: "error",
  },
  loading: {
    title: "Processing",
    accent: "bg-[#C01824]",
    soft: "bg-[#FFF4F4]",
    text: "text-[#C01824]",
    icon: "loading",
  },
  info: {
    title: "Notice",
    accent: "bg-[#C01824]",
    soft: "bg-[#FFF4F4]",
    text: "text-[#C01824]",
    icon: "info",
  },
};

function FeedbackIcon({ type }) {
  if (type === "check") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5L9.5 17L19 7.5" />
      </svg>
    );
  }

  if (type === "error") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7V13" />
        <path d="M12 17H12.01" />
      </svg>
    );
  }

  if (type === "loading") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current" strokeWidth="2.2" strokeLinecap="round">
        <path d="M12 3A9 9 0 1 0 21 12" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V12" />
      <path d="M12 8H12.01" />
    </svg>
  );
}

export default function FeedbackModalHost() {
  const [notification, setNotification] = useState(null);

  useEffect(() => subscribeToFeedback(setNotification), []);

  useEffect(() => {
    if (!import.meta.env.DEV || typeof window === "undefined") {
      return undefined;
    }

    window.previewAppFeedback = (type = "success", message = "Preview message") => {
      const normalizedType = String(type).toLowerCase();

      if (normalizedType === "error") {
        return toast.error(message);
      }

      if (normalizedType === "info") {
        return toast(message);
      }

      if (normalizedType === "loading") {
        return toast.loading(message, { duration: 6000 });
      }

      return toast.success(message);
    };

    return () => {
      delete window.previewAppFeedback;
    };
  }, []);

  useEffect(() => {
    if (!notification?.duration) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dismissFeedback(notification.id);
    }, notification.duration);

    return () => window.clearTimeout(timer);
  }, [notification]);

  if (!notification) {
    return null;
  }

  const variant = variants[notification.type] || variants.info;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/35 px-4 backdrop-blur-[2px]">
      <div
        className="w-full max-w-[420px] overflow-hidden rounded-[24px] border border-[#E8ECF3] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
        role="alertdialog"
        aria-live="assertive"
        aria-modal="true"
      >
        <div className={`h-1.5 w-full ${variant.accent}`} />

        <div className="px-6 pb-6 pt-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${variant.soft}`}>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${variant.accent} text-[11px] font-extrabold tracking-[0.08em] text-white`}
                >
                  <FeedbackIcon type={variant.icon} />
                </div>
              </div>

              <p className={`text-[11px] font-extrabold uppercase tracking-[0.24em] ${variant.text}`}>
                {notification.type || "notice"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dismissFeedback(notification.id)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-sm font-semibold text-[#6B7280] transition hover:bg-[#FAFAFA] hover:text-[#111827]"
              aria-label="Close notification"
            >
              X
            </button>
          </div>

          <h2 className="max-w-[300px] text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#202224]">
            {variant.title}
          </h2>

          <p className="mt-3 text-[15px] leading-7 text-[#6B7280]">
            {notification.message}
          </p>

          <div className="mt-7 flex justify-end">
            <button
              type="button"
              onClick={() => dismissFeedback(notification.id)}
              className="rounded-xl bg-[#C01824] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C01824]/20 transition hover:bg-[#A6131E]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
