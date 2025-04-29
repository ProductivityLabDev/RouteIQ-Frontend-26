import React from "react";
import { AreaChart, Area, Line, LineChart, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Dot, YAxis } from "recharts";

const data = [
    { name: "1", last: 8, current: 12 },
    { name: "2", last: 11, current: 11 },
    { name: "3", last: 10, current: 13 },
    { name: "4", last: 8, current: 12 },
    { name: "5", last: 7, current: 11 },
    { name: "6", last: 7, current: 10 },
    { name: "7", last: 8, current: 11 },
    { name: "8", last: 8, current: 14 }
];

const formatLegend = (value) => {
    if (value === "last") return "Last Month";
    if (value === "current") return "This Month";
    return value;
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

export default function CustomerSatisfactionCard() {
    return (
        <div className="bg-white rounded-md shadow-sm p-4">
            <h2 className="text-2xl font-extrabold mb-2 text-[#181c53] tracking-[-0.5px] font-sans" style={{ letterSpacing: "-0.5px" }}>
                Customer Satisfaction
            </h2>
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
                            <Tooltip content={() => null} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* Divider/line */}
            <div className="my-4 mx-auto" style={{ borderBottom: "1.5px solid #e7e6e2", width: "97%" }}></div>
            {/* Custom Legend */}
            <CustomLegend />
            {/* Stats */}
            <div className="flex items-start justify-center space-x-16 mt-1">
                <div className="text-center">
                    <div className="text-[#791622] text-xl font-semibold leading-tight -mt-1">$3,004</div>
                </div>
                <div className="text-center">
                    <div className="text-[#C01824] text-xl font-semibold leading-tight -mt-1">$4,504</div>
                </div>
            </div>
        </div>
    );
}