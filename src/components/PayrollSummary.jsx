import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoEyeSharp } from "react-icons/io5";
import { payroll as payrollIcon, signal } from "@/assets";
import { useSelector, useDispatch } from "react-redux";
import { fetchDailyEarnings } from "@/redux/slices/employeeDashboardSlice";
import dayjs from "dayjs";

const fmt = (v) =>
  v == null ? "--" : `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const splitAmt = (v) => {
  if (v == null) return ["--", ""];
  const [whole, dec] = Number(v).toFixed(2).split(".");
  return [`$${Number(whole).toLocaleString("en-US")}`, `.${dec}`];
};
const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const getRangeDates = (range) => {
  const today = dayjs().startOf("day");
  switch (range) {
    case "Today":
      return { startDate: today.format("YYYY-MM-DD"), endDate: today.format("YYYY-MM-DD") };
    case "Yesterday": {
      const y = today.subtract(1, "day");
      return { startDate: y.format("YYYY-MM-DD"), endDate: y.format("YYYY-MM-DD") };
    }
    case "Last 7 Days":
      return { startDate: today.subtract(6, "day").format("YYYY-MM-DD"), endDate: today.format("YYYY-MM-DD") };
    case "Last 30 Days":
      return { startDate: today.subtract(29, "day").format("YYYY-MM-DD"), endDate: today.format("YYYY-MM-DD") };
    case "This Month":
      return { startDate: today.startOf("month").format("YYYY-MM-DD"), endDate: today.endOf("month").format("YYYY-MM-DD") };
    case "Last Month": {
      const lm = today.subtract(1, "month");
      return { startDate: lm.startOf("month").format("YYYY-MM-DD"), endDate: lm.endOf("month").format("YYYY-MM-DD") };
    }
    default:
      return { startDate: today.subtract(29, "day").format("YYYY-MM-DD"), endDate: today.format("YYYY-MM-DD") };
  }
};

const RANGES = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month"];

export default function PayrollSummary({ onViewPayStub }) {
  const dispatch = useDispatch();
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [showDropdown, setShowDropdown]   = useState(false);

  const payrollData     = useSelector((s) => s.employeeDashboard.payroll);
  const payrollHistory  = useSelector((s) => s.employeeDashboard.payrollHistory);
  const dailyEarnings   = useSelector((s) => s.employeeDashboard.dailyEarnings);
  const earningsLoading = useSelector((s) => s.employeeDashboard.loading.dailyEarnings);

  const summary    = payrollData?.summary;
  const period     = payrollData?.period;
  const historyPreviousPay = Array.isArray(payrollHistory)
    ? payrollHistory.find((item) => item?.payrollId && item.payrollId !== payrollData?.payrollId) ?? null
    : null;
  const prevPay    = payrollData?.previousPayroll ?? historyPreviousPay ?? null;
  const nextPay    = payrollData?.upcomingPayroll;
  const employeeId = payrollData?.employee?.employeeId;

  const netPay     = summary?.netPay          ?? null;
  const deductions = summary?.totalDeductions ?? null;
  const taxes      = summary?.totalTaxes      ?? null;
  const benefits   = summary?.totalBenefits   ?? null;
  const grossPay   = summary?.grossPay        ?? null;

  useEffect(() => {
    if (!employeeId) return;
    const { startDate, endDate } = getRangeDates(selectedRange);
    dispatch(fetchDailyEarnings({ employeeId, startDate, endDate }));
  }, [dispatch, employeeId, selectedRange]);

  const dailyData   = dailyEarnings?.daily ?? [];
  const earnSummary = dailyEarnings?.summary;

  const chartData = dailyData.map((d) => ({
    date:        dayjs(d.dayDate).format("MMM D"),
    "Hour Earn": Number(d.hourEarnings ?? 0),
    "Trip Earn": Number(d.tripEarnings ?? 0),
  }));

  const periodLabel = period
    ? `(From ${dayjs(period.start).format("D")} – ${dayjs(period.end).format("D MMMM YYYY")})`
    : "";

  const netPct = grossPay && netPay ? `${Math.round((netPay / grossPay) * 100)}%` : "--";

  const [netWhole, netDec] = splitAmt(netPay);
  const [dedWhole, dedDec] = splitAmt(deductions);
  const [taxWhole, taxDec] = splitAmt(taxes);
  const [benWhole, benDec] = splitAmt(benefits);

  const pieData = [
    { name: "Net Pay", value: safeNum(netPay), color: "#22c55e" },
    { name: "Taxes", value: safeNum(taxes), color: "#cc0000" },
    { name: "Deductions", value: safeNum(deductions), color: "#fda4af" },
    { name: "Benefits", value: safeNum(benefits), color: "#2e2e2e" },
  ].filter((item) => item.value > 0);
  const hasPieData = pieData.length > 0;
  const pieCenterLabel = grossPay && netPay ? "Net Pay" : "Payroll";

  return (
    <>
      {/* ── Header row ── */}
      <div className="flex justify-between items-center mt-5 mb-4">
        <h2 className="text-xl font-medium text-gray-800">
          Payroll Summary{" "}
          <span className="text-gray-500 font-normal">{periodLabel}</span>
        </h2>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center bg-white border border-gray-200 rounded-md px-3 py-1 hover:shadow-sm"
          >
            <span className="text-sm text-gray-700">{selectedRange}</span>
            <IoMdArrowDropdown className="ml-1 text-gray-600" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
              {RANGES.map((r) => (
                <button key={r} onClick={() => { setSelectedRange(r); setShowDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedRange === r ? "bg-gray-100 text-red-600" : "text-gray-700"}`}>
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Single white card ── */}
      <div className="bg-white rounded-lg shadow-md p-6">

        {/* Top: pie + amounts + prev/next */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pie */}
          <div className="relative w-80 h-80 mx-auto">
            <div className="absolute inset-6 bg-[#EBF3FE] rounded-full z-0" />
            {hasPieData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={80} outerRadius={110} paddingAngle={1}
                    dataKey="value" startAngle={90} endAngle={-270}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[220px] w-[220px] rounded-full border-[18px] border-[#D9E6F7] bg-white" />
              </div>
            )}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <button
                onClick={onViewPayStub}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium hover:bg-gray-50"
              >
                <IoEyeSharp className="w-4 h-4" />
                View Pay Stub
              </button>
            </div>
            <div className="absolute w-[78px] h-[78px] top-[34px] right-12 bg-white border border-gray-100 shadow text-center rounded-full font-medium text-[#0A112F] flex flex-col items-center justify-center z-10">
              <span className="text-[22px] leading-none">{netPct}</span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-gray-400 mt-1">{pieCenterLabel}</span>
            </div>
          </div>

          {/* Amounts */}
          <div className="flex flex-col justify-around">
            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center">
                <div className="w-2 h-[80px] bg-[#529C42] mr-3 rounded-lg" />
                <div>
                  <div className="text-[#70707A] text-sm font-normal mb-1">Total Pay</div>
                  <div className="text-[39px] font-bold text-[#0A112F]">{netWhole}<span className="text-gray-400 font-normal text-xl">{netDec}</span></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-[80px] bg-[#FFBBBF] mr-3 rounded-lg" />
                <div>
                  <div className="text-[#70707A] text-sm font-normal mb-1">Deduction</div>
                  <div className="text-[39px] font-bold text-[#0A112F]">{dedWhole}<span className="text-gray-400 font-normal text-xl">{dedDec}</span></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className="w-2 h-[80px] bg-[#C01824] mr-3 rounded-lg" />
                <div>
                  <div className="text-[#70707A] text-sm font-normal mb-1">Taxes</div>
                  <div className="text-[39px] font-bold text-[#0A112F]">{taxWhole}<span className="text-gray-400 font-normal text-xl">{taxDec}</span></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-[80px] bg-[#202224] mr-3 rounded-lg" />
                <div>
                  <div className="text-[#70707A] text-sm font-normal mb-1">Benefits</div>
                  <div className="text-[39px] font-bold text-[#0A112F]">{benWhole}<span className="text-gray-400 font-normal text-xl">{benDec}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Prev / Next */}
          <div className="flex flex-col justify-around space-y-6">
            <div className="border rounded-lg p-4 shadow-sm">
              <div className="flex items-center text-sm text-[#70707A] font-medium">
                <div className="flex items-center space-x-2">
                  <img src={signal} alt="Signal" className="w-5 h-5" />
                  <span>Previous Payroll</span>
                </div>
                <span className="ml-auto text-[#70707A] text-sm font-normal">
                  {prevPay ? dayjs(prevPay.periodStart).format("MMMM D, YYYY") : "--"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[24px] font-medium ml-8 text-[#0A112F] mt-2">
                <span>{fmt(prevPay?.netSalary)}</span>
                <span className="inline-block bg-[#CEEFDF] text-[#0AAF60] text-xs font-bold px-3 py-1 rounded-full">
                  • {prevPay?.status ?? "PAID"}
                </span>
              </div>
            </div>
            <div className="border rounded-lg p-4 shadow-sm">
              <div className="flex items-center text-sm text-[#70707A] font-medium">
                <div className="flex items-center space-x-2">
                  <img src={payrollIcon} alt="Payroll" className="w-5 h-5" />
                  <span>Upcoming Payroll</span>
                </div>
                <span className="ml-auto text-[#3981F7] text-sm font-normal">
                  {nextPay ? dayjs(nextPay.periodStart).format("MMMM D, YYYY") : "--"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[24px] font-medium ml-8 text-[#0A112F] mt-2">
                <span>{fmt(nextPay?.netSalary)}</span>
                <span className="inline-block bg-[#FEEDDA] text-[#FAA745] text-xs font-bold px-3 py-1 rounded-full">
                  • {nextPay?.status ?? "PENDING"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-100 my-6" />

        {/* ── Daily Earnings section (same card) ── */}
        <div>
          <h3 className="text-base font-semibold text-[#0A112F] mb-4">Daily Earnings</h3>

          {/* Summary cards */}
          {earnSummary && (
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="bg-[#F0FDF4] border border-green-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-green-700">{fmt(earnSummary.totalEarnings)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Hour: {fmt(earnSummary.totalHourEarnings)} &nbsp;|&nbsp; Trip: {fmt(earnSummary.totalTripEarnings)}
                </p>
              </div>
              <div className="bg-[#EFF6FF] border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Total Hours</p>
                <p className="text-2xl font-bold text-blue-700">{earnSummary.totalHours ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">Route Rate: {fmt(earnSummary.routeRate)}/hr</p>
              </div>
              <div className="bg-[#FFF7ED] border border-orange-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Total Trips</p>
                <p className="text-2xl font-bold text-orange-700">{earnSummary.totalTrips ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">Trip Rate: {fmt(earnSummary.tripRate)}/trip</p>
              </div>
            </div>
          )}

          {/* Bar chart */}
          {earningsLoading ? (
            <div className="flex justify-center items-center h-48 text-gray-400 text-sm">Loading chart...</div>
          ) : chartData.length === 0 ? (
            <div className="flex justify-center items-center h-48 text-gray-400 text-sm">No earnings data for this period.</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(val) => [`$${Number(val).toFixed(2)}`, undefined]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Hour Earn" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Trip Earn" fill="#C01824" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </>
  );
}
