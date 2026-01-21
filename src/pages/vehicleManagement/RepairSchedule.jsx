import React, { useRef, useState, useEffect } from "react";
import VendorDashboardHeader from "@/components/VendorDashboardHeader";
import {
  Popover,
  PopoverHandler,
  Typography,
  Input,
  PopoverContent,
  Spinner,
} from "@material-tailwind/react";
import ButtonComponent from "@/components/buttons/CustomButton";
import { CalenderIcon, editicon, filterIcon } from "@/assets";
import { CiSearch } from "react-icons/ci";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { FaChevronDown } from "react-icons/fa6";
import DatePickerComponent from "@/components/DatePicker";
import PositionedMenu from "@/components/ServiceDialog";
import { Button } from "@mui/material";
import VehicleInfoComponent from "./VehicleInfoComponent";
import { vechicelSvg } from "@/assets";
import ServiceRecordForm from "@/components/ServiceRecordForm";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRepairSchedules,
  deleteRepairSchedule,
} from "@/redux/slices/repairScheduleSlice";

const RepairSchedule = ({
  vehicle,
  onBack,
  setShowScheduleManagement,
  setIsNavigate,
  setSelectedScheduleDate,
}) => {
  const dispatch = useDispatch();
  const { repairSchedules, loading } = useSelector((state) => state.repairSchedule);
  const [date, setDate] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);
  const [vehicleInfoData, setVehicleInfoData] = useState(null);
  const datePickerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceRecord, setServiceRecord] = useState(false);

  // Extract busId from vehicle
  const busId = vehicle?.vehicleId 
    || vehicle?.VehicleId 
    || vehicle?.BusId 
    || vehicle?.busId 
    || vehicle?.id 
    || vehicle?.Id
    || vehicle?.ID;

  // Fetch repair schedules when component mounts or busId changes
  useEffect(() => {
    if (busId) {
      dispatch(fetchRepairSchedules(busId));
    }
  }, [dispatch, busId]);

  const handleServiceRecordClick = () => {
    setServiceRecord(true);
  };

  const handleCancel = () => setServiceRecord(false);

  const handleButtonClick = () => {
    setIsCalendarOpen(!isCalendarOpen);
    if (!isCalendarOpen && datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Scheduled Maintenance";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSeeMoreInfoClick = (vehicle) => {
    setVehicleInfoData(vehicle);
    setShowVehicleInfo(true);
  };

  const handleSeeLessClick = () => {
    setShowVehicleInfo(false);
    setVehicleInfoData(null);
  };

  const handleEditClick = (item) => {
    console.log("Edit Clicked:", item);
    // TODO: Open edit modal/form with item data
  };

  const handleNotes = (item) => {
    console.log("Notes Clicked:", item);
    // TODO: Show notes modal
  };

  const handleDelete = async (maintenanceId) => {
    if (window.confirm("Are you sure you want to delete this repair schedule?")) {
      await dispatch(deleteRepairSchedule(maintenanceId));
      // Refresh the list after deletion
      if (busId) {
        dispatch(fetchRepairSchedules(busId));
      }
    }
  };

  // Filter and search repair schedules
  const filteredSchedules = repairSchedules.filter((schedule) => {
    const matchesSearch = searchQuery === "" || 
      (schedule.serviceDesc?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (schedule.partDesc?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (schedule.vendor?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (schedule.terminal?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDate = !date || 
      (schedule.repairDate && format(new Date(schedule.repairDate), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));
    
    return matchesSearch && matchesDate;
  });

  if (showVehicleInfo) {
    return (
      <VehicleInfoComponent
        vehicle={vehicleInfoData}
        onBack={handleSeeLessClick}
      />
    );
  }

  // Use vehicle prop or fallback to default
  const vehicleData = vehicle || {
    vehiclImg: vechicelSvg,
    vehicleName: "Minotour® School Bus.",
    BusType: "School Bus",
    VehicleMake: "Minotour",
    NumberPlate: "112200",
  };

  return (
    <>
      {serviceRecord ? (
        <ServiceRecordForm 
          handleCancel={handleCancel} 
          vehicle={vehicleData}
          busId={busId}
          onSuccess={() => {
            handleCancel();
            if (busId) {
              dispatch(fetchRepairSchedules(busId));
            }
          }}
        />
      ) : (
        <section className="w-full h-full">
          <div className="bg-white w-full rounded-[4px] border shadow-sm h-full">
            <VendorDashboardHeader
              title="Repair Schedule"
              icon={true}
              TextClassName="md:text-[22px]"
              className="ms-12"
              handleNavigate={onBack}
            />

            <div className="flex flex-row w-[97%] h-[23vh] justify-between h-[33vh] m-5 border-b-2 border-[#d3d3d3]">
              <div className="flex flex-row w-[60%] h-[23vh] gap-[59px]">
                <img 
                  src={vehicleData?.vehiclImg || vehicleData?.VehicleImage || vechicelSvg} 
                  alt={vehicleData?.vehicleName || vehicleData?.VehicleName || "Vehicle"}
                  className="w-48 h-32 object-cover rounded"
                />
                <div className="flex flex-col h-full w-[65%] gap-[13px]">
                  <Typography className="mb-2 text-start font-extrabold text-[19px] text-black">
                    {vehicleData?.vehicleName || vehicleData?.VehicleName || "N/A"}
                  </Typography>
                  <div className="flex flex-row gap-[85px]">
                    <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                      Bus type
                    </Typography>
                    <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                      {vehicleData?.BusType || vehicleData?.busType || "School Bus"}
                    </Typography>
                  </div>
                  <div className="flex flex-row gap-[50px]">
                    <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                      Vehicle Make
                    </Typography>
                    <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                      {vehicleData?.VehicleMake || vehicleData?.vehicleMake || "N/A"}
                    </Typography>
                  </div>
                  <div className="flex flex-row gap-[45px]">
                    <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                      Number Plate
                    </Typography>
                    <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                      {vehicleData?.NumberPlate || vehicleData?.numberPlate || "N/A"}
                    </Typography>
                  </div>
                  <ButtonComponent
                    sx={{ width: "145px", height: "42px", fontSize: "13px" }}
                    label="See more Info"
                    Icon={false}
                    onClick={() => handleSeeMoreInfoClick(vehicleData)}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <ButtonComponent
                  sx={{ width: "244px", height: "49px", fontSize: "12px" }}
                  label={formattedDate}
                  Icon={true}
                  IconName={CalenderIcon}
                  onClick={handleButtonClick}
                />
                {isCalendarOpen && (
                  <DatePickerComponent
                    selectedDate={selectedDate}
                    onDateChange={(date) => {
                      setSelectedDate(date);
                      setIsCalendarOpen(false);
                      setIsNavigate(false);
                      if (setSelectedScheduleDate) {
                        setSelectedScheduleDate(date);
                      }
                      setShowScheduleManagement(true);
                    }}
                    datePickerRef={datePickerRef}
                  />
                )}
              </div>

              <Button
                sx={{
                  backgroundColor: "#c01824",
                  color: "#fff",
                  width: "244px",
                  height: "49px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  borderRadius: "6px",
                  padding: "6px 16px",
                  "&:hover": {
                    backgroundColor: "#c01824",
                  },
                }}
                onClick={handleServiceRecordClick}
              >
                Service Record
              </Button>
            </div>

            {/* ----------- table-Content -------------------- */}
            <div className="flex flex-col w-[97%] h-[40vh] m-5">
              <div className="flex flex-row w-[97%] h-[8vh] gap-12 justify-between m-5 items-center">
                <ButtonComponent
                  label="Filters"
                  Icon={true}
                  IconName={filterIcon}
                  sx={{
                    width: "100px",
                    height: "43px",
                    fontSize: "16px",
                    fontWeight: "400",
                    fontFamily: "Nunito Sans, sans-serif",
                    textTransform: "none",
                    gap: 1,
                  }}
                  onClick={handleClick}
                />
                {anchorEl && (
                  <PositionedMenu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    handleClose={handleClose}
                  />
                )}

                <div className="mr-auto w-55 flex flex-row md:max-w-screen-3xl md:w-[335px] h-[47px] bg-white border ps-4 border-[#DCDCDC] rounded-[6px] items-center">
                  <CiSearch size={25} color="#787878" />
                  <input
                    type="search"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-3 w-[98%] text-[#090909] font-light outline-none rounded-[6px] h-[45px]"
                  />
                </div>

                <Typography className="mb-2 text-start font-bold text-[16px] text-black">
                  Sort By
                </Typography>
                <div className="md:w-[250px]">
                  <Popover placement="bottom">
                    <PopoverHandler>
                      <div className="relative">
                        <Input
                          label="Date"
                          onChange={() => null}
                          value={date ? format(date, "PPP") : ""}
                          className="bg-[#D2D2D2]"
                        />
                        <FaChevronDown
                          className="absolute right-4 top-3"
                          color="#787878"
                        />
                      </div>
                    </PopoverHandler>
                    <PopoverContent>
                      <DayPicker
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        showOutsideDays
                        classNames={{ day_selected: "bg-[#C01824] text-white" }}
                        components={{
                          IconLeft: (props) => (
                            <ChevronLeftIcon
                              {...props}
                              className="h-4 w-4 stroke-2"
                            />
                          ),
                          IconRight: (props) => (
                            <ChevronRightIcon
                              {...props}
                              className="h-4 w-4 stroke-2"
                            />
                          ),
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* -------------------- Table-Content -------------------------- */}
              <div className="overflow-x-auto border border-gray-200 rounded">
                <table className="min-w-full">
                  <thead className="bg-[#EEEEEE]">
                    <tr>
                      {[
                        "Repair/Service Description",
                        "P/N",
                        "Part Description",
                        "Qty",
                        "Vendor",
                        "Part Cost",
                        "Mileage",
                        "Estimated Completion",
                        "Terminal",
                        "Notes",
                      ].map((title, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 border-b text-left text-sm font-extrabold text-black"
                        >
                          {title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading.fetching ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-8 text-center">
                          <div className="flex justify-center items-center">
                            <Spinner className="h-8 w-8 text-[#C01824]" />
                            <span className="ml-3 text-gray-500">Loading repair schedules...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredSchedules.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                          No repair schedules found
                        </td>
                      </tr>
                    ) : (
                      filteredSchedules.map((item, index) => (
                        <tr
                          key={item.maintenanceId || index}
                          className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                            {item.serviceDesc || "N/A"}
                          </td>
                          <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                            {item.passNum || "N/A"}
                          </td>
                          <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                            {item.partDesc || "N/A"}
                          </td>
                          <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                            {item.quantity || "N/A"}
                          </td>
                          <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                            {item.vendor || "N/A"}
                          </td>
                          <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                            {item.partCost ? `$${item.partCost}` : "N/A"}
                          </td>
                          <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                            {item.mileage ? `${item.mileage}Km` : "N/A"}
                          </td>
                          <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                            {item.estimatedCompletionTime || "N/A"}
                          </td>
                          <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                            {item.terminal || "N/A"}
                          </td>
                          <td
                            className="px-6 py-4 border-b text-[14px] font-[600] text-[#C01824] underline flex-row flex gap-7 cursor-pointer"
                            onClick={() => handleNotes(item)}
                          >
                            {item.notes || "See Notes"}
                            <div
                              className="flex space-x-2 md:space-x-7 justify-start items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(item);
                              }}
                            >
                              <img
                                src={editicon}
                                className="cursor-pointer w-5"
                                alt="Edit Icon"
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default RepairSchedule;
