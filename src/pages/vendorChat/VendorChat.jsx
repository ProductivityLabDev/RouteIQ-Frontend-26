import { BlackPencilEdit } from "@/assets";
import ChatPanel from "@/components/ChatPanel";
import MainLayout from "@/layouts/SchoolLayout";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchTerminals } from "@/redux/slices/schoolSlice";

const NESTED_TYPES = {
  School: "SCHOOL",
  Driver: "DRIVER",
  Terminal: "VENDOR",
};

// Backend uses sourceType / targetType (ParticipantType: DRIVER | GUARDIAN | SCHOOL | VENDOR)
const PARTICIPANT_TYPES = [
  { label: "All", value: "" },
  { label: "School", value: "SCHOOL" },
  { label: "Driver", value: "DRIVER" },
  { label: "Parent", value: "GUARDIAN" },
  { label: "Terminal", value: "VENDOR" },
];

export function VendorChat() {
  const dispatch = useDispatch();
  const terminals = useSelector((state) => state.schools?.terminals || []);

  const [openAccordions, setOpenAccordions] = useState({
    parent: true,
    school: false,
    driver: false,
    terminal: false,
  });
  const [nestedOpen, setNestedOpen] = useState(null);

  // Filter local state (backend: sourceType, targetType only)
  const [sourceType, setSourceType] = useState("");
  const [targetType, setTargetType] = useState("");
  const [terminalId, setTerminalId] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Applied filters (only sent to ChatPanel on Apply)
  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    dispatch(fetchTerminals());
  }, [dispatch]);

  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleNested = (title) => {
    setNestedOpen((prev) => (prev === title ? null : title));
  };

  const handleApply = () => {
    const filters = {};
    if (sourceType) filters.sourceType = sourceType;
    if (targetType) filters.targetType = targetType;
    if (terminalId) filters.terminalId = terminalId;
    if (instituteId.trim()) filters.instituteId = instituteId.trim();
    if (studentId.trim()) filters.studentId = studentId.trim();
    if (dateFrom) filters.from = dateFrom.toISOString();
    if (dateTo) filters.to = dateTo.toISOString();
    if (searchQuery.trim()) filters.q = searchQuery.trim();
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    setSourceType("");
    setTargetType("");
    setTerminalId("");
    setInstituteId("");
    setStudentId("");
    setDateFrom(null);
    setDateTo(null);
    setSearchQuery("");
    setAppliedFilters({});
  };

  // Memoize so reference doesn't change on every render
  const monitoringFilters = useMemo(() => appliedFilters, [appliedFilters]);

  return (
    <MainLayout>
      <section className="w-full h-full">
        <div className="my-4 md:my-7 flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0">
          <h1 className="font-bold text-[24px] md:text-[32px] text-[#202224]">
            Chat Monitoring
          </h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
            Read-only
          </span>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded border border-[#D9D9D9] shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 items-end">
            {/* Source Type (conversations that have this participant type) */}
            <div>
              <label className="block text-xs font-medium text-[#202224] mb-1">
                Source Type
              </label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className="w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm text-[#202224] outline-none focus:border-[#C01824]"
              >
                {PARTICIPANT_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Type (optional: e.g. Driver + Parent = both in conversation) */}
            <div>
              <label className="block text-xs font-medium text-[#202224] mb-1">
                Target Type
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm text-[#202224] outline-none focus:border-[#C01824]"
              >
                {PARTICIPANT_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Terminal */}
            <div>
              <label className="block text-xs font-medium text-[#202224] mb-1">
                Terminal
              </label>
              <select
                value={terminalId}
                onChange={(e) => setTerminalId(e.target.value)}
                className="w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm text-[#202224] outline-none focus:border-[#C01824]"
              >
                <option value="">All Terminals</option>
                {terminals.map((t) => {
                  const id = t.TerminalId ?? t.id;
                  const name = t.TerminalName ?? t.name ?? `Terminal ${id}`;
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Institute ID */}
            <div >
              <label className="block text-xs font-medium text-[#202224] mb-1">
                Institute ID
              </label>
              <input
                type="text"
                value={instituteId}
                onChange={(e) => setInstituteId(e.target.value)}
                placeholder="Enter Institute ID"
                className="w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm text-[#202224] outline-none focus:border-[#C01824]"
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-xs font-medium text-[#202224] mb-1">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter Student ID"
                className="w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm text-[#202224] outline-none focus:border-[#C01824]"
              />
            </div>

            {/* Date From */}
            <div>
              <label className="w-100 block text-xs font-medium text-[#202224] mb-1">
                Date From
              </label>
              <DatePicker
                selected={dateFrom}
                onChange={(date) => setDateFrom(date)}
                placeholderText="Start date"
                dateFormat="yyyy-MM-dd"
                maxDate={dateTo || undefined}
                isClearable
                className="w-100 border border-[#D9D9D9] rounded-md px-3 py-2 text-sm text-[#202224] outline-none focus:border-[#C01824]"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs font-medium text-[#202224] mb-1">
                Date To
              </label>
              <DatePicker
                selected={dateTo}
                onChange={(date) => setDateTo(date)}
                placeholderText="End date"
                dateFormat="yyyy-MM-dd"
                minDate={dateFrom || undefined}
                isClearable
                className="w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm text-[#202224] outline-none focus:border-[#C01824]"
              />
            </div>

            {/* Search Query */}
            <div>
              <label className="block text-xs font-medium text-[#202224] mb-1">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                placeholder="Search messages..."
                className="w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm text-[#202224] outline-none focus:border-[#C01824]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleApply}
                className="px-5 py-2 bg-[#C01824] text-white text-sm rounded-md hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2 border border-[#D9D9D9] text-[#202224] text-sm rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4">
          {/* Parent accordion with nested items */}
          <div className="w-full bg-white rounded shadow-sm mb-4">
            <div
              className="flex items-center justify-between border border-[#D6D6D6] rounded px-4 py-4 cursor-pointer"
              onClick={() => toggleAccordion("parent")}
            >
              <div className="flex items-center space-x-3">
                <span className="text-[#202224]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </span>
                <h2 className="font-medium text-gray-800">Parent</h2>
                <button>
                  <img src={BlackPencilEdit} />
                </button>
              </div>
              <div className="flex items-center">
                <button className="text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-200 ${
                      openAccordions.parent ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {openAccordions.parent && (
              <div className="px-4 py-2 border-t border-gray-100">
                <div className="space-y-2">
                  {["School", "Driver", "Terminal"].map((title, index) => (
                    <div key={index} className="bg-white shadow-sm">
                      <div className="flex items-center justify-between border border-[#D6D6D6] rounded px-4 py-4 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <span className="text-[#202224]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                              />
                            </svg>
                          </span>
                          <h2 className="font-medium text-gray-800">{title}</h2>
                          <button onClick={() => toggleNested(title)}>
                            <img src={BlackPencilEdit} />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <button
                            className="text-black"
                            onClick={() => toggleNested(title)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-5 w-5 transition-transform duration-200 ${
                                nestedOpen === title ? "rotate-180" : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {nestedOpen === title && (
                        <div className="px-4 pb-4">
                          <ChatPanel
                            participantTypeFilter={NESTED_TYPES[title]}
                            isMonitoring={true}
                            monitoringFilters={monitoringFilters}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Standalone accordion items */}
          {["School", "Driver", "Terminal"].map((title, index) => (
            <div
              key={index}
              className="w-full bg-white rounded shadow-sm mb-4"
            >
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => toggleAccordion(title.toLowerCase())}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-[#202224]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </span>
                  <h2 className="font-medium text-gray-800">{title}</h2>
                  <button>
                    <img src={BlackPencilEdit} />
                  </button>
                </div>
                <div className="flex items-center">
                  <button className="text-black">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform duration-200 ${
                        openAccordions[title.toLowerCase()] ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {openAccordions[title.toLowerCase()] && (
                <div className="px-4 pb-4">
                  <ChatPanel
                    participantTypeFilter={NESTED_TYPES[title]}
                    isMonitoring={true}
                    monitoringFilters={monitoringFilters}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
