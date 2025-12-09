import React, { useEffect, useRef, useState } from 'react';
import { calendericonred, locationicon, studentfive, addIcon } from '@/assets';
import {
    Button,
    Typography,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Spinner,
} from '@material-tailwind/react';
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { createRoute } from "@/redux/slices/routesSlice";
import { fetchSchoolManagementSummary } from "@/redux/slices/schoolSlice";
import { fetchStudentsByInstitute } from "@/redux/slices/studentSlice";


const StudentSeatSelection = ({ onBack, editRoute, isEditable, handleBackTrip }) => {
    const dispatch = useDispatch();
    const { creating } = useSelector((state) => state.routes);
    const { schoolManagementSummary } = useSelector((state) => state.schools);
    const { students, loading: studentsLoading } = useSelector((state) => state.students);

    const [showSeats, setShowSeats] = useState(false);

    const handleFieldClick = () => {
        setShowSeats(true);
    };
    const drivers = ["Driver A", "Driver B", "Driver C"];

    const [selectedTime, setSelectedTime] = useState("");
    const timeSlots = [
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
        "05:00 PM", "06:00 PM"
    ];

    const menuRef = useRef(null);
    const selectedItemRef = useRef(null);
    const pickupDateRef = useRef(null);
    const routeDateRef = useRef(null);

    // Local form state for simple route creation
    const [routeForm, setRouteForm] = useState({
        pickup: "",
        dropoff: "",
        routeDate: "",
        routeTime: "",
        driverId: "",
        busId: "",
    });
    const [selectedDriverName, setSelectedDriverName] = useState("");
    const [selectedSchoolId, setSelectedSchoolId] = useState("");
    const isFormValid =
        routeForm.pickup?.trim() &&
        routeForm.dropoff?.trim() &&
        routeForm.routeDate &&
        routeForm.routeTime &&
        routeForm.driverId &&
        routeForm.busId;

    const handleRouteFieldChange = (e) => {
        const { name, value } = e.target;
        setRouteForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectDriver = (driverName) => {
        // Map index to a simple numeric driverId
        const index = drivers.indexOf(driverName);
        const driverId = index >= 0 ? index + 1 : "";
        setRouteForm((prev) => ({
            ...prev,
            driverId,
        }));
        setSelectedDriverName(driverName);
    };

    const handleSelectSchool = (e) => {
        const id = e.target.value;
        setSelectedSchoolId(id);
        if (id) {
            dispatch(fetchStudentsByInstitute(Number(id)));
        }
    };

    const handleSubmitRoute = async () => {
        if (!routeForm.pickup || !routeForm.dropoff || !routeForm.routeDate || !routeForm.routeTime) {
            alert("Please fill Pickup, Drop Off, Date and Time.");
            return;
        }

        try {
            const result = await dispatch(createRoute(routeForm));
            if (createRoute.fulfilled.match(result)) {
                alert("Route created successfully!");
                setRouteForm({
                    pickup: "",
                    dropoff: "",
                    routeDate: "",
                    routeTime: "",
                    driverId: "",
                    busId: "",
                });
                setSelectedDriverName("");
                if (onBack) onBack();
            } else {
                alert(result.payload || "Failed to create route");
            }
        } catch (err) {
            console.error("Error creating route from UI:", err);
            alert("Failed to create route");
        }
    };

    // Load schools for dropdown on mount
    useEffect(() => {
        dispatch(fetchSchoolManagementSummary());
    }, [dispatch]);

    // Scroll to selected item when dropdown opens
    useEffect(() => {
        if (menuRef.current && selectedItemRef.current) {
            const menu = menuRef.current;
            const item = selectedItemRef.current;
            // Scroll the menu so the selected item is in view
            menu.scrollTop = item.offsetTop - menu.offsetTop;
        }
    }, [selectedTime]);

    return (
        <section className='w-full h-full'>
         <Typography
  fontWeight={700}
  className="text-[#202224] font-[Nunito Sans] font-bold py-3 ps-2 text-[32px] flex items-center gap-2"
  marginInline={1}
>
  <FaArrowLeft
        className="cursor-pointer"
        onClick={handleBackTrip} // yaha form band ho jayega
      />
  {editRoute ? "Edit Route" : isEditable ? "Edit Trip" : "Create Route"}
</Typography>
            {
                isEditable ?
                    <div className="w-full p-4 bg-white h-[155vh] rounded-[4px] border shadow-sm">
                        <form className="grid grid-cols-2 gap-x-6 gap-y-4 py-16 ps-5 w-[50%]">
                            {/* Pickup field */}
                            
                             <div className="col-span-1">
                                    <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                        Select Cueernt Trip
                                    </Typography>
                                    <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                        <select
                                            className="bg-[#F5F6FA] outline-none w-full"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="trip1">Motorcoach (56 Passenger)</option>
                                            <option value="trip2">Motorcoach (47 Passenger)</option>
                                            <option value="trip3">Motorcoach (22 Passenger)</option>
                                             <option value="trip3">School Bus (50 Passenger 2/seat)</option>
                                             <option value="trip3">School Bus (15-29 Passenger 3/seat)</option>
                                            {/* Add more options as needed */}
                                        </select>
                                        
                                    </div>
                                </div>

                                <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Company/Group Name
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Name"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                    />
                                  
                                </div>
                            </div>

                             <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Phone Number
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="number"
                                        placeholder="Enter Number"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                    />
                                  
                                </div>
                            </div>

                             <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Email Address
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="email"
                                        placeholder="Enter Email"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                    />
                                  
                                </div>
                            </div>

                             <div className="col-span-1">
                                    <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                        Round Trip
                                    </Typography>
                                    <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                        <select
                                            className="bg-[#F5F6FA] outline-none w-full"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select </option>
                                            <option value="trip1">One Way</option>
                                            <option value="trip2">Shuttle</option>
                                           
                                            {/* Add more options as needed */}
                                        </select>
                                        
                                    </div>
                                </div>

                                  <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Number Of Passengers
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Location"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                    />
                                  
                                </div>
                            </div>

                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Is Wheelchair Lift Required
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Location"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                    />
                                  
                                </div>
                            </div>

                             <div className="col-span-1">
                                    <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                        Bus Type
                                    </Typography>
                                    <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                        <select
                                            className="bg-[#F5F6FA] outline-none w-full"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="trip1">a. Motorcoach (56 Passenger)</option>
                                            <option value="trip2">b. Motorcoach (47 Passenger)</option>
                                            <option value="trip3">c. Motorcoach (22 Passenger)</option>
                                             <option value="trip3">d. School Bus (50 Passenger 2/seat)</option>
                                             <option value="trip3">e. School Bus (15-29 Passenger 3/seat)</option>
                                              <option value="trip3">f. Mini Van (4 Passengers)</option>
                                            {/* Add more options as needed */}
                                        </select>
                                        
                                    </div>
                                </div>
                            
                            {/* <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Pickup
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter pickup location"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                    />
                                    <div className="flex flex-row gap-3 items-center">
                                        {!isEditable && <img src={addIcon} alt="add" className="h-4 w-4" />}
                                        <img src={locationicon} alt="location" className="h-5 w-5" />
                                    </div>
                                </div>
                            </div> */}

                            {/* Dropoff field */}
                            {/* <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Dropoff
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                                    <input
                                        type="text"
                                        placeholder="Enter drop location"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                    />
                                    <div className="flex flex-row gap-3 items-center">
                                        {!isEditable && <img src={addIcon} alt="add" className="h-4 w-4" />}
                                        <img src={locationicon} alt="location" className="h-5 w-5" />
                                    </div>
                                </div>
                            </div> */}

                            {/* Date and Time fields */}
                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Pickup Date
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        ref={pickupDateRef}
                                        type="date"
                                        placeholder="Select date"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none w-full"
                                    />
                                    <img
                                        src={calendericonred}
                                        alt="calendar"
                                        className="h-5 w-5 cursor-pointer"
                                        onClick={() => {
                                            if (pickupDateRef.current?.showPicker) {
                                                pickupDateRef.current.showPicker();
                                            } else {
                                                pickupDateRef.current?.focus();
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                             <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Pickup Time
                                </Typography>
                                <Menu>
                                    <MenuHandler>
                                        <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between cursor-pointer">
                                            <input
                                                value={selectedTime}
                                                placeholder="Select time"
                                                className="bg-[#F5F6FA] rounded-[6px] outline-none w-full cursor-pointer"
                                                readOnly
                                            />
                                        </div>
                                    </MenuHandler>

                                    <MenuList className="max-h-60 overflow-auto" ref={menuRef}>
                                        {timeSlots.map((slot) => (
                                            <MenuItem
                                                key={slot}
                                                onClick={() => setSelectedTime(slot)}
                                                ref={slot === selectedTime ? selectedItemRef : null}
                                                className={slot === selectedTime ? "bg-blue-100 font-semibold" : ""}
                                            >
                                                {slot}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            </div>

                             <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Return Date
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="date"
                                        placeholder="Select date"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none w-full"
                                    />
                                    {/* <img src={calendericonred} alt="calendar" className="h-5 w-5" /> */}
                                </div>
                            </div>


                             <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Return Time
                                </Typography>
                                <Menu>
                                    <MenuHandler>
                                        <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between cursor-pointer">
                                            <input
                                                value={selectedTime}
                                                placeholder="Select time"
                                                className="bg-[#F5F6FA] rounded-[6px] outline-none w-full cursor-pointer"
                                                readOnly
                                            />
                                        </div>
                                    </MenuHandler>

                                    <MenuList className="max-h-60 overflow-auto" ref={menuRef}>
                                        {timeSlots.map((slot) => (
                                            <MenuItem
                                                key={slot}
                                                onClick={() => setSelectedTime(slot)}
                                                ref={slot === selectedTime ? selectedItemRef : null}
                                                className={slot === selectedTime ? "bg-blue-100 font-semibold" : ""}
                                            >
                                                {slot}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            </div>


                            {/* Number of Persons field */}
                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                Type Of Group
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Instruction"
                                        className="bg-[#F5F6FA] rounded-[6px] w-full outline-none"
                                    />
                                </div>
                            </div>

                            {/* Driver field */}
                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Pickup Location
                                </Typography>
                                <Menu>
                                    <MenuHandler>
                                        <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                            <input
                                                type="text"
                                                placeholder="Enter Location"
                                                className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                                readOnly
                                            />
                                            <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-2" />
                                        </div>
                                    </MenuHandler>
                                    <MenuList>
                                        {drivers.map((driver) => (
                                            <MenuItem key={driver}>{driver}</MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            </div>

                            {/* Bus No field */}
                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                Name
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Name"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                 Pickup Address
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Address"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                 Pickup City
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter City"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                 Pickup State
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter State"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                 Pickup Zip
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Zip"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                  Add Additional Destinations
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Destination"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                  Destination Location
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Destination Location"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>

                             <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                  Destination Address
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Destination Address"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>

                             <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                  Destination City
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Destination City"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                  Destination State
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Destination State"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                  Destination Zip
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter Destination Zip"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1">
                                    <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                      How Were You Referred To Us?
                                    </Typography>
                                    <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                        <select
                                            className="bg-[#F5F6FA] outline-none w-full"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="trip1">Google</option>
                                            <option value="trip2">Facebook</option>
                                            <option value="trip3">Linkedin</option>
                                             <option value="trip3">Youtube</option>
                                            
                                            {/* Add more options as needed */}
                                        </select>
                                        
                                    </div>
                                </div>



                            {/* Buttons */}
                            <div className="col-span-2 flex mt-20 space-x-4">
                                <Button
                                    className="border border-[#C01824] bg-white text-[#C01824] px-12 py-4 rounded-[4px]"
                                    variant="outlined"
                                    onClick={handleBackTrip}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-[#C01824] text-white px-12 py-2 rounded-[4px]"
                                    variant="filled"
                                    type="submit"
                                    onClick={handleBackTrip}
                                >
                                    Update
                                </Button>
                            </div>
                        </form>
                    </div>
                    :
                    <div className="w-full p-4 bg-white rounded-[4px] border shadow-sm h-[75vh] flex flex-row gap-20">
                        <div className="flex flex-col space-y-4 w-[46%] ps-3">
                            <div className="flex flex-col">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Pickup
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        name="pickup"
                                        value={routeForm.pickup}
                                        placeholder="Enter pickup location"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                        onClick={handleFieldClick}
                                        onChange={handleRouteFieldChange}
                                    />
                                    <img src={locationicon} alt="not found" className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Drop Off
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between relative">
                                    <input
                                        type="text"
                                        name="dropoff"
                                        value={routeForm.dropoff}
                                        placeholder="Enter drop location"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                        onChange={handleRouteFieldChange}
                                    />
                                    <img src={locationicon} alt="not found" className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Date
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        ref={routeDateRef}
                                        type="date"
                                        name="routeDate"
                                        value={routeForm.routeDate}
                                        placeholder="Select date"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none w-full custom-date-input"
                                        onChange={handleRouteFieldChange}
                                    />
                                    <img
                                        src={calendericonred}
                                        alt="not found"
                                        className="h-5 w-5 cursor-pointer"
                                        onClick={() => {
                                            if (routeDateRef.current?.showPicker) {
                                                routeDateRef.current.showPicker();
                                            } else {
                                                routeDateRef.current?.focus();
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            {/* {editRoute && ( */}
                                <div className="flex flex-col">
                                    <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                        Time
                                    </Typography>
                                    <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                        <input
                                            type="time"
                                            name="routeTime"
                                            value={routeForm.routeTime}
                                            placeholder="Select time"
                                            className="bg-[#F5F6FA] rounded-[6px] outline-none w-full"
                                            onChange={handleRouteFieldChange}
                                        />
                                        {/* <img src={calendericonred} alt="not found" className="h-5 w-5" /> */}
                                    </div>
                                </div>
                            {/* )} */}
                            <div className="flex flex-col">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Driver
                                </Typography>
                                <Menu>
                                    <MenuHandler>
                                        <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                            <input
                                                type="text"
                                                value={selectedDriverName}
                                                placeholder="Select driver"
                                                className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1 cursor-pointer"
                                                readOnly
                                            />
                                            <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-2" />
                                        </div>
                                    </MenuHandler>
                                    <MenuList>
                                        {drivers.map((driver) => (
                                            <MenuItem key={driver} onClick={() => handleSelectDriver(driver)}>
                                                {driver}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            </div>
                            <div className="flex flex-col">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Bus No
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="number"
                                        name="busId"
                                        value={routeForm.busId}
                                        placeholder="Enter bus id"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                        onChange={handleRouteFieldChange}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row space-x-4 mt-4">
                                <Button className="mt-8 px-12 py-4 border border-[#C01824] bg-[#fff] text-[#C01824] text-[14px] capitalize rounded-[6px]" variant='filled' size='lg' onClick={onBack}>
                                    Cancel
                                </Button>
                                <Button
                                    className={`mt-8 px-12 py-4 text-[#fff] text-[14px] capitalize rounded-[6px] disabled:opacity-50 disabled:cursor-not-allowed ${isFormValid ? "bg-[#C01824]" : "bg-[#B8B9BC]"}`}
                                    variant='filled'
                                    size='lg'
                                    onClick={handleSubmitRoute}
                                    disabled={creating || !isFormValid}
                                >
                                    {creating ? "Submitting..." : "Submit"}
                                </Button>
                            </div>

                        </div>
                        {showSeats ? (
                            <div className="flex flex-col w-[100%]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-xl font-bold">Select Students</div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-[#2C2F32]">Drop-off School:</span>
                                        <select
                                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                                            value={selectedSchoolId}
                                            onChange={handleSelectSchool}
                                        >
                                            <option value="">Select School</option>
                                            {schoolManagementSummary && schoolManagementSummary.length > 0 ? (
                                                // unique schools by InstituteId
                                                [...new Map(
                                                    schoolManagementSummary
                                                        .filter(item => item.InstituteId)
                                                        .map(item => {
                                                            const rawId = Array.isArray(item.InstituteId)
                                                                ? item.InstituteId[0]
                                                                : typeof item.InstituteId === "string"
                                                                    ? Number(item.InstituteId.split(",")[0])
                                                                    : item.InstituteId;
                                                            return [Number(rawId), {
                                                                id: Number(rawId),
                                                                name: item.InstituteName || `School ${rawId}`,
                                                            }];
                                                        })
                                                ).values()].map((school) => (
                                                    <option key={school.id} value={school.id}>
                                                        {school.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No schools found</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                {studentsLoading?.fetching ? (
                                    <div className="flex flex-col items-center justify-center h-full py-8">
                                        <Spinner className="h-8 w-8 text-[#C01824]" />
                                        <p className="mt-3 text-sm text-gray-500">Loading students...</p>
                                    </div>
                                ) : !selectedSchoolId ? (
                                    <div className="text-sm text-gray-600">
                                        Please select a drop-off school to load students.
                                    </div>
                                ) : students && students.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-4">
                                        {students.map((stu, index) => (
                                            <div key={stu.StudentId || index} className="flex items-center space-x-2 p-2 w-[75%] h-[6vh] border border-gray-300 rounded-lg">
                                                <img
                                                    src={studentfive}
                                                    className="h-10 w-10 rounded-full"
                                                    alt={stu.StudentName || "Student"}
                                                />
                                                <span className="text-sm">
                                                    {stu.StudentName || "Unnamed Student"}
                                                </span>
                                                <input type="checkbox" className="form-checkbox custom-checkbox2" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-600">
                                        No students found for the selected school.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col w-[100%]">
                                <div className="text-xl font-bold mb-4">Select Students {editRoute ? "(0 seats)" : "(10 seats)"}</div>
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Please first enter Pickup and Dropoff location to show the student records.
                                </Typography>
                            </div>
                        )}
                    </div>
            }
        </section >
    );
};

export default StudentSeatSelection;
