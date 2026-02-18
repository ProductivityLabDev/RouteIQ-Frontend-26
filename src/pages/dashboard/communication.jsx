import { BlackPencilEdit, callsupporticon } from "@/assets";
import { Button } from "@material-tailwind/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ChatPanel from "@/components/ChatPanel";
import { useSocket } from "@/hooks/useSocket";

const NESTED_TYPES = {
  School: "SCHOOL",
  Driver: "DRIVER",
  Terminal: "VENDOR",
};

export function Communication() {
  useSocket();

  const [openAccordions, setOpenAccordions] = useState({
    parent: true,
    school: false,
    driver: false,
    terminal: false,
  });
  const [nestedOpen, setNestedOpen] = useState(null);

  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleNested = (title) => {
    setNestedOpen((prev) => (prev === title ? null : title));
  };

  return (
    <section>
      <div className="md:my-7 mt-4 flex justify-between flex-wrap items-center md:space-y-0 space-y-4">
        <h1 className="font-bold text-[24px] md:text-[32px] text-[#202224]">
          Communication
        </h1>
        <Link to="#">
          <Button className="md:mb-0 mb-8 bg-[#C01824] capitalize font-semibold text-[14px] w-[220px] rounded-[6px] opacity-100">
            <img
              src={callsupporticon}
              className="inline-block h-[22px] w-[22px] mr-2"
            />{" "}
            Chat with Bus Team
          </Button>
        </Link>
      </div>

      <div className="w-full space-y-4">
        {/* Parent accordion with nested School/Driver/Terminal */}
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
          <div key={index} className="w-full bg-white rounded shadow-sm mb-4">
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              onClick={() =>
                toggleAccordion(title.toLowerCase())
              }
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
                <ChatPanel participantTypeFilter={NESTED_TYPES[title]} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
