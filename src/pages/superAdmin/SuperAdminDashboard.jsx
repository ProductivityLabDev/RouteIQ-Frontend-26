import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { superAdminService } from "@/services/superAdminService";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
};

const getBarHeight = (value, maxValue, baseHeight = 40, range = 200) => {
  if (!maxValue || maxValue <= 0) return baseHeight;
  return baseHeight + (Number(value || 0) / maxValue) * range;
};

const buildScale = (maxValue, steps = 4) => {
  const safeMax = Math.max(Number(maxValue || 0), 1);
  return Array.from({ length: steps + 1 }, (_, index) => {
    const value = (safeMax / steps) * (steps - index);
    return Math.round(value * 100) / 100;
  });
};

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await superAdminService.getDashboard();
        if (mounted) {
          setStats(data);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load super admin dashboard");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const summaryCards = useMemo(
    () => [
      {
        title: "Net Income",
        value: formatCurrency(stats?.netIncome),
        change: `${stats?.activeVendors ?? 0} active vendors`,
      },
      {
        title: "Total Schools",
        value: String(stats?.totalSchools ?? 0),
        change: `${stats?.pendingReviews ?? 0} pending reviews`,
      },
      {
        title: "Resolved Issues",
        value: String(stats?.resolvedIssues ?? 0),
        change: `${stats?.openEscalations ?? 0} open escalations`,
      },
    ],
    [stats]
  );

  const vendorStats = useMemo(
    () => [
      { label: "Active Vendors", value: String(stats?.activeVendors ?? 0) },
      { label: "Inactive Vendors", value: String(stats?.inactiveVendors ?? 0) },
      { label: "Pending Reviews", value: String(stats?.pendingReviews ?? 0) },
      { label: "Open Escalations", value: String(stats?.openEscalations ?? 0) },
    ],
    [stats]
  );

  const salesMax = Math.max(
    0,
    ...(stats?.salesChart ?? []).flatMap((item) => [item.organic, item.professional])
  );
  const weeklyMax = Math.max(
    0,
    ...(stats?.weeklyChart ?? []).flatMap((item) => [item.total, item.partial])
  );
  const salesRows = stats?.salesChart?.length
    ? stats.salesChart
    : Array.from({ length: 6 }, (_, index) => ({
        label: `M${index + 1}`,
        organic: 0,
        professional: 0,
      }));
  const weeklyRows = stats?.weeklyChart?.length
    ? stats.weeklyChart
    : Array.from({ length: 4 }, (_, index) => ({
        label: `W${index + 1}`,
        total: 0,
        partial: 0,
      }));
  const salesScale = buildScale(salesMax, 4);
  const weeklyScale = buildScale(weeklyMax, 4);
  const salesTotal = salesRows.reduce(
    (sum, item) => sum + Number(item.organic || 0) + Number(item.professional || 0),
    0
  );
  const weeklyTotal = weeklyRows.reduce((sum, item) => sum + Number(item.total || 0), 0);

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
              {loading ? "--" : card.value}
            </p>
            <p className="mt-6 text-lg font-medium text-[#c01824]">
              {loading ? "Loading..." : card.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-[28px] border border-[#ebe6da] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-lg text-[#6f7280]">Overall Sales</p>
              <h3 className="mt-2 text-5xl font-bold text-[#0f1631]">
                {loading ? "--" : formatCurrency(salesTotal)}
              </h3>
              <p className="mt-3 text-sm text-[#7a7f90]">
                Monthly platform collection split across primary and secondary revenue streams.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#fff2f3] px-4 py-2 text-sm font-semibold text-[#c01824]">
                {salesRows.length} reported periods
              </span>
              <div className="flex items-center gap-5 rounded-full border border-[#ebe6da] px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#f1c7cb]" />
                  <span className="text-sm font-medium text-[#6f7280]">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#c01824]" />
                  <span className="text-sm font-medium text-[#6f7280]">Secondary</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] bg-[#fbfaf6] p-5">
            <div className="grid grid-cols-[72px_1fr] gap-4">
              <div className="flex h-[340px] flex-col justify-between pt-2">
                {salesScale.map((tick) => (
                  <span key={tick} className="text-xs font-semibold text-[#8a8f9d]">
                    {formatCurrency(tick)}
                  </span>
                ))}
              </div>
              <div className="relative h-[340px]">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {salesScale.map((tick, index) => (
                    <div
                      key={`${tick}-${index}`}
                      className="border-t border-dashed border-[#e8e1d6]"
                    />
                  ))}
                </div>
                <div className="relative z-10 flex h-full items-end justify-between gap-4">
                  {salesRows.map((item) => (
                    <div key={item.label} className="flex h-full flex-1 flex-col justify-end">
                      <div className="mb-3 text-center">
                        <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#c01824] shadow-sm">
                          {formatCurrency(Number(item.organic || 0) + Number(item.professional || 0))}
                        </div>
                      </div>
                      <div className="flex items-end justify-center gap-2">
                        <div
                          className="w-full max-w-[52px] rounded-t-[18px] bg-[#f7d9dc] transition-all"
                          style={{ height: `${getBarHeight(item.organic, salesMax, 10, 220)}px` }}
                          title={`${item.label}: Primary ${formatCurrency(item.organic)}`}
                        />
                        <div
                          className="w-full max-w-[52px] rounded-t-[18px] bg-[#c01824] transition-all"
                          style={{ height: `${getBarHeight(item.professional, salesMax, 10, 220)}px` }}
                          title={`${item.label}: Secondary ${formatCurrency(item.professional)}`}
                        />
                      </div>
                      <div className="mt-3 text-center text-sm font-semibold text-[#4b5568]">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#ebe6da] bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-3xl font-bold text-[#171a2a]">
                Weekly Transaction Summary
              </h3>
              <p className="mt-2 text-sm text-[#7a7f90]">
                Weekly settlement totals with a secondary comparison layer.
              </p>
            </div>
            <div className="rounded-full bg-[#fff2f3] px-4 py-2 text-sm font-semibold text-[#c01824]">
              {loading ? "--" : formatCurrency(weeklyTotal)}
            </div>
          </div>

          <div className="mt-8 rounded-[24px] bg-[#fbfaf6] p-5">
            <div className="grid grid-cols-[60px_1fr] gap-4">
              <div className="flex h-[300px] flex-col justify-between pt-1">
                {weeklyScale.map((tick) => (
                  <span key={tick} className="text-[11px] font-semibold text-[#8a8f9d]">
                    {formatCurrency(tick)}
                  </span>
                ))}
              </div>
              <div className="relative h-[300px]">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {weeklyScale.map((tick, index) => (
                    <div
                      key={`${tick}-${index}`}
                      className="border-t border-dashed border-[#e8e1d6]"
                    />
                  ))}
                </div>
                <div className="relative z-10 flex h-full items-end justify-between gap-4">
                  {weeklyRows.map((item) => (
                    <div key={item.label} className="flex h-full flex-1 flex-col justify-end">
                      <div className="mb-3 text-center text-xs font-semibold text-[#6f7280]">
                        {formatCurrency(item.total)}
                      </div>
                      <div className="flex items-end justify-center gap-2">
                        <div
                          className="w-full max-w-[34px] rounded-t-full bg-[#6b0d0d]"
                          style={{ height: `${getBarHeight(item.total, weeklyMax, 18, 210)}px` }}
                          title={`${item.label}: Total ${formatCurrency(item.total)}`}
                        />
                        <div
                          className="w-full max-w-[34px] rounded-t-full bg-[#df2b36]"
                          style={{ height: `${getBarHeight(item.partial, weeklyMax, 12, 160)}px` }}
                          title={`${item.label}: Secondary ${formatCurrency(item.partial)}`}
                        />
                      </div>
                      <div className="mt-3 text-center text-sm font-semibold text-[#4b5568]">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {vendorStats.map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-[#ebe6da] bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8e8a80]">
              {item.label}
            </p>
            <p className="mt-4 text-4xl font-bold text-[#0f1631]">
              {loading ? "--" : item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
