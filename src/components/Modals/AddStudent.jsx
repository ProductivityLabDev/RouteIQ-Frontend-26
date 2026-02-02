import React, { useState, useEffect } from 'react'
import { Button, Card, Dialog, Typography } from '@material-tailwind/react'
import { closeicon, locationicon } from '@/assets'
import { useDispatch, useSelector } from 'react-redux';
import { createStudent } from '@/redux/slices/studentSlice';
import { toast } from 'react-hot-toast';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';

// Google Maps API Loader - Keep libraries array outside component to prevent reload
const GOOGLE_LIBRARIES = ["places"];

export function AddStudent({ open, handleOpen, refreshStudents }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.students);

    // Google Maps API Loader - Exact same as Route Management
    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
    
    console.log("🔍 [AddStudent] Initializing Google Maps:", {
        apiKey: googleApiKey ? "✅ Present" : "❌ Missing",
        modalOpen: open
    });
    
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleApiKey,
        libraries: GOOGLE_LIBRARIES
    });

    useEffect(() => {
        console.log("🔍 [AddStudent] Google Maps Status:", {
            isLoaded,
            loadError: loadError?.message || null,
            modalOpen: open,
            googleMapsAvailable: typeof window !== 'undefined' && window.google?.maps?.places ? '✅ Yes' : '❌ No',
            apiKey: googleApiKey ? `✅ Present (${googleApiKey.substring(0, 10)}...)` : '❌ Missing'
        });
    }, [isLoaded, loadError, open, googleApiKey]);

    const [autocompletePickup, setAutocompletePickup] = useState(null);
    const [autocompleteDropoff, setAutocompleteDropoff] = useState(null);

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            // Reset form data when modal closes
            setFormData({
                firstName: "",
                lastName: "",
                pickupLocation: "",
                pickupLatitude: null,
                pickupLongitude: null,
                dropLocation: "",
                dropLatitude: null,
                dropLongitude: null,
                grade: "",
                emergencyContact: "",
                enrollmentNo: "",
                address: "",
                guardian1: "",
                guardian2: "",
                guardianEmail: "",
                busNo: ""
            });
            // Reset autocomplete instances
            setAutocompletePickup(null);
            setAutocompleteDropoff(null);
        }
    }, [open]);

    // Prevent dialog from closing when clicking on Google Places dropdown
    useEffect(() => {
        if (open && isLoaded) {
            const handlePacClick = (e) => {
                // Stop propagation for clicks inside Google Places dropdown
                const pacContainer = document.querySelector('.pac-container');
                if (pacContainer && pacContainer.contains(e.target)) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            };

            // Add event listeners
            document.addEventListener('mousedown', handlePacClick, true);
            document.addEventListener('click', handlePacClick, true);

            return () => {
                // Cleanup
                document.removeEventListener('mousedown', handlePacClick, true);
                document.removeEventListener('click', handlePacClick, true);
            };
        }
    }, [open, isLoaded]);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        pickupLocation: "" ,
        pickupLatitude: null,
        pickupLongitude: null,
        dropLocation: "",
        dropLatitude: null,
        dropLongitude: null,
        grade: "",
        emergencyContact: "",
        enrollmentNo: "",
        address: "",
        guardian1: "" ,
        guardian2: "" ,
        guardianEmail: "",
        busNo: ""
    });

    // Google Places Autocomplete handlers
    const onPickupLoad = (autocomplete) => {
        console.log("✅ [AddStudent] Pickup Autocomplete loaded!", {
            autocomplete,
            hasGetPlace: typeof autocomplete?.getPlace === 'function',
            hasSetFields: typeof autocomplete?.setFields === 'function'
        });
        setAutocompletePickup(autocomplete);
        
        // Test if autocomplete is working
        if (autocomplete) {
            console.log("🔍 [AddStudent] Autocomplete instance methods:", Object.keys(autocomplete));
        }
    };
    
    const onDropoffLoad = (autocomplete) => {
        console.log("✅ [AddStudent] Dropoff Autocomplete loaded!", {
            autocomplete,
            hasGetPlace: typeof autocomplete?.getPlace === 'function',
            hasSetFields: typeof autocomplete?.setFields === 'function'
        });
        setAutocompleteDropoff(autocomplete);
        
        // Test if autocomplete is working
        if (autocomplete) {
            console.log("🔍 [AddStudent] Autocomplete instance methods:", Object.keys(autocomplete));
        }
    };

    const onPickupPlaceChanged = (e) => {
        console.log("🔄 [AddStudent] onPickupPlaceChanged triggered!");
        
        // Prevent any default behavior or event propagation
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (autocompletePickup !== null) {
            const place = autocompletePickup.getPlace();
            console.log("📍 [AddStudent] Place object:", place);
            
            // Prevent form submission/close when place is selected
            if (!place || !place.geometry) {
                console.warn("⚠️ [AddStudent] Place has no geometry!");
                return;
            }
            
            // Handle different location formats
            let lat = null;
            let lng = null;
            
            if (place.geometry?.location) {
                // Google Maps LatLng object
                if (typeof place.geometry.location.lat === 'function') {
                    lat = place.geometry.location.lat();
                    lng = place.geometry.location.lng();
                } else {
                    // Direct number values
                    lat = place.geometry.location.lat;
                    lng = place.geometry.location.lng;
                }
            }
            
            console.log("📍 [AddStudent] Extracted coordinates:", { lat, lng });
            
            setFormData(prev => ({
                ...prev,
                pickupLocation: place.formatted_address || place.name || prev.pickupLocation,
                pickupLatitude: lat,
                pickupLongitude: lng
            }));
            
            console.log("📍 [AddStudent] Pickup place selected:", {
                address: place.formatted_address || place.name,
                lat,
                lng,
                placeId: place.place_id
            });
        } else {
            console.warn("⚠️ [AddStudent] autocompletePickup is null!");
        }
    };

    const onDropoffPlaceChanged = (e) => {
        console.log("🔄 [AddStudent] onDropoffPlaceChanged triggered!");
        
        // Prevent any default behavior or event propagation
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (autocompleteDropoff !== null) {
            const place = autocompleteDropoff.getPlace();
            console.log("📍 [AddStudent] Place object:", place);
            
            // Prevent form submission/close when place is selected
            if (!place || !place.geometry) {
                console.warn("⚠️ [AddStudent] Place has no geometry!");
                return;
            }
            
            // Handle different location formats
            let lat = null;
            let lng = null;
            
            if (place.geometry?.location) {
                // Google Maps LatLng object
                if (typeof place.geometry.location.lat === 'function') {
                    lat = place.geometry.location.lat();
                    lng = place.geometry.location.lng();
                } else {
                    // Direct number values
                    lat = place.geometry.location.lat;
                    lng = place.geometry.location.lng;
                }
            }
            
            console.log("📍 [AddStudent] Extracted coordinates:", { lat, lng });
            
            setFormData(prev => ({
                ...prev,
                dropLocation: place.formatted_address || place.name || prev.dropLocation,
                dropLatitude: lat,
                dropLongitude: lng
            }));
            
            console.log("📍 [AddStudent] Dropoff place selected:", {
                address: place.formatted_address || place.name,
                lat,
                lng,
                placeId: place.place_id
            });
        } else {
            console.warn("⚠️ [AddStudent] autocompleteDropoff is null!");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await dispatch(createStudent(formData));

            if (createStudent.fulfilled.match(result)) {
                toast.success(result.payload?.message || "Student created successfully!");
                
                // Reset form
                setFormData({
                    firstName: "",
                    lastName: "",
                    pickupLocation: "",
                    pickupLatitude: null,
                    pickupLongitude: null,
                    dropLocation: "",
                    dropLatitude: null,
                    dropLongitude: null,
                    grade: "",
                    emergencyContact: "",
                    enrollmentNo: "",
                    address: "",
                    guardian1: "",
                    guardian2: "",
                    guardianEmail: "",
                    busNo: ""
                });

                // Refresh students list if callback provided
                if (refreshStudents) {
                    await refreshStudents();
                }

                // Close modal
                handleOpen();
            } else {
                toast.error(result.payload || "Failed to create student. Please try again.");
            }
        } catch (err) {
            console.error("❌ Error creating student:", err);
            toast.error(err.message || "Failed to create student. Please try again.");
        }
    };

    return (
        <div>
            <style>{`
                .pac-container {
                    z-index: 9999 !important;
                }
                .pac-container .pac-item {
                    cursor: pointer;
                }
                .pac-container .pac-item:hover {
                    background-color: #f0f0f0;
                }
            `}</style>
            <Dialog 
                className='px-7 py-6 rounded-[4px]' 
                open={open} 
                handler={handleOpen}
                dismiss={{ enabled: false }}
            >
                <Card color="transparent" shadow={false}>
                    <div className='flex justify-between items-center'>
                        <Typography className='text-[24px] md:text-[32px] text-[#202224] font-bold'>
                            Add New Student
                        </Typography>
                        <Button
                            className='p-1'
                            variant="text"
                            onClick={handleOpen}
                        >
                            <img src={closeicon} className='w-[17px] h-[17px]' alt="" />
                        </Button>
                    </div>
                    <form className="md:mt-5 mb-2 md:max-w-screen-lg" onSubmit={handleSubmit}>
                        <div className='flex justify-between md:flex-nowrap flex-wrap md:space-x-7'>
                            <div className="mb-1 flex flex-col gap-5 w-full">
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    First Name
                                </Typography>
                                <input
                                    type='text'
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Pickup Location
                                </Typography>
                                <div 
                                    className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative"
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    {isLoaded ? (
                                        <Autocomplete
                                            onLoad={onPickupLoad}
                                            onPlaceChanged={onPickupPlaceChanged}
                                            className="w-full"
                                            options={{
                                                types: ['address'],
                                                componentRestrictions: { country: 'us' },
                                                fields: ['formatted_address', 'geometry', 'name', 'place_id']
                                            }}
                                        >
                                            <input
                                                type="text"
                                                name="pickupLocation"
                                                placeholder="Enter pickup location"
                                                className="bg-[#F5F6FA] outline-none w-full"
                                                value={formData.pickupLocation}
                                                onChange={handleChange}
                                                onKeyDown={(e) => {
                                                    // Prevent form submission on Enter key in autocomplete
                                                    if (e.key === 'Enter' && e.target.value) {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                onMouseDown={(e) => e.stopPropagation()}
                                            />
                                        </Autocomplete>
                                    ) : (
                                        <input
                                            type="text"
                                            name="pickupLocation"
                                            placeholder={isLoaded ? "Enter pickup location" : "Loading Google Maps..."}
                                            className="bg-[#F5F6FA] outline-none w-full"
                                            value={formData.pickupLocation}
                                            onChange={handleChange}
                                            disabled={!isLoaded}
                                        />
                                    )}
                                    <img src={locationicon} alt="location" className="h-5 w-5 ml-2 flex-shrink-0" />
                                </div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Grade
                                </Typography>
                                <input
                                    type='text'
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    placeholder="Your grade"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Enrollment No
                                </Typography>
                                <input
                                    type="number"
                                    name="enrollmentNo"
                                    value={formData.enrollmentNo}
                                    onChange={handleChange}
                                    placeholder="Enrollment No."
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Guardian 1
                                </Typography>
                                <input
                                    type="text"
                                    name="guardian1"
                                    value={formData.guardian1}
                                    onChange={handleChange}
                                    placeholder="Guardian one"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Bus No
                                </Typography>
                                <input
                                    type="text"
                                    name="busNo"
                                    value={formData.busNo}
                                    onChange={handleChange}
                                    placeholder="Bus number"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                            </div>
                            <div className="mb-1 flex flex-col gap-5 w-full">
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Last Name
                                </Typography>
                                <input
                                    type='text'
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Drop Location
                                </Typography>
                                <div 
                                    className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative"
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    {isLoaded ? (
                                        <Autocomplete
                                            onLoad={onDropoffLoad}
                                            onPlaceChanged={onDropoffPlaceChanged}
                                            className="w-full"
                                            options={{
                                                types: ['address'],
                                                componentRestrictions: { country: 'us' },
                                                fields: ['formatted_address', 'geometry', 'name', 'place_id']
                                            }}
                                        >
                                            <input
                                                type="text"
                                                name="dropLocation"
                                                placeholder="Enter drop location"
                                                className="bg-[#F5F6FA] outline-none w-full"
                                                value={formData.dropLocation}
                                                onChange={handleChange}
                                                onKeyDown={(e) => {
                                                    // Prevent form submission on Enter key in autocomplete
                                                    if (e.key === 'Enter' && e.target.value) {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                onMouseDown={(e) => e.stopPropagation()}
                                            />
                                        </Autocomplete>
                                    ) : (
                                        <input
                                            type="text"
                                            name="dropLocation"
                                            placeholder={isLoaded ? "Enter drop location" : "Loading Google Maps..."}
                                            className="bg-[#F5F6FA] outline-none w-full"
                                            value={formData.dropLocation}
                                            onChange={handleChange}
                                            disabled={!isLoaded}
                                        />
                                    )}
                                    <img src={locationicon} alt="location" className="h-5 w-5 ml-2 flex-shrink-0" />
                                </div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Emergency Contact
                                </Typography>
                                <input
                                    type='tel'
                                    name="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                    placeholder="Emergency contact"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Address
                                </Typography>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Address here"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Guardian 2
                                </Typography>
                                <input
                                    type="text"
                                    name="guardian2"
                                    value={formData.guardian2}
                                    onChange={handleChange}
                                    placeholder="Guardian two"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Guardian Email
                                </Typography>
                                <input
                                    type="email"
                                    name="guardianEmail"
                                    value={formData.guardianEmail}
                                    onChange={handleChange}
                                    placeholder="Guardian Email"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                            </div>
                        </div>
                        <div className='space-x-4 flex justify-end'>
                            <Button
                                type="button"
                                onClick={handleOpen}
                                className="mt-8 px-14 py-2.5 border-2 border-[#C01824] text-[18px] text-[#C01824] capitalize rounded-[6px]"
                                size='lg'
                                variant='outlined'
                                disabled={loading.creating}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="mt-8 px-14 py-2.5 bg-[#C01824] text-[18px] capitalize rounded-[6px]"
                                variant='filled'
                                size='lg'
                                disabled={loading.creating}
                            >
                                {loading.creating ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </Dialog>
        </div>
    )
}

