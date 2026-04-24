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

  const salesMax = Math.max(0, ...(stats?.salesChart ?? []).map((item) => Number(item.total || 0)));
  const weeklyMax = Math.max(0, ...(stats?.weeklyChart ?? []).map((item) => Number(item.total || 0)));
  const salesRows = stats?.salesChart?.length
    ? stats.salesChart
    : Array.from({ length: 6 }, (_, index) => ({
        label: `M${index + 1}`,
        total: 0,
      }));
  const weeklyRows = stats?.weeklyChart?.length
    ? stats.weeklyChart
    : Array.from({ length: 4 }, (_, index) => ({
        label: `W${index + 1}`,
        total: 0,
      }));
  const salesScale = buildScale(salesMax, 4);
  const weeklyScale = buildScale(weeklyMax, 4);
  const salesTotal = salesRows.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const weeklyTotal = weeklyRows.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const activeSalesPeriods = salesRows.filter((item) => Number(item.total || 0) > 0);
  const activeWeeklyPeriods = weeklyRows.filter((item) => Number(item.total || 0) > 0);
  const zeroSalesPeriods = salesRows.length - activeSalesPeriods.length;
  const zeroWeeklyPeriods = weeklyRows.length - activeWeeklyPeriods.length;
  const peakSalesPeriod = activeSalesPeriods.reduce(
    (top, item) => (Number(item.total || 0) > Number(top?.total || 0) ? item : top),
    null
  );
  const peakWeeklyPeriod = activeWeeklyPeriods.reduce(
    (top, item) => (Number(item.total || 0) > Number(top?.total || 0) ? item : top),
    null
  );
  const averageSalesPeriodTotal = activeSalesPeriods.length
    ? salesTotal / activeSalesPeriods.length
    : 0;
  const averageWeeklyPeriodTotal = activeWeeklyPeriods.length
    ? weeklyTotal / activeWeeklyPeriods.length
    : 0;
  const latestActiveSalesPeriod = [...salesRows]
    .reverse()
    .find((item) => Number(item.total || 0) > 0);
  const latestActiveWeeklyPeriod = [...weeklyRows]
    .reverse()
    .find((item) => Number(item.total || 0) > 0);

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
                Monthly platform collections across the reported periods.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#fff2f3] px-4 py-2 text-sm font-semibold text-[#c01824]">
                {salesRows.length} reported periods
              </span>
              <span className="rounded-full border border-[#ebe6da] px-4 py-2 text-sm font-medium text-[#6f7280]">
                {activeSalesPeriods.length} active months
              </span>
              {peakSalesPeriod ? (
                <span className="rounded-full border border-[#f3d8dc] bg-[#fff7f8] px-4 py-2 text-sm font-medium text-[#a5121d]">
                  Peak {peakSalesPeriod.label}: {formatCurrency(peakSalesPeriod.total)}
                </span>
              ) : null}
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
                        <div
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                            Number(item.total || 0) > 0
                              ? "bg-white text-[#c01824]"
                              : "bg-[#f7f3ed] text-[#9da3af]"
                          }`}
                        >
                          {formatCurrency(Number(item.total || 0))}
                        </div>
                      </div>
                      <div className="flex items-end justify-center">
                        <div
                          className={`w-full max-w-[58px] rounded-t-[18px] transition-all ${
                            Number(item.total || 0) <= 0
                              ? "bg-[#efe8dc]"
                              : peakSalesPeriod?.label === item.label
                                ? "bg-[#c01824]"
                                : "bg-[#f3cfd4]"
                          }`}
                          style={{ height: `${getBarHeight(item.total, salesMax, 6, 220)}px` }}
                          title={`${item.label}: ${formatCurrency(item.total)}`}
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

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="rounded-[20px] border border-[#ebe6da] bg-[#fffaf7] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b9387]">
                Peak Month
              </p>
              <p className="mt-2 text-lg font-bold text-[#0f1631]">
                {loading ? "--" : peakSalesPeriod?.label ?? "None"}
              </p>
              <p className="mt-1 text-sm text-[#c01824]">
                {loading ? "--" : formatCurrency(peakSalesPeriod?.total || 0)}
              </p>
            </div>
            <div className="rounded-[20px] border border-[#ebe6da] bg-[#fffaf7] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b9387]">
                Active-Month Avg
              </p>
              <p className="mt-2 text-lg font-bold text-[#0f1631]">
                {loading ? "--" : formatCurrency(averageSalesPeriodTotal)}
              </p>
              <p className="mt-1 text-sm text-[#7a7f90]">
                based on {activeSalesPeriods.length} active months
              </p>
            </div>
            <div className="rounded-[20px] border border-[#ebe6da] bg-[#fffaf7] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b9387]">
                Latest Activity
              </p>
              <p className="mt-2 text-lg font-bold text-[#0f1631]">
                {loading ? "--" : latestActiveSalesPeriod?.label ?? "None"}
              </p>
              <p className="mt-1 text-sm text-[#7a7f90]">
                {loading ? "--" : formatCurrency(latestActiveSalesPeriod?.total || 0)}
              </p>
            </div>
            <div className="rounded-[20px] border border-[#ebe6da] bg-[#fffaf7] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b9387]">
                Zero Months
              </p>
              <p className="mt-2 text-lg font-bold text-[#0f1631]">
                {loading ? "--" : zeroSalesPeriods}
              </p>
              <p className="mt-1 text-sm text-[#7a7f90]">
                no collection reported
              </p>
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
                Weekly settlement totals with a simple week-by-week trend view.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="rounded-full bg-[#fff2f3] px-4 py-2 text-sm font-semibold text-[#c01824]">
                {loading ? "--" : formatCurrency(weeklyTotal)}
              </div>
              <div className="text-xs font-medium text-[#7a7f90]">
                {activeWeeklyPeriods.length} active weeks
              </div>
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
                      <div
                        className={`mb-3 text-center text-xs font-semibold ${
                          Number(item.total || 0) > 0 ? "text-[#6f7280]" : "text-[#b8b1a5]"
                        }`}
                      >
                        {formatCurrency(item.total)}
                      </div>
                      <div className="flex items-end justify-center">
                        <div
                          className={`w-full max-w-[38px] rounded-t-full ${
                            Number(item.total || 0) <= 0
                              ? "bg-[#efe8dc]"
                              : peakWeeklyPeriod?.label === item.label
                                ? "bg-[#7f0d15]"
                                : "bg-[#c01824]"
                          }`}
                          style={{ height: `${getBarHeight(item.total, weeklyMax, 6, 210)}px` }}
                          title={`${item.label}: Total ${formatCurrency(item.total)}`}
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

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-[20px] border border-[#ebe6da] bg-[#fffaf7] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b9387]">
                Peak Week
              </p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <p className="text-lg font-bold text-[#0f1631]">
                  {loading ? "--" : peakWeeklyPeriod?.label ?? "None"}
                </p>
                <p className="text-sm font-semibold text-[#c01824]">
                  {loading ? "--" : formatCurrency(peakWeeklyPeriod?.total || 0)}
                </p>
              </div>
            </div>
            <div className="rounded-[20px] border border-[#ebe6da] bg-[#fffaf7] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b9387]">
                Weekly Pattern
              </p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-[#0f1631]">
                  Avg {loading ? "--" : formatCurrency(averageWeeklyPeriodTotal)}
                </p>
                <p className="text-sm text-[#7a7f90]">
                  {loading
                    ? "--"
                    : `${activeWeeklyPeriods.length} active / ${zeroWeeklyPeriods} zero weeks`}
                </p>
              </div>
              <p className="mt-2 text-sm text-[#7a7f90]">
                Latest active week:{" "}
                <span className="font-semibold text-[#0f1631]">
                  {loading ? "--" : latestActiveWeeklyPeriod?.label ?? "None"}
                </span>
              </p>
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
