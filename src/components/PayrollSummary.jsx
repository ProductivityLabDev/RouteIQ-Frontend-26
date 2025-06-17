import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoEyeSharp } from "react-icons/io5";
import { payroll, signal } from "@/assets";

const data = [
  { name: "Benefits", value: 37.13, color: "#2e2e2e" },
  { name: "Taxes", value: 181.34, color: "#cc0000" },
  { name: "Deduction", value: 95.86, color: "#fda4af" },
  { name: "Remaining", value: 234.2, color: "#22c55e" },
];

export default function PayrollSummary() {
  const [selectedRange, setSelectedRange] = useState("Last 30 days");
  const [showDropdown, setShowDropdown] = useState(false);

  const ranges = [
    "Today",
    "Yesterday",
    "Last 7 days",
    "Last 30 days",
    "This Month",
    "Last Month",
  ];

  return (
    <>
      <div className="flex justify-between items-center mt-5 mb-4">
        <h2 className="text-xl font-medium text-gray-800">
          Payroll Summary{" "}
          <span className="text-gray-500 font-normal">
            (From 1 – 31 March 2022)
          </span>
        </h2>

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
              {ranges.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setSelectedRange(range);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedRange === range
                      ? "bg-gray-100 text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white rounded-lg shadow-md">
        <div className="relative w-80 h-80 mx-auto">
          <div className="absolute inset-6 bg-[#EBF3FE] rounded-full z-0" />

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={80}
                outerRadius={110}
                paddingAngle={1}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium hover:bg-gray-50">
              <IoEyeSharp className="w-4 h-4" />
              View Pay Stub
            </button>
          </div>

          <div className="absolute w-[60px] h-[60px] top-[40px] right-16 bg-white border border-gray-100 shadow text-[23px] rounded-full font-medium text-[#0A112F] flex items-center justify-center z-10">
            54<span className="text-gray-400 text-xs">%</span>
          </div>
        </div>

        <div className="flex flex-col justify-around">
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center">
              <div className="w-2 h-[80px] bg-[#529C42] mr-3 rounded-lg" />
              <div>
                <div className="text-[#70707A] text-sm font-normal mb-1">
                  Total Pay
                </div>
                <div className="text-[39px] font-bold text-[#0A112F]">
                  $234
                  <span className="text-gray-400 font-normal text-xl">.20</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-[80px] bg-[#FFBBBF] mr-3 rounded-lg" />
              <div>
                <div className="text-[#70707A] text-sm font-normal mb-1">
                  Deduction
                </div>
                <div className="text-[39px] font-bold text-[#0A112F]">
                  $95
                  <span className="text-gray-400 font-normal text-xl">.86</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center">
              <div className="w-2 h-[80px] bg-[#C01824] mr-3 rounded-lg" />
              <div>
                <div className="text-[#70707A] text-sm font-normal mb-1">
                  Taxes
                </div>
                <div className="text-[39px] font-bold text-[#0A112F]">
                  $181
                  <span className="text-gray-400 font-normal text-xl">.34</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-[80px] bg-[#202224] mr-3 rounded-lg" />
              <div>
                <div className="text-[#70707A] text-sm font-normal mb-1">
                  Benefits
                </div>
                <div className="text-[39px] font-bold text-[#0A112F]">
                  $37
                  <span className="text-gray-400 font-normal text-xl">.13</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-around space-y-6">
          <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center text-sm text-[#70707A] font-medium">
              <div className="flex items-center space-x-2">
                <img src={signal} alt="Signal" className="w-5 h-5" />
                <span>Previous Payroll</span>
              </div>
              <span className="ml-auto text-[#70707A] text-sm font-normal">
                March 1, 2022
              </span>
            </div>

            <div className="flex justify-between items-center text-[24px] font-medium ml-8 text-[#0A112F] mt-2">
              <span>$58,764.25</span>
              <span className="inline-block bg-[#CEEFDF] text-[#0AAF60] text-xs font-bold px-3 py-1 rounded-full">
                • PAID
              </span>
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center text-sm text-[#70707A] font-medium">
              <div className="flex items-center space-x-2">
                <img src={payroll} alt="Signal" className="w-5 h-5" />
                <span>Upcoming Payroll</span>
              </div>
              <span className="ml-auto text-[#3981F7] text-sm font-normal">
                April 1, 2022
              </span>
            </div>

            <div className="flex justify-between items-center text-[24px] font-medium ml-8 text-[#0A112F] mt-2">
              <span>$2,670.50</span>
              <span className="inline-block bg-[#FEEDDA] text-[#FAA745] text-xs font-bold px-3 py-1 rounded-full">
                • PENDING
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
