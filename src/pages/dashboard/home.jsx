import React, { useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  ButtonGroup,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import Chart from "react-apexcharts";

import {
  menuItems,
  statisticsCardsData,
} from "@/data";
import { Link } from "react-router-dom";
import StudentsTable from "@/components/StudentTable";
import DriversTable from "@/components/DriverTable";
import { chartConfig } from "@/configs";

export function Home() {
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState('Students');

  return (
    <div className="mt-12">
      <div className="grid xl:grid-cols-2 grid-cols-1 xl:space-y-0 space-y-[1rem] gap-5">
        <div className="xl:space-y-0 space-y-3">
          <div className="grid xl:grid-cols-3 md:h-[155px] h-[100px] xl:gap-x-3 grid-cols-3 mb-3 space-x-1">
            {statisticsCardsData.map(({ title, ...rest }) => (
              <StatisticsCard
                key={title}
                {...rest}
                title={title}
              />
            ))}
          </div>
          <div className="bg-white w-full rounded-[4px] shadow-md xl:h-[180px] px-2 md:px-5 py-2 xl:py-2 overflow-hidden">
            <div className="flex items-center justify-between">
              <Typography className="text-[#202224] text-[18px] md:text-[24px] font-extrabold">Reports</Typography>
              <Link to={`/dashboard/feedback-and-support`}>
                <Button variant="text" className="bg-transparent shadow-none text-[#C01824] font-extrabold text-[12px] capitalize">View All</Button>
              </Link>
            </div>
            <Typography variant="paragraph" className="font-semibold leading-tight text-xs md:text-[14px] pt-2 px-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor
              sit amet, consectetur adipiscing elit</Typography>
            <Typography variant="paragraph" className="font-semibold leading-tight text-xs md:text-[14px] border py-2 px-3 rounded-[10px] mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim ad eveniet eum illo! Aliquam deserunt dolores sed. Lorem ipsum dolor sit amet consectetur.</Typography>
          </div>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6">
          <Card className="rounded-[4px] w-full xl:max-w-full lg:max-w-[565px] md:max-w-[500px]">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="flex flex-col justify-between gap-4 rounded-none md:flex-row md:items-center border-b border-[#E4E5E7] pb-2"
            >
              <div className="flex md:flex-row flex-col md:space-x-8 md:items-center">
                <Typography variant="h4" className="text-[20px] font-extrabold text-[#141516]">
                  Attendance
                </Typography>
                <ButtonGroup className="border border-[#E5E5E9] md:w-full w-[180px] rounded-md outline-none !p-0" variant="text" size='lg'>
                  {['Students', 'Drivers',].map(attendance => (
                    <Button
                      key={attendance}
                      className={selectedAttendance === attendance ? 'bg-[#C01824] hover:bg-[#C01824]/80 px-6 py-2.5 text-white capitalize font-medium text-[12px]' : 'bg-white px-6 py-2.5 text-[12px] capitalize font-medium'}
                      onClick={() => setSelectedAttendance(attendance)}
                    >
                      {attendance}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>

              <div>
                <Menu className="p-0" open={openMenu} handler={setOpenMenu} allowHover>
                  <MenuHandler>
                    <Button
                      variant="text"
                      className="flex items-center gap-3 text-[14px] font-semibold text-[#0F2552] capitalize tracking-normal"
                    >
                      Month
                      <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`h-3.5 w-3.5 transition-transform ${openMenu ? "rotate-180" : ""
                          }`}
                      />
                    </Button>
                  </MenuHandler>
                  <MenuList className="hidden w-[5rem] grid-cols-7 gap-3 overflow-visible lg:grid">
                    <ul className="col-span-7 flex w-full flex-col gap-1">
                      {menuItems.map(({ title, description }) => (
                        <Link to="#" key={title}>
                          <MenuItem>
                            <Typography variant="small">
                              {title}
                            </Typography>
                            <Typography
                              variant="small"
                              color="gray"
                              className="font-normal text-sm"
                            >
                              {description}
                            </Typography>
                          </MenuItem>
                        </Link>
                      ))}
                    </ul>
                  </MenuList>
                </Menu>
              </div>
            </CardHeader>
            <CardBody className="px-2 pb-0">
              <Chart {...chartConfig} />
            </CardBody>
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
