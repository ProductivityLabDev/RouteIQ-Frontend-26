import React, { useState, useEffect } from 'react'
import VendorDashboardHeader from '@/components/VendorDashboardHeader'
import { Typography, Spinner } from '@material-tailwind/react'
import { editicon } from '@/assets'
import { busService } from '@/services/busService'
import { toast } from 'react-hot-toast'

const VehicleInfoComponent = ({ vehicle, onBack }) => {
    const [busData, setBusData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log("🚌 Vehicle data received in VehicleInfoComponent:", vehicle);

    useEffect(() => {
        const fetchBusDetails = async () => {
            if (!vehicle) {
                setLoading(false);
                return;
            }

            // Extract vehicleId from vehicle object (try multiple property names)
            const vehicleId = vehicle.vehicleId 
                || vehicle.VehicleId 
                || vehicle.BusId 
                || vehicle.busId 
                || vehicle.id 
                || vehicle.Id
                || vehicle.ID;

            if (!vehicleId) {
                console.error("❌ [VehicleInfoComponent] No vehicleId found in vehicle:", vehicle);
                setError("Vehicle ID not found");
                setLoading(false);
                toast.error("Vehicle ID not found");
                return;
            }

            try {
                setLoading(true);
                console.log("🔄 [VehicleInfoComponent] Fetching bus details for vehicleId:", vehicleId);
                const response = await busService.getBusByVehicleId(vehicleId);
                
                if (response.ok && response.data) {
                    console.log("✅ [VehicleInfoComponent] Bus details fetched:", response.data);
                    setBusData(response.data);
                } else {
                    throw new Error("Failed to fetch bus details");
                }
            } catch (err) {
                console.error("❌ [VehicleInfoComponent] Error fetching bus details:", err);
                setError(err.message || "Failed to load bus information");
                toast.error("Failed to load bus information");
            } finally {
                setLoading(false);
            }
        };

        fetchBusDetails();
    }, [vehicle]);

    if (!vehicle) {
        return (
            <section className='w-full h-full'>
                <div className='bg-white w-full rounded-[4px] border shadow-sm h-[105vh]'>
                    <VendorDashboardHeader title='Bus Information' TextClassName='md:text-[22px]' className='ms-12' icon={true} handleNavigate={onBack} />
                    <div className='flex items-center justify-center h-[50vh]'>
                        <Typography className="text-center font-bold text-[16px] text-gray-500">
                            No vehicle data available. Please go back and select a vehicle.
                        </Typography>
                    </div>
                </div>
            </section>
        );
    }

    if (loading) {
        return (
            <section className='w-full h-full'>
                <div className='bg-white w-full rounded-[4px] border shadow-sm h-[105vh]'>
                    <VendorDashboardHeader title='Bus Information' TextClassName='md:text-[22px]' className='ms-12' icon={true} handleNavigate={onBack} />
                    <div className='flex items-center justify-center h-[50vh]'>
                        <div className='flex flex-col items-center'>
                            <Spinner className="h-8 w-8 text-[#C01824]" />
                            <Typography className="mt-3 text-center font-bold text-[16px] text-gray-500">
                                Loading bus information...
                            </Typography>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !busData) {
        return (
            <section className='w-full h-full'>
                <div className='bg-white w-full rounded-[4px] border shadow-sm h-[105vh]'>
                    <VendorDashboardHeader title='Bus Information' TextClassName='md:text-[22px]' className='ms-12' icon={true} handleNavigate={onBack} />
                    <div className='flex items-center justify-center h-[50vh]'>
                        <Typography className="text-center font-bold text-[16px] text-red-500">
                            {error || "Failed to load bus information"}
                        </Typography>
                    </div>
                </div>
            </section>
        );
    }

    // Use busData from API instead of vehicle prop
    const vehicleData = busData;

    return (
        <section className='w-full h-full'>
            <div className='bg-white w-full rounded-[4px] border shadow-sm h-[105vh]'>
                <VendorDashboardHeader title='Bus Information' TextClassName='md:text-[22px]' className='ms-12' icon={true} handleNavigate={onBack} />
                <div className='flex flex-row w-[100%] h-[23vh] justify-between h-[33vh] ps-5 border-b-2 border-[#d3d3d3]'>
                    <div className='flex flex-row w-[60%] h-[23vh] gap-[59px]'>
                        <img 
                            src={vehicleData?.vehiclImg || vehicleData?.VehicleImage || vehicleData?.vehicleImage || '/src/assets/vechicelSvg.svg'} 
                            alt={vehicleData?.VehicleName || vehicleData?.vehicleName || "vehicle"}
                            className="w-48 h-32 object-cover rounded"
                        />
                        <div className='flex flex-col h-full w-[65%] gap-[13px]'>
                            <Typography className="mb-2 text-start font-extrabold text-[19px] text-black">
                                {vehicleData?.VehicleName || vehicleData?.vehicleName || vehicleData?.vehicleName || "N/A"}
                            </Typography>
                            <div className='flex flex-row gap-[85px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Bus type
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {vehicleData?.BusType || vehicleData?.busType || "School Bus"}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[50px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Vehicle Make
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {vehicleData?.VehicleMake || vehicleData?.vehicleMake || "N/A"}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[45px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Number Plate
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {vehicleData?.NumberPlate || vehicleData?.numberPlate || vehicleData?.LicensePlate || "N/A"}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                {/* --------------------- vechile information------------------------------------- */}
                <div className='flex flex-col h-[52vh] w-[60%]'>
                    <div className='grid grid-cols-[1fr_auto_1fr] gap-x-4'>
                        <div className='flex flex-col w-[100%] h-[52vh] ps-14 pt-10'>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Vehicle name/number
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Vehicle Make
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Bus type
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                No of passengers
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Number Plate
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Vin No
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Year
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Mileage
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Service intervals
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                GPS
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Drivers
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Fuel tank size
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Fuel type (gas, diesel)
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Fuel date
                            </Typography>
                        </div>

                        {/* Center Vertical Line */}
                        <div className="border-l border-gray-400 h-[53vh]"></div>

                        <div className='flex flex-col w-[100%] h-[52vh] ps-12 pt-10'>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicleData?.VehicleName || vehicleData?.vehicleName || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicleData?.VehicleMake || vehicleData?.vehicleMake || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicleData?.BusType || vehicleData?.busType || "School Bus"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicleData?.NoOfPassenger || vehicleData?.noOfPassenger || vehicleData?.NumberOfPassengers || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicleData?.NumberPlate || vehicleData?.numberPlate || vehicleData?.LicensePlate || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicleData?.VinNo || vehicleData?.vinNo || vehicleData?.VIN || vehicleData?.VINNumber || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicleData?.ModelYear || vehicleData?.modelYear || vehicleData?.Year || vehicleData?.year || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicleData?.Mileage || vehicleData?.mileage ? `${vehicleData.Mileage || vehicleData.mileage} Km/Ltr` : "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black flex flex-row gap-3">
                                {(() => {
                                    const serviceInterval = vehicleData?.ServiceInterval || vehicleData?.serviceInterval;
                                    const nextServiceDate = vehicleData?.NextServiceDate || vehicleData?.nextServiceDate;
                                    
                                    if (!serviceInterval) return "N/A";
                                    
                                    try {
                                        const lastDate = new Date(serviceInterval);
                                        const lastFormatted = isNaN(lastDate.getTime()) ? serviceInterval : lastDate.toLocaleDateString();
                                        const nextFormatted = nextServiceDate 
                                            ? (() => {
                                                try {
                                                    const nextDate = new Date(nextServiceDate);
                                                    return isNaN(nextDate.getTime()) ? nextServiceDate : nextDate.toLocaleDateString();
                                                } catch {
                                                    return nextServiceDate;
                                                }
                                            })()
                                            : "N/A";
                                        
                                        return (
                                            <>
                                                Last: {lastFormatted} | 
                                                <span className="text-red-500">Next: {nextFormatted}</span>
                                                <img src={editicon} alt="edit" />
                                            </>
                                        );
                                    } catch {
                                        return serviceInterval;
                                    }
                                })()}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicleData?.GPS || vehicleData?.gps || vehicleData?.GPSTracking || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] flex flex-row gap-3 items-center flex-wrap">
                                {vehicleData?.EmpName || vehicleData?.empName || vehicleData?.DriverName || vehicleData?.driverName || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicleData?.FuelTankSize || vehicleData?.fuelTankSize ? `${vehicleData.FuelTankSize || vehicleData.fuelTankSize} L` : "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicleData?.FuelType || vehicleData?.fuelType || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {(() => {
                                    const fuelDate = vehicleData?.FuelDate || vehicleData?.fuelDate;
                                    if (!fuelDate) return "N/A";
                                    try {
                                        const date = new Date(fuelDate);
                                        return isNaN(date.getTime()) ? fuelDate : date.toLocaleDateString();
                                    } catch {
                                        return fuelDate;
                                    }
                                })()}
                            </Typography>
                        </div>
                         <button className="bg-[#C01824] py-4 w-[50%] ml-5 rounded text-white hover:bg-[#A01520] px-1" onClick={onBack}> 
                            See Less
                        </button>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default VehicleInfoComponent
