import React, { useState } from 'react'
import { announcementcardimg, filterIcon, vechileWhite } from '@/assets'
import MainLayout from '@/layouts/SchoolLayout'
import { Button, Card, CardBody, CardFooter, Typography } from '@material-tailwind/react'
import { vehicleManagement } from '@/data/vehicleManagementData'
import RepairSchedule from './RepairSchedule'
import { Menu, MenuItem } from "@mui/material";
import VehicleInfoComponent from './VehicleInfoComponent'
import EditScheduledMaintenance from './EditScheduledMaintenance'
import ReportedDefects from './ReportedDefects'
import Notes from './Notes'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import SehcudleManagement from '@/components/SehcudleManagement'
import { FaChevronDown, FaClock, FaFilter } from 'react-icons/fa'
import { TbLayoutGrid } from 'react-icons/tb'
import { FilterModal } from '@/components/Modals/FilterModal'
import { IoEllipsisHorizontal } from "react-icons/io5";
import { BsThreeDots } from 'react-icons/bs'
import { IoIosList } from "react-icons/io";

const VehicleManagement = () => {
    const [isNavigate, setIsNavigate] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isSeeMoreInfo, setIsSeeMoreInfo] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editSelectedItem, setEditSelectedItem] = useState(null);
    const [reportedDefects, setReportedDefects] = useState(null);
    const [scheduleRepair, setScheduleRepair] = useState(false)
    const [toogle, setToogle] = useState(false)
    const [notes, setNotes] = useState(false)
    const [showScheduleManagement, setShowScheduleManagement] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const openSortBy = Boolean(anchorEl);
    const [selectedTerminal, setSelectedTerminal] = useState('Terminal');
    const [open, setOpen] = useState(false);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(itemsPerPage);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRepairScheduleClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsNavigate(true);
    };
    const handleSeeMoreInfoClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsSeeMoreInfo(true);
        setIsNavigate(null);
        setReportedDefects(false)
        setNotes(false)
    };
    const handleBackClick = () => {
        setIsNavigate(false);
        setSelectedVehicle(null);
        setIsSeeMoreInfo(false);
        setEditMode(false);
        setEditSelectedItem(null);
        setReportedDefects(false)
        setNotes(false)
        setShowScheduleManagement(false);

    };
    const handleEditClick = (item) => {
        setEditSelectedItem(item);
        setEditMode(true);
        setIsNavigate(false)
    };
    const handleReportedDefect = (item) => {
        setReportedDefects(true)
        setSelectedVehicle(item);
    }
    const handleScheduleRepair = () => {
        setReportedDefects(false)
        setScheduleRepair(true)
        setEditMode(true);
    }
    const handleAddMore = () => {
        setReportedDefects(false)
        setScheduleRepair(false)
        setEditMode(false);
        setIsNavigate(true)
    }
    const handleNotes = (item) => {
        setIsNavigate(false)
        setIsSeeMoreInfo(false)
        setSelectedVehicle(item)
        setNotes(true)
    }
    const renderPageNumbers = () => {
        const pages = [];
        const totalVisiblePages = 5; // Number of page buttons to display

        // Calculate start and end page numbers to display
        let startPage = Math.max(1, currentPage - Math.floor(totalVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + totalVisiblePages - 1);

        // Adjust the start page if there are not enough pages at the end
        if (endPage - startPage + 1 < totalVisiblePages) {
            startPage = Math.max(1, endPage - totalVisiblePages + 1);
        }

        // Always show the first page
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === 1
                        ? 'bg-black text-white'
                        : 'bg-white text-black border border-black'
                        }`}
                >
                    1
                </button>
            );

            // Add '...' after the first page if necessary
            if (startPage > 2) {
                pages.push(<span key="start-ellipsis" className="px-1">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    // onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === i
                        ? 'bg-black text-white'
                        : 'bg-white text-black border border-black'
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Always show the last page
        if (endPage < totalPages) {
            // Add '...' before the last page if necessary
            if (endPage < totalPages - 1) {
                pages.push(<span key="end-ellipsis" className="px-1">...</span>);
            }
            pages.push(
                <button
                    key={totalPages}
                    // onClick={() => setCurrentPage(totalPages)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === totalPages
                        ? 'bg-black text-white'
                        : 'bg-white text-black border border-black'
                        }`}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentVehicles = vehicleManagement.slice(startIndex, endIndex);

    const groupedVehicles = currentVehicles.reduce((acc, vehicle) => {
        if (!acc[vehicle.title]) {
            acc[vehicle.title] = [];
        }
        acc[vehicle.title].push(vehicle);
        return acc;
    }, {});
    return (
        <MainLayout>
            {isNavigate ?
                <RepairSchedule vehicle={selectedVehicle} onBack={handleBackClick} handleSeeMoreInfoClick={handleSeeMoreInfoClick} handleEditClick={handleEditClick} handleNotes={handleNotes} setShowScheduleManagement={setShowScheduleManagement} setIsNavigate={setIsNavigate} />
                : isSeeMoreInfo ? (
                    <VehicleInfoComponent vehicle={selectedVehicle} onBack={handleBackClick} />
                ) : editMode ? (
                    <EditScheduledMaintenance item={editSelectedItem} onBack={handleBackClick} scheduleRepair={scheduleRepair} handleAddMore={handleAddMore} setEditMode={setEditMode} setIsNavigate={setIsNavigate} />
                ) : reportedDefects ? (
                    <ReportedDefects vehicle={selectedVehicle} onBack={handleBackClick} handleSeeMoreInfoClick={handleSeeMoreInfoClick} handleScheduleRepair={handleScheduleRepair} />
                ) : notes ? (
                    <Notes item={selectedVehicle} onBack={handleBackClick} handleSeeMoreInfoClick={handleSeeMoreInfoClick} />
                ) : showScheduleManagement ? (
                    <SehcudleManagement onBack={handleBackClick} />
                ) : (
                    <section className="w-full h-full">
                        {/* header */}
                        <div className="w-full bg-white p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                {/* Left side buttons */}
                                <div className="flex w-[35%] ps-4 space-x-4">
                                    <Button className="bg-[#C01824] w-[50%] text-white hover:bg-[#A01520] px-6">
                                        Add Bus
                                    </Button>
                                    <Button className="bg-[#FDE6E6] w-[35%] text-[#C01824] hover:bg-[#FAD5D5] px-6">
                                        Service
                                    </Button>
                                </div>

                                {/* Right side filters and views */}
                                <div className="flex items-center  space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-700 text-[14px]">Sort By</span>
                                        <Button variant="outline" className="bg-[#D2D2D2] border-gray-200 flex items-center space-x-1" onClick={(e) => handleClick(e)}>
                                            <span>{selectedTerminal}</span>
                                            <FaChevronDown size={16} />
                                        </Button>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={openSortBy}
                                            onClose={handleClose}
                                            className="mt-2"
                                            PaperProps={{
                                                className: "w-[150px] rounded-md shadow-lg bg-[#D2D2D2]",
                                            }}

                                        >
                                            {["Terminal", "Due Date", "Bus No", "Completed By"].map((option) => (
                                                <MenuItem
                                                    key={option}
                                                    onClick={handleClose}
                                                    className="px-4 py-2 text-black bg-[#E0E0E0] hover:bg-[#BDBDBD]"
                                                    sx={{
                                                        backgroundColor: "#E0E0E0",
                                                        "&:hover": { backgroundColor: "#BDBDBD" },
                                                    }}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </div>

                                    <Button onClick={() => setOpen(true)} className="bg-[#C01824] text-white hover:bg-[#A01520] flex items-center space-x-2">
                                        <img src={filterIcon} className="w-[18px] h-[18px]" />
                                        <span>Filters</span>
                                    </Button>

                                    <div className="text-black bg-transparent flex items-center space-x-1">
                                        <FaClock size={18} />
                                        <span>History</span>
                                    </div>

                                    <div className="text-black bg-transparent flex items-center space-x-1" onClick={() => setToogle(!toogle)}>
                                        {
                                            toogle ?
                                                <>
                                                    <span>Tile View</span>
                                                    <TbLayoutGrid size={18} />
                                                </>
                                                :
                                                <>
                                                    <span>List View</span>
                                                    <IoIosList size={25} />
                                                </>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white w-full rounded-[4px] border shadow-sm p-4 flex flex-wrap justify-center gap-6">
                            {toogle ?
                                <div className={`flex flex-wrap justify-center gap-6 px-2 ${currentVehicles.length > 8 ? "max-h-[500px] overflow-y-auto" : "overflow-y-hidden"
                                    }`}>
                                    {Object.keys(groupedVehicles).map((terminal) => (
                                        <div key={terminal} className="mb-6">
                                            <Typography className="text-[16px] font-extrabold text-black mb-2">
                                                {terminal}
                                            </Typography>

                                            {/* Vehicles Grid */}
                                            <div className="flex flex-wrap justify-center gap-6">
                                                {groupedVehicles[terminal].map((vehicle) => (
                                                    <Card
                                                        key={vehicle.id}
                                                        className="w-[330px] h-[330px] shadow-2xl rounded-[16px] mt-4 overflow-hidden p-2 flex flex-col"
                                                    >
                                                        {/* Dots */}
                                                        <div className="flex justify-end items-end px-3 py-2">
                                                            <BsThreeDots className="text-black cursor-pointer text-lg" />
                                                        </div>

                                                        {/* Image */}
                                                        <img
                                                            src={vehicle.vehiclImg}
                                                            alt="card-image"
                                                            className="w-full h-[140px] rounded-[8px] mx-auto"
                                                        />

                                                        {/* Card Body */}
                                                        <CardBody className="flex-1 px-3 flex flex-col justify-between">
                                                            <Typography className="mb-1 text-center font-extrabold text-[14px] text-black truncate">
                                                                {vehicle.vehicleName}
                                                            </Typography>
                                                            <Typography className="text-center text-[12px] font-bold text-[#000] cursor-pointer">
                                                                Status:{" "}
                                                                <span
                                                                    className={`text-[12px] font-semibold ${vehicle.vehicleStatus === "Defect Reported"
                                                                        ? "text-[#C01824]"
                                                                        : "text-[#147D2C]"
                                                                        }`}
                                                                >
                                                                    {vehicle.vehicleStatus}
                                                                </span>
                                                            </Typography>
                                                        </CardBody>

                                                        {/* Card Footer (Buttons) */}
                                                        <CardFooter className="px-2 py-1 flex justify-center gap-2">
                                                            <Button
                                                                className="py-1 bg-[#C01824] capitalize text-[11px] font-semibold rounded-[6px] h-[37px] flex-1"
                                                                onClick={() => handleReportedDefect(vehicle)}
                                                            >
                                                                See Info
                                                            </Button>
                                                            <Button
                                                                className="py-1 bg-[#FDE6E6] capitalize text-[11px] font-semibold rounded-[6px] text-[#C01824] h-[37px] flex-1"
                                                                onClick={() => handleRepairScheduleClick(vehicle)}
                                                            >
                                                                Repair Schedule
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                :
                                <div className="hidden md:block w-full overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-4 text-left">Bus Picture</th>
                                                <th className="p-4 text-left">Bus Name</th>
                                                <th className="p-4 text-left">Terminal</th>
                                                <th className="p-4 text-left">Bus Information</th>
                                                <th className="p-4 text-left">Repair Schedule</th>
                                                <th className="p-4 text-left">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(groupedVehicles).map((terminal) => (
                                                <React.Fragment>
                                                    {groupedVehicles[terminal]?.map((vehicle) => (
                                                        <tr key={vehicle.id} className="border-b">
                                                            <td className="p-4">
                                                                <img
                                                                    src={vehicle.vehiclImg}
                                                                    alt={vehicle.vehicleName}
                                                                    className="w-24 h-16 object-cover"
                                                                />
                                                            </td>
                                                            <td className="p-4 font-medium">{vehicle.vehicleName}</td>
                                                            <td className="p-4">{vehicle.title}</td>
                                                            <td className="p-4">
                                                                <button
                                                                    className="bg-[#C01824] py-2 rounded text-white hover:bg-[#A01520] px-6"
                                                                    onClick={() => handleReportedDefect(vehicle)}
                                                                >
                                                                    See Info
                                                                </button>
                                                            </td>
                                                            <td className="p-4">
                                                                <button
                                                                    className="bg-[#FDE6E6] text-red-600 py-2 px-6 rounded hover:bg-red-100 transition-colors"
                                                                    onClick={() => handleRepairScheduleClick(vehicle)}
                                                                >
                                                                    Repair Schedule
                                                                </button>
                                                            </td>
                                                            <td className="p-4">
                                                                <IoEllipsisHorizontal size={25} />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            }

                            <div className="flex items-end justify-end space-x-2 w-[90%]">
                                <span className="mr-2 text-black-700">Page</span>
                                {renderPageNumbers()}
                                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <FilterModal open={open} onClose={() => setOpen(false)} />
                        </div>
                    </section>
                )
            }
        </MainLayout >
    )
}

export default VehicleManagement
