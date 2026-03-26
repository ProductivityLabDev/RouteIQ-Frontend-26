import React from "react";

const summaryCards = [
  {
    title: "Net Income",
    value: "$8,245.00",
    change: "-0.5% from last week",
  },
  {
    title: "Total Schools",
    value: "256",
    change: "+1.0% from last week",
  },
  {
    title: "Resolved Issues",
    value: "1,256",
    change: "+1.0% from last week",
  },
];

const vendors = [
  { label: "Active Vendors", value: "84" },
  { label: "Inactive Vendors", value: "12" },
  { label: "Pending Reviews", value: "07" },
  { label: "Open Escalations", value: "19" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-[28px] border border-[#ebe6da] bg-white p-8 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-[#171a2a]">{card.title}</h3>
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-[#f1c7cb]" />
                <span className="h-3 w-3 rounded-full bg-[#c01824]" />
              </div>
            </div>
            <p className="mt-12 text-5xl font-bold tracking-tight text-[#0f1631]">
              {card.value}
            </p>
            <p className="mt-6 text-lg font-medium text-[#c01824]">{card.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-[28px] border border-[#ebe6da] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-[#6f7280]">Overall Sales</p>
              <h3 className="mt-2 text-5xl font-bold text-[#0f1631]">$56,345.98</h3>
            </div>
            <div className="rounded-full bg-[#c01824] px-4 py-2 text-sm font-semibold text-white">
              +23.5%
            </div>
          </div>

          <div className="mt-10 flex h-[320px] items-end justify-between gap-4">
            {[42, 55, 47, 61, 39, 58, 52].map((height, index) => (
              <div key={index} className="flex flex-1 items-end gap-2">
                <div
                  className="w-full rounded-t-[18px] bg-[#f7d9dc]"
                  style={{ height: `${height + 80}px` }}
                />
                <div
                  className="w-full rounded-t-[18px] bg-[#c01824]"
                  style={{ height: `${height + 20}px` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#ebe6da] bg-white p-8 shadow-sm">
          <h3 className="text-3xl font-bold text-[#171a2a]">
            Weekly Transaction Summary
          </h3>
          <div className="mt-10 flex h-[320px] items-end justify-between gap-3">
            {[58, 45, 63, 37, 41, 72, 49].map((height, index) => (
              <div key={index} className="flex flex-1 items-end gap-1">
                <div
                  className="w-full rounded-full bg-[#5a0a0a]"
                  style={{ height: `${height + 35}px` }}
                />
                <div
                  className="w-full rounded-full bg-[#d5282f]"
                  style={{ height: `${height}px` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {vendors.map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-[#ebe6da] bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8e8a80]">
              {item.label}
            </p>
            <p className="mt-4 text-4xl font-bold text-[#0f1631]">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
