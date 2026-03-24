import React, { useEffect, useState } from 'react'
import { announcementcardimg, filterIcon, vechileWhite } from '@/assets'
import MainLayout from '@/layouts/SchoolLayout'
import { Button, Card, CardBody, CardFooter, Typography, Spinner } from '@material-tailwind/react'
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
import AddBusInfoForm from '@/components/AddBusInfoForm'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBuses, fetchTerminals } from '@/redux/slices/busesSlice'
const VehicleManagement = () => {
    const dispatch = useDispatch();
    const { terminals, buses, loading } = useSelector((state) => state.buses);
    const isLoadingBuses = loading?.buses || false;

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
    const [selectedScheduleDate, setSelectedScheduleDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const openSortBy = Boolean(anchorEl);
    const [selectedTerminal, setSelectedTerminal] = useState('All Terminals');
    const [open, setOpen] = useState(false);
    const itemsPerPage = 9;
    const [addbusinfo, setAddBusInfo] = useState(false);
    const [editBus, setEditBus] = useState(null);
    
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedVehicleForMenu, setSelectedVehicleForMenu] = useState(null);

    const handleAddBusClick = () => {
        setEditBus(null);
        setAddBusInfo(true);
    };

    const handleCancel = () => {
        setAddBusInfo(false);
        setEditBus(null);
    };

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

    const handleMenuOpen = (event, vehicle) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedVehicleForMenu(vehicle);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedVehicleForMenu(null);
    };

    const handleEditClickFromMenu = () => {
        if (selectedVehicleForMenu) {
            setEditBus(selectedVehicleForMenu);
            setAddBusInfo(true);
        }
        handleMenuClose();
    };

    const terminalOptions = React.useMemo(() => {
        const normalized = (Array.isArray(terminals) ? terminals : []).map((terminal) => ({
            id: terminal.TerminalId || terminal.id,
            name: terminal.TerminalName || terminal.name || 'Unknown',
        }));

        return [{ id: 'all', name: 'All Terminals' }, ...normalized];
    }, [terminals]);

    const normalizedBuses = React.useMemo(() => {
        if (Array.isArray(buses)) return buses;
        if (buses && typeof buses === 'object') {
            return Object.values(buses).flatMap((terminalBuses) =>
                Array.isArray(terminalBuses) ? terminalBuses : []
            );
        }
        return [];
    }, [buses]);

    const filteredBuses = React.useMemo(() => {
        if (selectedTerminal === 'All Terminals') return normalizedBuses;
        return normalizedBuses.filter((bus) => {
            const terminalName = bus.TerminalName || bus.terminalName || 'Unknown';
            return terminalName === selectedTerminal;
        });
    }, [normalizedBuses, selectedTerminal]);

    const totalPages = Math.max(1, Math.ceil(filteredBuses.length / itemsPerPage));

    const renderPageNumbers = () => {
        const pages = [];
        const totalVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(totalVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + totalVisiblePages - 1);

        if (endPage - startPage + 1 < totalVisiblePages) {
            startPage = Math.max(1, endPage - totalVisiblePages + 1);
        }

        if (startPage > 1) {
            pages.push(<button key={1} onClick={() => setCurrentPage(1)} className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === 1 ? 'bg-black text-white' : 'bg-white text-black border border-black'}`}>1</button>);
            if (startPage > 2) pages.push(<span key="start-ellipsis" className="px-1">...</span>);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(<button key={i} onClick={() => setCurrentPage(i)} className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === i ? 'bg-black text-white' : 'bg-white text-black border border-black'}`}>{i}</button>);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push(<span key="end-ellipsis" className="px-1">...</span>);
            pages.push(<button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === totalPages ? 'bg-black text-white' : 'bg-white text-black border border-black'}`}>{totalPages}</button>);
        }

        return pages;
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentVehicles = filteredBuses.slice(startIndex, endIndex);

    const busesGrouped = React.useMemo(() => {
        return currentVehicles.reduce((acc, bus) => {
            const key = bus.TerminalName || bus.terminalName || 'Unknown';
            if (!acc[key]) acc[key] = [];
            acc[key].push(bus);
            return acc;
        }, {});
    }, [currentVehicles]);

    // Calculate total bus count (handle both array and object structures)
    const totalBusesCount = React.useMemo(() => {
        return normalizedBuses.length;
    }, [normalizedBuses]);

    // Fetch buses from Redux on mount
    useEffect(() => {
        dispatch(fetchBuses());
        dispatch(fetchTerminals());
    }, [dispatch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTerminal, toogle]);
    return (
        <MainLayout>
            {isNavigate ? (
                <RepairSchedule 
                    vehicle={selectedVehicle} 
                    onBack={handleBackClick} 
                    handleSeeMoreInfoClick={handleSeeMoreInfoClick} 
                    handleEditClick={handleEditClick} 
                    handleNotes={handleNotes} 
                    setShowScheduleManagement={setShowScheduleManagement} 
                    setIsNavigate={setIsNavigate}
                    setSelectedScheduleDate={setSelectedScheduleDate}
                />
            ) : isSeeMoreInfo ? (
                <VehicleInfoComponent vehicle={selectedVehicle} onBack={handleBackClick} />
            ) : editMode ? (
                <EditScheduledMaintenance item={editSelectedItem} onBack={handleBackClick} scheduleRepair={scheduleRepair} handleAddMore={handleAddMore} setEditMode={setEditMode} setIsNavigate={setIsNavigate} />
            ) : reportedDefects ? (
                <ReportedDefects vehicle={selectedVehicle} onBack={handleBackClick} handleSeeMoreInfoClick={handleSeeMoreInfoClick} handleScheduleRepair={handleScheduleRepair} />
            ) : notes ? (
                <Notes item={selectedVehicle} onBack={handleBackClick} handleSeeMoreInfoClick={handleSeeMoreInfoClick} />
            ) : showScheduleManagement ? (
                <SehcudleManagement 
                    onBack={handleBackClick} 
                    vehicle={selectedVehicle}
                    selectedDate={selectedScheduleDate}
                />
            ) : addbusinfo ? (
                <AddBusInfoForm 
                    handleCancel={handleCancel} 
                    refreshBuses={() => dispatch(fetchBuses())} 
                    editBus={editBus}
                />
            ) : (
                <section className="w-full h-full">
                    <div className="w-full bg-white p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex w-[35%] ps-4 space-x-4">
                                <p className='p-4 font-medium'><strong>Total Vehicles: {totalBusesCount}</strong></p>
                                <Button className="bg-[#C01824] w-[50%] text-white hover:bg-[#A01520] px-6" onClick={handleAddBusClick}>
                                    Add Bus
                                </Button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-700 text-[14px]">Sort By Terminal</span>
                                <Button variant="outline" className="bg-[#D2D2D2] border-gray-200 flex items-center space-x-1" onClick={handleClick}>
                                    <span>{selectedTerminal}</span>
                                    <FaChevronDown size={16} />
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={openSortBy}
                                    onClose={handleClose}
                                    PaperProps={{
                                        className: "w-[150px] rounded-md shadow-lg bg-[#D2D2D2]",
                                    }}
                                >
                                    {terminalOptions.map((option) => (
                                        <MenuItem
                                            key={option.id}
                                            onClick={() => {
                                                setSelectedTerminal(option.name);
                                                handleClose();
                                            }}
                                            className="px-4 py-2 text-black bg-[#E0E0E0] hover:bg-[#BDBDBD]"
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                                {/* <span className="text-gray-700 text-[14px]">Sort By</span>
                                <Button variant="outline" className="bg-[#D2D2D2] border-gray-200 flex items-center space-x-1" onClick={handleClick}>
                                    <span>{selectedTerminal}</span>
                                    <FaChevronDown size={16} />
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={openSortBy}
                                    onClose={handleClose}
                                    PaperProps={{
                                        className: "w-[150px] rounded-md shadow-lg bg-[#D2D2D2]",
                                    }}
                                >
                                    {["Terminal", "Due Date", "Bus No", "Completed By"].map((option) => (
                                        <MenuItem key={option} onClick={handleClose} className="px-4 py-2 text-black bg-[#E0E0E0] hover:bg-[#BDBDBD]">
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Menu> */}
                                <div className="text-black bg-transparent flex items-center space-x-1 cursor-pointer" onClick={() => setToogle(!toogle)}>
                                    {toogle ? (
                                        <>
                                            <span>Tile View</span>
                                            <TbLayoutGrid size={18} />
                                        </>
                                    ) : (
                                        <>
                                            <span>List View</span>
                                            <IoIosList size={25} />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white w-full rounded-[4px] border shadow-sm p-4 flex flex-wrap justify-center gap-6 min-h-[60vh]">
                        {isLoadingBuses ? (
                            <div className="flex flex-col items-center justify-center h-full w-full">
                                <Spinner className="h-8 w-8 text-[#C01824]" />
                                <p className="mt-3 text-sm text-gray-500">Loading vehicles...</p>
                            </div>
                        ) : (filteredBuses.length === 0) ? (
                            <div className="flex flex-col items-center justify-center h-full w-full text-center text-gray-600 py-12">
                                <p className="text-lg font-semibold">No vehicles found.</p>
                                <p className="text-sm mt-1">
                                    {selectedTerminal === 'All Terminals'
                                        ? 'Use "Add Bus" to create the first vehicle.'
                                        : `No vehicles found for ${selectedTerminal}.`}
                                </p>
                            </div>
                        ) : toogle ? (
                            <div className={`flex flex-wrap justify-center gap-6 px-2 ${currentVehicles.length > 8 ? "max-h-[500px] overflow-y-auto" : "overflow-y-hidden"}`}>
                                {Object.keys(busesGrouped).map((terminal) => (
                                    <div key={terminal} className="mb-6">
                                        <Typography className="text-[16px] font-extrabold text-black mb-2">{terminal}</Typography>
                                        <div className="flex flex-wrap justify-center gap-6">
                                            {busesGrouped[terminal].map((vehicle) => (
                                                <Card key={vehicle.BusId || vehicle.id} className="w-[330px] h-[330px] shadow-2xl rounded-[16px] mt-4 overflow-hidden p-2 flex flex-col">
                                                    <div className="flex justify-end items-end px-3 py-2">
                                                        <div className="relative">
                                                            <BsThreeDots className="text-black cursor-pointer text-lg" onClick={(e) => handleMenuOpen(e, vehicle)} />
                                                            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                                                                <MenuItem onClick={handleEditClickFromMenu}>Edit</MenuItem>
                                                            </Menu>
                                                        </div>
                                                    </div>
                                                    <img
                                                        src={vehicle.vehiclImg || '/src/assets/vechicelSvg.svg'}
                                                        alt={vehicle.VehicleName || vehicle.vehicleName || "Vehicle"}
                                                        className="w-full h-[140px] rounded-[8px] mx-auto object-cover"
                                                    />
                                                    <CardBody className="flex-1 px-3 flex flex-col justify-between">
                                                        <Typography className="mb-1 text-center font-extrabold text-[14px] text-black truncate">
                                                            {vehicle.VehicleName || vehicle.vehicleName || "N/A"}
                                                        </Typography>
                                                        <Typography className="text-center text-[12px] font-bold text-[#000] cursor-pointer">
                                                            Status:{" "}
                                                            <span className={`text-[12px] font-semibold ${(vehicle.vehicleStatus || vehicle.VehicleStatus) === "Defect Reported" ? "text-[#C01824]" : "text-[#147D2C]"}`}>
                                                                {vehicle.vehicleStatus || vehicle.VehicleStatus || "Active"}
                                                            </span>
                                                        </Typography>
                                                    </CardBody>
                                                    <CardFooter className="px-2 py-1 flex justify-center gap-2">
                                                        <Button className="py-1 bg-[#C01824] capitalize text-[11px] font-semibold rounded-[6px] h-[37px] flex-1" onClick={() => handleReportedDefect(vehicle)}>
                                                            See Info
                                                        </Button>
                                                        <Button className="py-1 bg-[#FDE6E6] capitalize text-[11px] font-semibold rounded-[6px] text-[#C01824] h-[37px] flex-1" onClick={() => handleRepairScheduleClick(vehicle)}>
                                                            Repair Schedule
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
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
                                        {currentVehicles.length > 0 ? (
                                            currentVehicles.map((vehicle) => (
                                                <tr key={vehicle.BusId} className="border-b">
                                                    <td className="p-4">
                                                        <img
                                                            src={vehicle.vehiclImg || '/src/assets/vechicelSvg.svg'}
                                                            alt={vehicle.VehicleName || "Bus"}
                                                            className="w-24 h-16 object-cover"
                                                        />
                                                    </td>

                                                    <td className="p-4 font-medium">{vehicle.VehicleName || vehicle.vehicleName || "N/A"}</td>

                                                    <td className="p-4">{vehicle.TerminalName || vehicle.terminalName || "N/A"}</td>

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
                                                        <div className="relative">
                                                            <IoEllipsisHorizontal
                                                                size={25}
                                                                className="cursor-pointer"
                                                                onClick={(e) => handleMenuOpen(e, vehicle)}
                                                            />
                                                            <Menu
                                                                anchorEl={menuAnchorEl}
                                                                open={Boolean(menuAnchorEl)}
                                                                onClose={handleMenuClose}
                                                                PaperProps={{
                                                                    className: "bg-white border rounded-md p-2 shadow-none",
                                                                    elevation: 0,
                                                                }}
                                                            >
                                                                <MenuItem onClick={handleEditClickFromMenu}>Edit</MenuItem>
                                                            </Menu>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center p-4 text-gray-500">
                                                    No vehicles found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>


                                </table>
                            </div>
                        )}

                        {!isLoadingBuses && (
                            <div className="flex items-end justify-end space-x-2 w-[90%]">
                                <span className="mr-2 text-black-700">Page</span>
                                {renderPageNumbers()}
                                <ChevronRightIcon
                                    className={`w-5 h-5 ${currentPage < totalPages ? 'text-black cursor-pointer' : 'text-gray-400'}`}
                                    onClick={() => currentPage < totalPages && setCurrentPage((prev) => prev + 1)}
                                />
                            </div>
                        )}
                        <FilterModal open={open} onClose={() => setOpen(false)} />
                    </div>
                </section>
            )}
        </MainLayout>
    );
};

export default VehicleManagement;
