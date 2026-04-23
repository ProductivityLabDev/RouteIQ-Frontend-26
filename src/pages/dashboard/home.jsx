import React, { useEffect } from "react";
import { Typography, Card, Button, ButtonGroup } from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import StudentsTable from "@/components/StudentTable";
import DriversTable from "@/components/DriverTable";
import { chartConfig } from "@/configs";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchoolCostChart, fetchSchoolDashboard } from "@/redux/slices/schoolDashboardSlice";
import { useState } from "react";
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { chatService } from "@/services/chatService";
import { parseAppDate } from "@/utils/dateTime";

const formatTimeAgo = (value) => {
  if (!value) return "";
  const date = parseAppDate(value);
  if (!date) return "";
  const diffMs = Date.now() - date.getTime();
  if (diffMs <= 60000 && diffMs >= -300000) return "just now";
  if (Number.isNaN(date.getTime())) return "";
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
};

export function Home() {
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedToggle, setSelectedToggle] = useState("trips");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [communicationPreview, setCommunicationPreview] = useState([]);
  const [communicationLoading, setCommunicationLoading] = useState(false);
  const dispatch = useDispatch();
  const { dashboardStats, costChart, loading } = useSelector((s) => s.schoolDashboard);

  useEffect(() => {
    dispatch(fetchSchoolDashboard());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSchoolCostChart({ toggle: selectedToggle, year: selectedYear }));
  }, [dispatch, selectedToggle, selectedYear]);

  useEffect(() => {
    let mounted = true;
    const loadCommunicationPreview = async () => {
      try {
        setCommunicationLoading(true);
        const res = await chatService.getConversations();
        const list = Array.isArray(res?.data) ? res.data : [];
        const sorted = list
          .slice()
          .sort(
            (a, b) =>
              (parseAppDate(b?.lastMessageAt || b?.updatedAt)?.getTime() || 0) -
              (parseAppDate(a?.lastMessageAt || a?.updatedAt)?.getTime() || 0)
          );
        const preview = sorted.slice(0, 2).map((c) => {
          const name =
            c?.name ||
            c?.participant?.name ||
            (Array.isArray(c?.participants) ? c.participants[0]?.name : "") ||
            "Conversation";
          const rawMsg = c?.lastMessage;
          const msg = typeof rawMsg === "string" ? rawMsg : rawMsg?.content;
          return {
            id: c?.id,
            title: name,
            message: msg || "No messages yet",
            unreadCount: Number(c?.unreadCount || 0),
            timeAgo: formatTimeAgo(c?.lastMessageAt || c?.updatedAt),
          };
        });
        if (mounted) setCommunicationPreview(preview);
      } catch {
        if (mounted) setCommunicationPreview([]);
      } finally {
        if (mounted) setCommunicationLoading(false);
      }
    };
    loadCommunicationPreview();
    return () => {
      mounted = false;
    };
  }, []);

  const isLoading = loading.dashboard;
  const isChartLoading = loading.costChart;
  const chartPoints = Array.isArray(costChart?.data) ? costChart.data : [];
  const chartCategories = chartPoints.map((item) => item?.month || "--");
  const chartValues = chartPoints.map((item) => Number(item?.totalCost || 0));
  const availableYears = Array.from({ length: 5 }, (_, idx) => new Date().getFullYear() - idx);
  const chartTitle = selectedToggle === "routes" ? "Total Routes Costs" : "Total Trips Costs";

  const schoolCostChartConfig = {
    ...chartConfig,
    series: [
      {
        name: selectedToggle === "routes" ? "Route Cost" : "Trip Cost",
        data: chartValues,
      },
    ],
    options: {
      ...chartConfig.options,
      xaxis: {
        ...chartConfig.options.xaxis,
        categories: chartCategories.length > 0 ? chartCategories : chartConfig.options.xaxis.categories,
      },
      yaxis: {
        ...chartConfig.options.yaxis,
        labels: {
          ...chartConfig.options.yaxis.labels,
          formatter: (value) => `$${Number(value || 0).toLocaleString()}`,
        },
      },
      tooltip: {
        ...chartConfig.options.tooltip,
        y: {
          formatter: (value) => `$${Number(value || 0).toLocaleString()}`,
        },
      },
    },
  };

  const statsCards = [
    {
      title: "Active Buses",
      value: isLoading ? "..." : (dashboardStats?.activeBuses ?? "--"),
      outOf: isLoading ? "" : (dashboardStats?.totalBuses ? `/${dashboardStats.totalBuses}` : ""),
    },
    {
      title: "Total Students",
      value: isLoading ? "..." : (dashboardStats?.totalStudents ?? "--"),
      outOf: "",
    },
    {
      title: "Total Drivers",
      value: isLoading ? "..." : (dashboardStats?.totalDrivers ?? "--"),
      outOf: "",
    },
  ];

  return (
    <div className="mt-12">
      <div className="grid xl:grid-cols-2 grid-cols-1 xl:space-y-0 space-y-[1rem] gap-5">
        <div className="xl:space-y-0 space-y-3">
          <div className="grid xl:grid-cols-3 md:h-[155px] h-[100px] xl:gap-x-3 grid-cols-3 mb-3 space-x-1">
            {statsCards.map(({ title, value, outOf }) => (
              <StatisticsCard key={title} title={title} value={value} outOf={outOf} />
            ))}
          </div>
          <div className="bg-white w-full rounded-[4px] shadow-md xl:h-[180px] px-2 md:px-5 py-2 xl:py-2 overflow-hidden">
            <div className="flex items-center justify-between">
              <Typography className="text-[#202224] text-[18px] md:text-[24px] font-extrabold">Communication</Typography>
              <Link to={`/dashboard/communication`}>
                <Button variant="text" className="bg-transparent shadow-none text-[#C01824] font-extrabold text-[12px] capitalize">View All</Button>
              </Link>
            </div>
            {communicationLoading ? (
              <Typography variant="paragraph" className="font-semibold leading-tight text-xs md:text-[14px] pt-2 px-3 text-gray-500">
                Loading latest chats...
              </Typography>
            ) : communicationPreview.length === 0 ? (
              <Typography variant="paragraph" className="font-semibold leading-tight text-xs md:text-[14px] pt-2 px-3 text-gray-500">
                No recent communication found.
              </Typography>
            ) : (
              <>
                {communicationPreview.map((item, idx) => (
                  <div
                    key={item.id ?? idx}
                    className={`${
                      idx === 0 ? "pt-2 px-3" : "border py-2 px-3 rounded-[10px] mt-2"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Typography variant="paragraph" className="font-semibold leading-tight text-xs md:text-[14px] min-w-0">
                        <span className="font-extrabold">{item.title}:</span> {item.message}
                      </Typography>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.timeAgo ? (
                          <span className="text-[11px] text-gray-500">{item.timeAgo}</span>
                        ) : null}
                        {item.unreadCount > 0 ? (
                          <span className="bg-[#C01824] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1.5 flex items-center justify-center">
                            {item.unreadCount > 99 ? "99+" : item.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
                {communicationPreview.length < 2 ? (
                  <Typography variant="paragraph" className="font-semibold leading-tight text-xs md:text-[14px] border py-2 px-3 rounded-[10px] mt-2">
                    Open communication to view full chat history.
                  </Typography>
                ) : null}
              </>
            )}
          </div>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6">
          <Card className="rounded-[4px] w-full xl:max-w-full lg:max-w-[565px] md:max-w-[500px]">
            <div className="flex flex-col justify-between gap-4 rounded-none md:flex-row md:items-center border-b border-[#E4E5E7] pb-2 px-4 pt-3">
              <div className="flex md:flex-row flex-col md:space-x-8 md:items-center">
                <Typography variant="h4" className="text-[20px] font-extrabold text-[#141516] w-[300px]">
                  {chartTitle}
                </Typography>
                <ButtonGroup className="border border-[#E5E5E9] rounded-md outline-none !p-0" variant="text" size='lg'>
                  {[
                    { label: "Trips", value: "trips" },
                    { label: "Routes", value: "routes" },
                  ].map((item) => (
                    <Button
                      key={item.value}
                      className={selectedToggle === item.value ? 'bg-[#C01824] hover:bg-[#C01824]/80 px-6 py-2.5 text-white capitalize font-medium text-[12px]' : 'bg-white px-6 py-2.5 text-[12px] capitalize font-medium'}
                      onClick={() => setSelectedToggle(item.value)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>
              <div>
                <Menu className="p-0" open={openMenu} handler={setOpenMenu} allowHover>
                  <MenuHandler>
                    <Button variant="text" className="flex items-center gap-3 text-[14px] font-semibold text-[#0F2552] capitalize tracking-normal">
                      {selectedYear}
                      <ChevronDownIcon strokeWidth={2.5} className={`h-3.5 w-3.5 transition-transform ${openMenu ? "rotate-180" : ""}`} />
                    </Button>
                  </MenuHandler>
                  <MenuList className="hidden w-[5rem] grid-cols-7 gap-3 overflow-visible lg:grid">
                    <ul className="col-span-7 flex w-full flex-col gap-1">
                      {availableYears.map((year) => (
                        <MenuItem key={year} onClick={() => setSelectedYear(year)}>
                          <Typography variant="small">{year}</Typography>
                        </MenuItem>
                      ))}
                    </ul>
                  </MenuList>
                </Menu>
              </div>
            </div>
            <div className="px-2 pb-0">
              {isChartLoading ? (
                <div className="h-[225px] flex items-center justify-center text-sm text-gray-400">
                  Loading chart...
                </div>
              ) : (
                <Chart {...schoolCostChartConfig} />
              )}
            </div>
          </Card>
        </div>
      </div>
      <div className="mb-4 mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <StudentsTable />
        <DriversTable />
      </div>
    </div>
  );
}

export default Home;
