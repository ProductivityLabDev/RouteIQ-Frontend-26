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
  updateRepairScheduleNotes,
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
  const topCalendarWrapperRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceRecord, setServiceRecord] = useState(false);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([]);
  const [selectedRepairTypes, setSelectedRepairTypes] = useState([]);
  const [sortDate, setSortDate] = useState(null);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [editingNotesText, setEditingNotesText] = useState("");

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
    dispatch(
      fetchRepairSchedules({
        busId,
        search: searchQuery || undefined,
        repairTypes: selectedRepairTypes,
        serviceTypes: selectedServiceTypes,
        date: sortDate ? format(sortDate, "yyyy-MM-dd") : undefined,
        limit: 20,
        offset: 0,
      })
    );
  }, [dispatch, busId, searchQuery, selectedRepairTypes, selectedServiceTypes, sortDate]);

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

  useEffect(() => {
    if (!isCalendarOpen) return;

    const handleOutsideClick = (event) => {
      if (
        topCalendarWrapperRef.current &&
        !topCalendarWrapperRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isCalendarOpen]);

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

  const handleStartNotesEdit = (item) => {
    setEditingNotesId(item.maintenanceId || item.MaintenanceId);
    setEditingNotesText(item.notes || "");
  };

  const handleCancelNotesEdit = () => {
    setEditingNotesId(null);
    setEditingNotesText("");
  };

  const handleSaveNotes = async (maintenanceId) => {
    const result = await dispatch(
      updateRepairScheduleNotes({
        maintenanceId,
        notes: editingNotesText || "",
      })
    );

    if (updateRepairScheduleNotes.fulfilled.match(result)) {
      dispatch(
        fetchRepairSchedules({
          busId,
          search: searchQuery || undefined,
          repairTypes: selectedRepairTypes,
          serviceTypes: selectedServiceTypes,
          date: sortDate ? format(sortDate, "yyyy-MM-dd") : undefined,
          limit: 20,
          offset: 0,
        })
      );
      handleCancelNotesEdit();
    }
  };

  const handleDelete = async (maintenanceId) => {
    if (window.confirm("Are you sure you want to delete this repair schedule?")) {
      await dispatch(deleteRepairSchedule(maintenanceId));
      // Refresh the list after deletion
      dispatch(
        fetchRepairSchedules({
          busId,
          search: searchQuery || undefined,
          repairTypes: selectedRepairTypes,
          serviceTypes: selectedServiceTypes,
          sortBy,
          limit: 20,
          offset: 0,
        })
      );
    }
  };

  // Date filter remains local on top of server-side filters
  const filteredSchedules = repairSchedules.filter((schedule) => {
    const matchesDate = !date || 
      (schedule.repairDate && format(new Date(schedule.repairDate), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));
    
    return matchesDate;
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
            dispatch(
              fetchRepairSchedules({
                busId,
                search: searchQuery || undefined,
                repairTypes: selectedRepairTypes,
                serviceTypes: selectedServiceTypes,
                date: sortDate ? format(sortDate, "yyyy-MM-dd") : undefined,
                limit: 20,
                offset: 0,
              })
            );
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

              <div className="flex flex-col items-center relative" ref={topCalendarWrapperRef}>
                <ButtonComponent
                  sx={{ width: "244px", height: "49px", fontSize: "12px" }}
                  label={formattedDate}
                  Icon={true}
                  IconName={CalenderIcon}
                  onClick={handleButtonClick}
                />
                {isCalendarOpen && (
                  <div className="absolute top-[58px] z-50">
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
                  </div>
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
                      selectedServiceTypes={selectedServiceTypes}
                      selectedRepairTypes={selectedRepairTypes}
                      onApply={({ serviceTypes, repairTypes }) => {
                        setSelectedServiceTypes(serviceTypes);
                        setSelectedRepairTypes(repairTypes);
                      }}
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
                   Date
                  </Typography>
                  <div className="md:w-[250px]">
                    <Popover placement="bottom-end">
                      <PopoverHandler>
                        <div>
                          <ButtonComponent
                            sx={{ width: "244px", height: "43px", fontSize: "12px" }}
                            label={sortDate ? format(sortDate, "PPP") : "Select Date"}
                            Icon={true}
                            IconName={CalenderIcon}
                          />
                        </div>
                      </PopoverHandler>
                      <PopoverContent>
                        <DayPicker
                          mode="single"
                          selected={sortDate}
                          onSelect={(nextDate) => setSortDate(nextDate || null)}
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
                            className="px-6 py-4 border-b text-[14px] font-[600] text-[#C01824]"
                          >
                            {editingNotesId === (item.maintenanceId || item.MaintenanceId) ? (
                              <div className="flex min-w-[220px] flex-col gap-2">
                                <textarea
                                  value={editingNotesText}
                                  onChange={(e) => setEditingNotesText(e.target.value)}
                                  rows={3}
                                  className="w-full rounded border border-[#D5D5D5] p-2 text-sm text-[#141516] outline-none"
                                  placeholder="Enter notes"
                                />
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveNotes(item.maintenanceId || item.MaintenanceId)}
                                    disabled={loading.updating}
                                    className="rounded bg-[#C01824] px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
                                  >
                                    {loading.updating ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelNotesEdit}
                                    className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-3">
                                <span className="underline">{item.notes || "See Notes"}</span>
                                <div className="flex space-x-2 md:space-x-7 justify-start items-center">
                                  <img
                                    src={editicon}
                                    className="cursor-pointer w-5"
                                    alt="Edit Icon"
                                    onClick={() => handleStartNotesEdit(item)}
                                  />
                                </div>
                              </div>
                            )}
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
