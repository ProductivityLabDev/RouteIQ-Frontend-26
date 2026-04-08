import React, { useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiUser } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Line,
  Tooltip,
} from "recharts";
import { kpiService } from "@/services/kpiService";
import CustomerSatisfactionCard from "./CustomerSatisfactionCard";

const COLORS = ["#333333", "#8B0000", "#B91C1C", "#EF4444", "#FCA5A5", "#FECACA"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const toArray = (v) => (Array.isArray(v) ? v : Array.isArray(v?.data) ? v.data : []);
const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const money = (v) => `$${num(v).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const compact = (v) => {
  const n = num(v);
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n.toFixed(0)}`;
};
const pct = (v) => `${num(v).toFixed(2)}%`;

const KPIScreen = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({});
  const [revenueChart, setRevenueChart] = useState([]);
  const [currentStatistic, setCurrentStatistic] = useState([]);
  const [invoiceOverview, setInvoiceOverview] = useState({});
  const [satisfaction, setSatisfaction] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [sum, rev, stat, inv, sat] = await Promise.all([
          kpiService.getSummary(),
          kpiService.getRevenueChart(year),
          kpiService.getCurrentStatistic(year),
          kpiService.getInvoiceOverview(year),
          kpiService.getSatisfaction(year, month),
        ]);
        if (cancelled) return;
        setSummary(sum || {});
        setRevenueChart(toArray(rev?.months || rev?.data || rev));
        setCurrentStatistic(toArray(stat?.breakdown || stat?.data || stat));
        setInvoiceOverview(inv || {});
        setSatisfaction(toArray(sat?.days || sat?.data || sat));
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || e?.message || "Failed to load KPI data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const cardData = useMemo(() => {
    const s = summary?.summary || summary || {};
    return [
      { label: "Total Revenue", value: money(s.totalRevenue ?? s.revenueLastMonth) },
      { label: "Average Invoice Value", value: money(s.averageInvoiceValue ?? s.avgInvoiceValue) },
      { label: "Activities Count", value: num(s.activitiesCount ?? s.activityCount) },
      { label: "Total Invoices", value: num(s.totalInvoices ?? s.invoiceCount) },
      { label: "Conversion Rate", value: `${num(s.conversionRate).toFixed(2)}%` },
    ];
  }, [summary]);

  const revenueData = useMemo(() => {
    const arr = toArray(revenueChart);
    if (arr.length === 0) {
      return MONTHS.map((m) => ({ name: m, revenue: 0, netProfit: 0 }));
    }
    return arr.map((r, i) => ({
      name: r?.month || r?.name || MONTHS[i] || `M${i + 1}`,
      revenue: num(r?.totalRevenue ?? r?.revenue ?? r?.total),
      netProfit: num(r?.netProfit ?? r?.profit ?? r?.net),
    }));
  }, [revenueChart]);

  const donutData = useMemo(() => {
    const arr = toArray(currentStatistic);
    return arr.map((r, i) => ({
      name: r?.name || r?.type || `Type ${i + 1}`,
      value: num(r?.value ?? r?.amount ?? r?.revenue ?? r?.total),
      color: COLORS[i % COLORS.length],
    }));
  }, [currentStatistic]);

  const invoiceStats = useMemo(() => {
    const d = invoiceOverview?.data || invoiceOverview || {};
    return [
      { label: "Total Invoices", value: num(d.totalInvoices), growth: num(d.invoicesGrowth) },
      { label: "Growth Rate", value: `${num(d.growthRate).toFixed(2)}%`, growth: num(d.growthRate) },
      { label: "Conversion Rate", value: `${num(d.conversionRate).toFixed(2)}%`, growth: num(d.conversionRate) },
    ];
  }, [invoiceOverview]);

  const satisfactionData = useMemo(() => {
    const arr = toArray(satisfaction);
    if (arr.length === 0) return Array.from({ length: 8 }, (_, i) => ({ name: String(i + 1), last: 0, current: 0 }));
    return arr.map((r, i) => ({
      name: String(r?.day ?? r?.name ?? i + 1),
      last: num(r?.lastMonth ?? r?.previous ?? r?.last),
      current: num(r?.thisMonth ?? r?.current),
    }));
  }, [satisfaction]);

  const totals = useMemo(() => {
    const totalRevenue = revenueData.reduce((sum, i) => sum + num(i.revenue), 0);
    const totalProfit = revenueData.reduce((sum, i) => sum + num(i.netProfit), 0);
    const satLastTotal = satisfactionData.reduce((sum, i) => sum + num(i.last), 0);
    const satCurrentTotal = satisfactionData.reduce((sum, i) => sum + num(i.current), 0);
    return { totalRevenue, totalProfit, satLastTotal, satCurrentTotal };
  }, [revenueData, satisfactionData]);

  const selectedMonthLabel = MONTHS[Math.max(0, month - 1)] || "Month";
  const hasRevenueData = revenueData.some((d) => num(d.revenue) > 0 || num(d.netProfit) > 0);
  const hasDonutData = donutData.some((d) => num(d.value) > 0);
  const hasSatisfactionData = satisfactionData.some((d) => num(d.last) > 0 || num(d.current) > 0);
  const donutTotal = donutData.reduce((sum, d) => sum + num(d.value), 0);

  const RevenueTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const revenue = payload.find((p) => p.dataKey === "revenue")?.value ?? 0;
    const profit = payload.find((p) => p.dataKey === "netProfit")?.value ?? 0;
    return (
      <div className="rounded-md border border-gray-200 bg-white px-3 py-2 shadow">
        <div className="text-xs font-semibold text-gray-500 mb-1">{label}</div>
        <div className="text-xs text-[#7F1D1D]">Revenue: <span className="font-semibold">{money(revenue)}</span></div>
        <div className="text-xs text-[#C2410C]">Net Profit: <span className="font-semibold">{money(profit)}</span></div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-end gap-2 mb-3">
        <div className="relative">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="appearance-none border rounded-md px-3 py-2 text-sm bg-white pr-8">
            {[2023, 2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <FiChevronDown className="absolute right-2 top-2.5 text-gray-500" />
        </div>
        <div className="relative">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="appearance-none border rounded-md px-3 py-2 text-sm bg-white pr-8">
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <FiChevronDown className="absolute right-2 top-2.5 text-gray-500" />
        </div>
      </div>

      {error ? <div className="mb-4 text-sm text-red-500">{error}</div> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        {cardData.map((card) => (
          <div key={card.label} className="bg-white rounded-md shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold">{loading ? "..." : card.value}</div>
              <FiUser size={22} className="text-black" />
            </div>
            <div className="text-xs text-gray-500 mt-1">{card.label}</div>
            <div className="mt-4 h-1 bg-[#C01824] w-full" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-md shadow-sm p-4">
            <h2 className="font-medium text-gray-700 mb-2">On-Time Performance</h2>
            <div className="text-xs text-gray-500 mb-3">Revenue vs Net Profit (12 months)</div>
            <div className="mb-3">
              <div className="text-sm text-gray-500">Total Revenue:</div>
              <div className="text-2xl font-bold">{loading ? "..." : money(totals.totalRevenue)}</div>
              <div className="text-xs text-gray-500">Period: Jan - Dec {year}</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={compact} />
                  <Tooltip content={<RevenueTooltip />} />
                  <Bar dataKey="revenue" fill="#B91C1C" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="netProfit" fill="#FCA5A5" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {!hasRevenueData ? <div className="text-xs text-gray-400 mt-2">No revenue chart data for selected year.</div> : null}
            <div className="flex items-center gap-5 mt-3 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-[#B91C1C] rounded-full mr-2" />
                <span className="text-gray-500">Revenue</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-[#FCA5A5] rounded-full mr-2" />
                <span className="text-gray-500">Net Profit</span>
              </div>
              <span className="ml-auto font-semibold">{money(totals.totalProfit)}</span>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm p-4">
            <h2 className="font-medium mb-3">Invoice Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {invoiceStats.map((it) => (
                <div key={it.label} className="rounded-md border border-gray-100 bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">{it.label}</div>
                  <div className="text-xl font-bold mt-1">{loading ? "..." : it.value}</div>
                  <div className={`text-[11px] mt-1 ${num(it.growth) >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {num(it.growth) >= 0 ? "+" : ""}{pct(it.growth)}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="text-sm text-gray-500">Revenue Trend</div>
              <div className="h-28 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="kpiRevenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#kpiRevenueFill)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-md shadow-sm p-4">
            <h2 className="font-medium mb-3">Current Statistic</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData.length ? donutData : [{ name: "No Data", value: 100, color: "#E5E7EB" }]} dataKey="value" innerRadius={60} outerRadius={90}>
                    {(donutData.length ? donutData : [{ color: "#E5E7EB" }]).map((entry, i) => (
                      <Cell key={`${entry.name || "empty"}-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1">
              {donutData.map((d, i) => (
                <div key={d.name} className="flex items-center text-xs">
                  <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ background: d.color || COLORS[i % COLORS.length] }} />
                  <span>{d.name}</span>
                  <span className="ml-2 text-gray-500">{donutTotal > 0 ? pct((num(d.value) / donutTotal) * 100) : "0.00%"}</span>
                  <span className="ml-auto font-semibold">{money(d.value)}</span>
                </div>
              ))}
            </div>
            {!hasDonutData ? <div className="text-xs text-gray-400 mt-2">No current statistic data for selected year.</div> : null}
          </div>

          <CustomerSatisfactionCard
            data={satisfactionData}
            lastTotal={totals.satLastTotal}
            currentTotal={totals.satCurrentTotal}
            monthLabel={selectedMonthLabel}
            year={year}
            hasData={hasSatisfactionData}
          />
        </div>
      </div>
    </div>
  );
};

export default KPIScreen;
