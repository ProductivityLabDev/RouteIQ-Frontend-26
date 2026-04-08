import React from "react";
import { AreaChart, Area, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis } from "recharts";

const money = (v) =>
    `$${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const pctDelta = (prev, curr) => {
    const p = Number(prev || 0);
    const c = Number(curr || 0);
    if (p === 0) return c === 0 ? "0.00%" : "+100.00%";
    const d = ((c - p) / Math.abs(p)) * 100;
    return `${d >= 0 ? "+" : ""}${d.toFixed(2)}%`;
};

const CustomLegend = () => (
    <div className="flex justify-center items-center mt-2 space-x-7">
        <div className="flex items-center">
            <div className="w-4 h-1.5 rounded-full mr-2" style={{ background: "#791622" }} />
            <span className="text-base text-[#959CB1] font-medium">Last Month</span>
        </div>
        <span className="mx-2 text-[#e2e2e2]">|</span>
        <div className="flex items-center">
            <div className="w-4 h-1.5 rounded-full mr-2" style={{ background: "#C01824" }} />
            <span className="text-base text-[#959CB1] font-medium">This Month</span>
        </div>
    </div>
);

export default function CustomerSatisfactionCard({ data = [], lastTotal = 0, currentTotal = 0, monthLabel = "", year = "", hasData = true }) {
    return (
        <div className="bg-white rounded-md shadow-sm p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-2xl font-extrabold text-[#181c53] tracking-[-0.5px] font-sans" style={{ letterSpacing: "-0.5px" }}>
                    Customer Satisfaction
                </h2>
                <div className="text-right">
                    <div className="text-xs text-gray-500">{monthLabel} {year}</div>
                    <div className={`text-xs font-semibold ${Number(currentTotal) >= Number(lastTotal) ? "text-green-600" : "text-red-600"}`}>
                        {pctDelta(lastTotal, currentTotal)}
                    </div>
                </div>
            </div>
            <div className="relative mt-2 mb-3">
                {/* Area Chart */}
                <div className="w-full h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 18, right: 24, left: 6, bottom: 0 }}>
                            {/* Gradient for "This Month" */}
                            <defs>
                                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ff2e45" stopOpacity={0.6} />
                                    <stop offset="100%" stopColor="#fff" stopOpacity={0.2} />
                                </linearGradient>
                                <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="15%" stopColor="#791622" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#fff" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            {/* "This Month" Line & Area */}
                            <Area
                                type="monotone"
                                dataKey="current"
                                fill="url(#colorCurrent)"
                                stroke="#C01824"
                                strokeWidth={3}
                                dot={{ stroke: "#C01824", fill: "#fff", strokeWidth: 3, r: 4 }}
                                activeDot={{ stroke: "#C01824", fill: "#fff", strokeWidth: 4, r: 6 }}
                            />
                            {/* "Last Month" Line with dark dots, no area */}
                            <Line
                                type="monotone"
                                dataKey="last"
                                stroke="#791622"
                                strokeWidth={3}
                                dot={{ stroke: "#791622", fill: "#fff", strokeWidth: 3, r: 4 }}
                                activeDot={{ stroke: "#791622", fill: "#fff", strokeWidth: 4, r: 6 }}
                            />
                            {/* Axis and Grid */}
                            <XAxis dataKey="name" hide />
                            <YAxis hide />
                            <CartesianGrid vertical={false} stroke="#f7f5f1" />
                            {/* Hide tooltip and built-in legend */}
                            <Tooltip
                                formatter={(value, key) => [money(value), key === "current" ? "This Month" : "Last Month"]}
                                labelFormatter={(label) => `Day ${label}`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {!hasData ? <div className="text-xs text-gray-400 mb-3">No satisfaction data for selected month/year.</div> : null}
            {/* Divider/line */}
            <div className="my-4 mx-auto" style={{ borderBottom: "1.5px solid #e7e6e2", width: "97%" }}></div>
            {/* Custom Legend */}
            <CustomLegend />
            {/* Stats */}
            <div className="flex items-start justify-center space-x-16 mt-1">
                <div className="text-center">
                    <div className="text-[#791622] text-xl font-semibold leading-tight -mt-1">{money(lastTotal)}</div>
                </div>
                <div className="text-center">
                    <div className="text-[#C01824] text-xl font-semibold leading-tight -mt-1">{money(currentTotal)}</div>
                </div>
            </div>
        </div>
    );
}
