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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createRoute } from "@/redux/slices/routesSlice";
import { fetchSchoolManagementSummary } from "@/redux/slices/schoolSlice";
import { fetchStudentsByInstitute } from "@/redux/slices/studentSlice";
import { fetchBuses, fetchDrivers } from "@/redux/slices/busesSlice";
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { routeService } from "@/services/routeService";
import { toast } from "react-hot-toast";

/**
 * @type {import('./CreateRoute').default}
 */
const StudentSeatSelection = ({ onBack, editRoute, isEditable, handleBackTrip }) => {
    const dispatch = useAppDispatch();
    const { creating } = useAppSelector((state) => state.routes);
    const { schoolManagementSummary } = useAppSelector((state) => state.schools);
    const { students, loading: studentsLoading } = useAppSelector((state) => state.students);
    const {
        drivers: realDrivers,
        buses: realBuses,
        loading: { drivers: driversLoading, buses: busesLoading }
    } = useAppSelector((state) => state.buses);

    const GOOGLE_LIBRARIES = ["places"];
    // 🔐 Load Google Maps API for Autocomplete
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries: GOOGLE_LIBRARIES
    });

    const [autocompletePickup, setAutocompletePickup] = useState(null);
    const [autocompleteDropoff, setAutocompleteDropoff] = useState(null);

    const onPickupLoad = (autocomplete) => setAutocompletePickup(autocomplete);
    const onDropoffLoad = (autocomplete) => setAutocompleteDropoff(autocomplete);

    const onPickupPlaceChanged = () => {
        if (autocompletePickup !== null) {
            const place = autocompletePickup.getPlace();
            const lat = place.geometry?.location?.lat();
            const lng = place.geometry?.location?.lng();
            setRouteForm(prev => ({
                ...prev,
                pickup: place.formatted_address || place.name
            }));
            if (lat && lng) {
                setPickupCoords({ lat, lng });
            }
        }
    };

    const onDropoffPlaceChanged = () => {
        if (autocompleteDropoff !== null) {
            const place = autocompleteDropoff.getPlace();
            const lat = place.geometry?.location?.lat();
            const lng = place.geometry?.location?.lng();
            setRouteForm(prev => ({
                ...prev,
                dropoff: place.formatted_address || place.name
            }));
            if (lat && lng) {
                setDropoffCoords({ lat, lng });
            }
        }
    };

    // Students are loaded by Drop-off School (instituteId), not pickup/dropoff.
    // Keep panel visible; do not couple to pickup/dropoff fields.
    const [showSeats] = useState(true);

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

    // Local form state matched to SP parameters
    const [routeForm, setRouteForm] = useState({
        routeName: "",
        routeNumber: "",
        pickup: "",
        dropoff: "",
        routeDate: "",
        routeTime: "",
        driverId: "",
        busId: "",
    });
    const [selectedStudents, setSelectedStudents] = useState([]); // Array of IDs
    const [selectedDriverName, setSelectedDriverName] = useState("");
    const [selectedBusName, setSelectedBusName] = useState("");
    const [selectedSchoolId, setSelectedSchoolId] = useState("");
    
    // Smart matching state
    const [smartMatching, setSmartMatching] = useState({
        loading: false,
        matchedStudents: [],
        showMatched: false,
    });
    const [pickupCoords, setPickupCoords] = useState({ lat: null, lng: null });
    const [dropoffCoords, setDropoffCoords] = useState({ lat: null, lng: null });

    const handleRouteFieldChange = (e) => {
        const { name, value } = e.target;
        setRouteForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const normalizedDrivers = React.useMemo(() => {
        if (!Array.isArray(realDrivers)) return [];
        return realDrivers
            .map((driver) => {
                const id =
                    driver?.DriverId ??
                    driver?.EmployeeId ??
                    driver?.EmpId ??
                    driver?.id ??
                    driver?.ID;
                const name =
                    driver?.DriverName ??
                    driver?.Name ??
                    driver?.name ??
                    driver?.EmployeeName ??
                    "";
                return {
                    ...driver,
                    __id: id != null ? Number(id) : null,
                    __name: String(name || "").trim(),
                };
            })
            .filter((driver) => Number.isFinite(driver.__id) && driver.__name);
    }, [realDrivers]);

    const handleSelectDriver = (driver) => {
        const id = driver?.__id ?? driver?.EmployeeId ?? driver?.EmpId;
        setRouteForm((prev) => ({
            ...prev,
            driverId: id ? parseInt(id, 10) : null,
            busId: "", // reset bus when driver changes
        }));
        setSelectedDriverName(driver?.__name || driver?.Name || "");
        setSelectedBusName(""); // clear bus name so user picks from driver's buses only
    };

    const handleSelectBus = (bus) => {
        console.log("🚌 Bus Selected Object:", bus); // 👈 Debugging click
        const id = bus.BusId || bus.id || bus.VehicleId || bus.VehicleID;
        
        if (id) {
            setRouteForm((prev) => ({
                ...prev,
                busId: parseInt(id, 10),
            }));
            setSelectedBusName(bus.VehicleName || bus.name || `Bus ${id}`);
        } else {
            console.error("❌ Selected bus has no ID field!", bus);
            alert("This bus record is missing an ID. Please check Vehicle Management.");
        }
    };

    const handleSelectSchool = (e) => {
        const id = e.target.value;
        setSelectedSchoolId(id);
        if (id) {
            dispatch(fetchStudentsByInstitute(Number(id)));
        }
    };

    const handleStudentToggle = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    // Smart matching function - Find students by location
    const handleSmartMatch = async () => {
        if (!selectedSchoolId) {
            toast.error("Please select a school first");
            return;
        }

        if (!routeForm.pickup || !routeForm.dropoff) {
            toast.error("Please enter both pickup and dropoff locations");
            return;
        }

        setSmartMatching(prev => ({ ...prev, loading: true, showMatched: false }));

        try {
            // Normalize addresses (trim, lowercase for better matching)
            const normalizedPickup = routeForm.pickup.trim();
            const normalizedDropoff = routeForm.dropoff.trim();
            
            console.log("🔍 [Smart Match] Starting search...", {
                instituteId: selectedSchoolId,
                pickup: normalizedPickup,
                dropoff: normalizedDropoff,
                hasPickupCoords: !!(pickupCoords.lat && pickupCoords.lng),
                hasDropoffCoords: !!(dropoffCoords.lat && dropoffCoords.lng)
            });

            // Try address matching FIRST (better for exact address matches like "N Knox Avenue street 42")
            // Note: For address matching, use radiusMeters (not radiusKm)
            // Default 50m is too small, using 5000m (5km) for better results
            let payload = {
                instituteId: Number(selectedSchoolId),
                pickupLocation: normalizedPickup,
                dropoffLocation: normalizedDropoff,
                radiusMeters: 5000, // 5km radius for address matching (max 5000m per API docs)
                maxResults: 100,
                matchType: "address", // Start with address matching for exact matches
            };

            // Add coordinates if available (for better matching)
            if (pickupCoords.lat && pickupCoords.lng) {
                payload.pickupLatitude = pickupCoords.lat;
                payload.pickupLongitude = pickupCoords.lng;
            }
            if (dropoffCoords.lat && dropoffCoords.lng) {
                payload.dropoffLatitude = dropoffCoords.lat;
                payload.dropoffLongitude = dropoffCoords.lng;
            }

            // If coordinates available, also try coordinate matching as fallback
            const hasCoordinates = pickupCoords.lat && pickupCoords.lng;
            
            console.log("📍 [Smart Match] Strategy:", {
                primary: "address matching (for exact address match)",
                fallback: hasCoordinates ? "coordinate matching" : "none",
                pickupAddress: normalizedPickup,
                dropoffAddress: normalizedDropoff
            });

            console.log("🔍 [Smart Match] Request payload:", payload);
            console.log("🔍 [Smart Match] All students in Redux for institute 31:", students);
            console.log("🔍 [Smart Match] Checking if student addresses match...");
            
            // Debug: Check students in current institute
            if (students && students.length > 0) {
                console.log("📋 [Smart Match] Students in selected institute:", students.map(s => ({
                    id: s.StudentId || s.studentId,
                    name: s.StudentName || s.firstName,
                    address: s.Address || s.address || s.PickupLocation || s.pickupLocation,
                    pickupLocation: s.PickupLocation || s.pickupLocation || s.PickUp_Location,
                    instituteId: s.InstituteId || s.instituteId
                })));
            }

            const response = await routeService.findStudentsByLocation(payload);

            console.log("✅ [Smart Match] Response received:", response);
            console.log("📊 [Smart Match] Response details:", {
                ok: response.ok,
                totalMatched: response.data?.totalMatched,
                totalSearched: response.data?.totalSearched,
                matchedCount: response.data?.matchedStudents?.length,
                matchType: response.data?.matchType
            });
            
            // Debug: Log first matched student structure
            if (response.data?.matchedStudents && response.data.matchedStudents.length > 0) {
                console.log("🔍 [Smart Match] First matched student structure:", response.data.matchedStudents[0]);
                console.log("🔍 [Smart Match] All student fields:", Object.keys(response.data.matchedStudents[0]));
            }

            if (response.ok && response.data?.matchedStudents && response.data.matchedStudents.length > 0) {
                console.log("✅ [Smart Match] Processing matched students:", response.data.matchedStudents);
                
                // Automatically select all matched students
                // Handle different ID field names
                const matchedIds = response.data.matchedStudents.map(s => 
                    s.studentId || s.StudentId || s.id
                ).filter(id => id);
                
                console.log("✅ [Smart Match] Extracted student IDs:", matchedIds);
                
                setSelectedStudents(prev => {
                    const newIds = matchedIds.filter(id => !prev.includes(id));
                    console.log("✅ [Smart Match] Adding new student IDs:", newIds);
                    return [...prev, ...newIds];
                });
                
                setSmartMatching({
                    loading: false,
                    matchedStudents: response.data.matchedStudents,
                    showMatched: true,
                });
                toast.success(`Found and selected ${response.data.totalMatched} students!`);
            } else {
                // If address matching failed and coordinates available, try coordinate matching
                if (hasCoordinates && (!response.ok || !response.data?.matchedStudents?.length)) {
                    console.log("⚠️ [Smart Match] Address matching found 0, trying coordinate matching...");
                    
                    const coordinatePayload = {
                        instituteId: Number(selectedSchoolId),
                        pickupLocation: normalizedPickup,
                        dropoffLocation: normalizedDropoff,
                        pickupLatitude: pickupCoords.lat,
                        pickupLongitude: pickupCoords.lng,
                        dropoffLatitude: dropoffCoords.lat,
                        dropoffLongitude: dropoffCoords.lng,
                        radiusKm: 10, // For coordinate matching, use radiusKm
                        maxResults: 100,
                        matchType: "coordinate",
                    };

                    console.log("🔍 [Smart Match] Retry with coordinate matching:", coordinatePayload);
                    
                    const coordinateResponse = await routeService.findStudentsByLocation(coordinatePayload);
                    console.log("✅ [Smart Match] Coordinate matching response:", coordinateResponse);

                    if (coordinateResponse.ok && coordinateResponse.data?.matchedStudents && coordinateResponse.data.matchedStudents.length > 0) {
                        console.log("✅ [Smart Match] Processing coordinate matched students:", coordinateResponse.data.matchedStudents);
                        
                        // Automatically select all matched students
                        // Handle different ID field names
                        const matchedIds = coordinateResponse.data.matchedStudents.map(s => 
                            s.studentId || s.StudentId || s.id
                        ).filter(id => id);
                        
                        console.log("✅ [Smart Match] Extracted student IDs from coordinate match:", matchedIds);
                        
                        setSelectedStudents(prev => {
                            const newIds = matchedIds.filter(id => !prev.includes(id));
                            return [...prev, ...newIds];
                        });
                        
                        setSmartMatching({
                            loading: false,
                            matchedStudents: coordinateResponse.data.matchedStudents,
                            showMatched: true,
                        });
                        toast.success(`Found and selected ${coordinateResponse.data.totalMatched} students using coordinate matching!`);
                    } else {
                        setSmartMatching(prev => ({ ...prev, loading: false }));
                        const totalSearched = coordinateResponse.data?.totalSearched || response.data?.totalSearched || 0;
                        toast.error(`No students found. Searched ${totalSearched} students. Check: 1) Address format matches exactly 2) Student belongs to selected school 3) Student has address in database.`);
                        console.error("❌ [Smart Match] No students found. Debug info:", {
                            searched: totalSearched,
                            pickupAddress: normalizedPickup,
                            dropoffAddress: normalizedDropoff,
                            instituteId: selectedSchoolId
                        });
                    }
                } else {
                    setSmartMatching(prev => ({ ...prev, loading: false }));
                    const totalSearched = response.data?.totalSearched || 0;
                    toast.error(`No students found. Searched ${totalSearched} students. Check: 1) Address "N Knox Avenue street 42" matches exactly in database 2) Student belongs to selected school.`);
                    console.error("❌ [Smart Match] No students found. Debug info:", {
                        searched: totalSearched,
                        pickupAddress: normalizedPickup,
                        dropoffAddress: normalizedDropoff,
                        instituteId: selectedSchoolId,
                        matchType: payload.matchType
                    });
                }
            }
        } catch (error) {
            console.error("❌ [Smart Match] Error:", error);
            console.error("❌ [Smart Match] Error details:", {
                message: error.response?.data?.message,
                status: error.response?.status,
                data: error.response?.data
            });
            setSmartMatching(prev => ({ ...prev, loading: false }));
            toast.error(error.response?.data?.message || "Failed to find students. Please check console for details.");
        }
    };

    // Select all matched students
    const handleSelectAllMatched = () => {
        const matchedIds = smartMatching.matchedStudents.map(s => s.studentId);
        setSelectedStudents(prev => {
            const newIds = matchedIds.filter(id => !prev.includes(id));
            return [...prev, ...newIds];
        });
        toast.success(`Added ${matchedIds.length} students to selection`);
    };

            const isFormValid = Boolean(
                routeForm.routeName && 
                routeForm.routeNumber && 
                routeForm.pickup && 
                routeForm.dropoff && 
                routeForm.routeDate && 
                routeForm.routeTime && 
                routeForm.driverId && 
                routeForm.busId && 
                selectedSchoolId &&
                selectedStudents.length > 0
            );

            // Debugging for you to see in Console why button is disabled
            useEffect(() => {
                if (!isFormValid) {
                    console.log("🛠️ Form Validation Details:", {
                        routeName: routeForm.routeName || "MISSING",
                        routeNumber: routeForm.routeNumber || "MISSING",
                        pickup: routeForm.pickup || "MISSING",
                        dropoff: routeForm.dropoff || "MISSING",
                        routeDate: routeForm.routeDate || "MISSING",
                        routeTime: routeForm.routeTime || "MISSING",
                        driverId: routeForm.driverId || "MISSING (Select from dropdown)",
                        busId: routeForm.busId || "MISSING (Select from dropdown)",
                        studentsSelectedCount: selectedStudents.length
                    });
                }
            }, [routeForm, selectedStudents, isFormValid]);

    const handleSubmitRoute = async () => {
        if (!isFormValid) {
            alert("Please fill all required fields and select at least one student.");
            return;
        }

        const payload = {
            instituteId: Number(selectedSchoolId),
            routeNumber: routeForm.routeNumber,
            routeName: routeForm.routeName,
            pickup: routeForm.pickup,
            dropoff: routeForm.dropoff,
            routeDate: routeForm.routeDate,
            routeTime: routeForm.routeTime,
            driverId: Number(routeForm.driverId),
            busId: Number(routeForm.busId),
            studentIds: selectedStudents.join(','),
            pickupLat: pickupCoords?.lat != null ? Number(pickupCoords.lat) : null,
            pickupLng: pickupCoords?.lng != null ? Number(pickupCoords.lng) : null,
            dropoffLat: dropoffCoords?.lat != null ? Number(dropoffCoords.lat) : null,
            dropoffLng: dropoffCoords?.lng != null ? Number(dropoffCoords.lng) : null,
        };

        try {
            const result = await dispatch(createRoute(payload));
            if (createRoute.fulfilled.match(result)) {
                alert("Route created successfully!");
                // Clear state
                setSelectedStudents([]);
                if (onBack) onBack();
            } else {
                alert(result.payload || "Failed to create route");
            }
        } catch (err) {
            console.error("Error creating route from UI:", err);
            alert("Failed to create route");
        }
    };

    // Buses filtered by selected driver (sirf us driver ki buses jo assign hain)
    const busesForSelectedDriver = React.useMemo(() => {
        if (!realBuses || realBuses.length === 0) return [];
        const driverId = routeForm.driverId ? Number(routeForm.driverId) : null;
        if (!driverId) return [];
        return realBuses.filter((bus) => {
            const busDriverId = bus.DriverId ?? bus.driverId ?? bus.AssignedDriverId ?? bus.assignedDriverId;
            if (busDriverId == null) return false;
            return Number(busDriverId) === driverId;
        });
    }, [realBuses, routeForm.driverId]);

    // Load schools, drivers and buses for dropdown on mount
    useEffect(() => {
        dispatch(fetchSchoolManagementSummary());
        dispatch(fetchDrivers());
        dispatch(fetchBuses());
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
                                    Route Name
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        name="routeName"
                                        value={routeForm.routeName}
                                        placeholder="Enter Route Name (e.g. Morning Shift)"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                        onChange={handleRouteFieldChange}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Route Number
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        name="routeNumber"
                                        value={routeForm.routeNumber}
                                        placeholder="Enter Route Number (e.g. RT-001)"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                        onChange={handleRouteFieldChange}
                                    />
                                </div>
                            </div>
                                    <div className="flex flex-col">
                                        <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                            Pickup
                                        </Typography>
                                        <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                            {isLoaded ? (
                                                <Autocomplete
                                                    onLoad={onPickupLoad}
                                                    onPlaceChanged={onPickupPlaceChanged}
                                                    className="w-full"
                                                >
                                                    <input
                                                        type="text"
                                                        name="pickup"
                                                        value={routeForm.pickup}
                                                        placeholder="Enter pickup location"
                                                        className="bg-[#F5F6FA] outline-none w-full"
                                                        onChange={handleRouteFieldChange}
                                                    />
                                                </Autocomplete>
                                            ) : (
                                                <input
                                                    type="text"
                                                    name="pickup"
                                                    value={routeForm.pickup}
                                                    placeholder="Loading address search..."
                                                    className="bg-[#F5F6FA] outline-none w-full"
                                                    disabled
                                                />
                                            )}
                                            <img src={locationicon} alt="not found" className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                            Drop Off
                                        </Typography>
                                        <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between relative">
                                            {isLoaded ? (
                                                <Autocomplete
                                                    onLoad={onDropoffLoad}
                                                    onPlaceChanged={onDropoffPlaceChanged}
                                                    className="w-full"
                                                >
                                                    <input
                                                        type="text"
                                                        name="dropoff"
                                                        value={routeForm.dropoff}
                                                        placeholder="Enter drop location"
                                                        className="bg-[#F5F6FA] outline-none w-full"
                                                        onChange={handleRouteFieldChange}
                                                    />
                                                </Autocomplete>
                                            ) : (
                                                <input
                                                    type="text"
                                                    name="dropoff"
                                                    value={routeForm.dropoff}
                                                    placeholder="Loading address search..."
                                                    className="bg-[#F5F6FA] outline-none w-full"
                                                    disabled
                                                />
                                            )}
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
                                            <MenuList className="max-h-72 overflow-y-auto">
                                                {driversLoading ? (
                                                    <MenuItem disabled className="flex items-center justify-center">
                                                        <Spinner className="h-4 w-4" />
                                                        <span className="ml-2">Loading drivers...</span>
                                                    </MenuItem>
                                                ) : normalizedDrivers.length > 0 ? (
                                                    normalizedDrivers.map((driver) => (
                                                        <MenuItem key={driver.__id} onClick={() => handleSelectDriver(driver)}>
                                                            {driver.__name}
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem disabled>No drivers found</MenuItem>
                                                )}
                                            </MenuList>
                                </Menu>
                            </div>
                                    <div className="flex flex-col">
                                        <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                            Bus No
                                        </Typography>
                                        <Menu>
                                            <MenuHandler>
                                                <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between cursor-pointer">
                                                    <input
                                                        type="text"
                                                        value={selectedBusName}
                                                        placeholder="Select bus"
                                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1 cursor-pointer"
                                                        readOnly
                                                    />
                                                    <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-2" />
                                                </div>
                                            </MenuHandler>
                                            <MenuList className="max-h-72 overflow-y-auto">
                                                {busesLoading?.buses ? (
                                                    <MenuItem disabled className="flex items-center justify-center">
                                                        <Spinner className="h-4 w-4" />
                                                        <span className="ml-2">Loading buses...</span>
                                                    </MenuItem>
                                                ) : !routeForm.driverId ? (
                                                    <MenuItem disabled className="text-gray-500 italic">
                                                        Select a driver first
                                                    </MenuItem>
                                                ) : busesForSelectedDriver.length > 0 ? (
                                                    busesForSelectedDriver.map((bus) => (
                                                        <MenuItem key={bus.BusId || bus.id} onClick={() => handleSelectBus(bus)}>
                                                            {bus.VehicleName || bus.NumberPlate || `Bus ${bus.BusId || bus.id}`}
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem disabled className="text-red-500 font-bold italic">
                                                        No buses assigned to this driver. Assign in Vehicle Management.
                                                    </MenuItem>
                                                )}
                                            </MenuList>
                                        </Menu>
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
                        {showSeats && (
                            <div className="flex flex-col w-[100%]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-xl font-bold">Select Students</div>
                                    <div className="flex items-center gap-2">
                                        {/* Smart Match Button */}
                                        {routeForm.pickup && routeForm.dropoff && selectedSchoolId && (
                                            <Button
                                                className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 text-sm capitalize rounded-[6px]"
                                                onClick={handleSmartMatch}
                                                disabled={smartMatching.loading}
                                            >
                                                {smartMatching.loading ? (
                                                    <>
                                                        <Spinner className="h-4 w-4 inline mr-2" />
                                                        Finding...
                                                    </>
                                                ) : (
                                                    "🔍 Smart Match"
                                                )}
                                            </Button>
                                        )}
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

                                {/* Smart Matched Students Section */}
                                {smartMatching.showMatched && smartMatching.matchedStudents.length > 0 && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <Typography className="text-lg font-bold text-green-800">
                                                    🎯 Smart Matched Students ({smartMatching.matchedStudents.length})
                                                </Typography>
                                                <Typography className="text-sm text-green-600">
                                                    Found within 5km radius of your route
                                                </Typography>
                                            </div>
                                            <Button
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs capitalize rounded"
                                                onClick={handleSelectAllMatched}
                                            >
                                                Select All
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                                            {smartMatching.matchedStudents.map((stu, index) => {
                                                // Handle different response formats from backend
                                                const studentId = stu.studentId || stu.StudentId || stu.id || stu.ID;
                                                
                                                // Try multiple name field combinations
                                                let studentName = null;
                                                
                                                // Direct name fields
                                                if (stu.studentName) studentName = stu.studentName;
                                                else if (stu.StudentName) studentName = stu.StudentName;
                                                else if (stu.name) studentName = stu.name;
                                                else if (stu.Name) studentName = stu.Name;
                                                else if (stu.fullName) studentName = stu.fullName;
                                                else if (stu.FullName) studentName = stu.FullName;
                                                
                                                // FirstName + LastName combination
                                                if (!studentName) {
                                                    const firstName = stu.firstName || stu.FirstName || stu.first_name || stu.First_Name || '';
                                                    const lastName = stu.lastName || stu.LastName || stu.last_name || stu.Last_Name || '';
                                                    if (firstName || lastName) {
                                                        studentName = `${firstName} ${lastName}`.trim();
                                                    }
                                                }
                                                
                                                // Fallback: Check all string fields that might be name
                                                if (!studentName) {
                                                    for (const key in stu) {
                                                        if (typeof stu[key] === 'string' && 
                                                            (key.toLowerCase().includes('name') || 
                                                             key.toLowerCase().includes('student'))) {
                                                            studentName = stu[key];
                                                            break;
                                                        }
                                                    }
                                                }
                                                
                                                // Final fallback
                                                if (!studentName) {
                                                    studentName = `Student ${studentId || index + 1}`;
                                                }
                                                
                                                console.log("🔍 [Smart Match] Rendering student:", {
                                                    studentId,
                                                    studentName,
                                                    firstName: stu.firstName || stu.FirstName,
                                                    lastName: stu.lastName || stu.LastName,
                                                    allKeys: Object.keys(stu),
                                                    rawData: stu
                                                });
                                                
                                                return (
                                                    <div key={studentId || index} className="flex items-center space-x-2 p-2 w-[75%] h-[6vh] border border-green-300 rounded-lg bg-white">
                                                        <img
                                                            src={studentfive}
                                                            className="h-10 w-10 rounded-full"
                                                            alt={studentName}
                                                        />
                                                        <div className="flex flex-col flex-1">
                                                            <span className="text-sm font-semibold">
                                                                {studentName}
                                                            </span>
                                                            {stu.distanceKm !== undefined && (
                                                                <span className="text-xs text-green-600">
                                                                    📍 {stu.distanceKm.toFixed(2)} km away
                                                                </span>
                                                            )}
                                                        </div>
                                                        <input 
                                                            type="checkbox" 
                                                            className="form-checkbox custom-checkbox2" 
                                                            checked={selectedStudents.includes(studentId)}
                                                            onChange={() => handleStudentToggle(studentId)}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* All Students Section */}
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
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <Typography className="text-md font-semibold text-gray-700">
                                                All Students ({(() => {
                                                    // Remove duplicates based on StudentId
                                                    const uniqueStudents = students.filter((stu, index, self) => 
                                                        index === self.findIndex((s) => 
                                                            (s.StudentId && stu.StudentId && s.StudentId === stu.StudentId) ||
                                                            (s.studentId && stu.studentId && s.studentId === stu.studentId) ||
                                                            (index === self.findIndex((s2) => 
                                                                s2.StudentId === stu.StudentId || s2.studentId === stu.studentId
                                                            ))
                                                        )
                                                    );
                                                    return uniqueStudents.length;
                                                })()})
                                            </Typography>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                                            {(() => {
                                                // Remove duplicates based on StudentId (keep first occurrence)
                                                const uniqueStudents = students.filter((stu, index, self) => {
                                                    const studentId = stu.StudentId || stu.studentId;
                                                    if (!studentId) return true; // Keep students without ID
                                                    return index === self.findIndex((s) => 
                                                        (s.StudentId || s.studentId) === studentId
                                                    );
                                                });
                                                return uniqueStudents.map((stu, index) => {
                                                    const studentId = stu.StudentId || stu.studentId;
                                                    return (
                                                        <div key={`student-${studentId || index}-${stu.StudentName || index}`} className={`flex items-center space-x-2 p-2 w-[75%] h-[6vh] border rounded-lg ${selectedStudents.includes(studentId) ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}>
                                                            <img
                                                                src={studentfive}
                                                                className="h-10 w-10 rounded-full"
                                                                alt={stu.StudentName || "Student"}
                                                            />
                                                            <span className="text-sm">
                                                                {stu.StudentName || "Unnamed Student"}
                                                            </span>
                                                            <input 
                                                                type="checkbox" 
                                                                className="form-checkbox custom-checkbox2" 
                                                                checked={selectedStudents.includes(studentId)}
                                                                onChange={() => handleStudentToggle(studentId)}
                                                            />
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-600">
                                        No students found for the selected school.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
            }
        </section >
    );
};

export default StudentSeatSelection;
