import React from 'react'
import VendorDashboardHeader from '@/components/VendorDashboardHeader'
import { Typography } from '@material-tailwind/react'
import { editicon } from '@/assets'

const VehicleInfoComponent = ({ vehicle, onBack }) => {
    console.log("🚌 Vehicle data received in VehicleInfoComponent:", vehicle);

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

    return (
        <section className='w-full h-full'>
            <div className='bg-white w-full rounded-[4px] border shadow-sm h-[105vh]'>
                <VendorDashboardHeader title='Bus Information' TextClassName='md:text-[22px]' className='ms-12' icon={true} handleNavigate={onBack} />
                <div className='flex flex-row w-[100%] h-[23vh] justify-between h-[33vh] ps-5 border-b-2 border-[#d3d3d3]'>
                    <div className='flex flex-row w-[60%] h-[23vh] gap-[59px]'>
                        <img 
                            src={vehicle?.vehiclImg || vehicle?.VehicleImage || '/src/assets/vechicelSvg.svg'} 
                            alt={vehicle?.VehicleName || vehicle?.vehicleName || "vehicle"}
                            className="w-48 h-32 object-cover rounded"
                        />
                        <div className='flex flex-col h-full w-[65%] gap-[13px]'>
                            <Typography className="mb-2 text-start font-extrabold text-[19px] text-black">
                                {vehicle?.VehicleName || vehicle?.vehicleName || "N/A"}
                            </Typography>
                            <div className='flex flex-row gap-[85px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Bus type
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {vehicle?.BusType || vehicle?.busType || "School Bus"}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[50px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Vehicle Make
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {vehicle?.VehicleMake || vehicle?.vehicleMake || "N/A"}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[45px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Number Plate
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {vehicle?.NumberPlate || vehicle?.numberPlate || vehicle?.LicensePlate || "N/A"}
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
                                {vehicle?.VehicleName || vehicle?.vehicleName || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicle?.VehicleMake || vehicle?.vehicleMake || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicle?.BusType || vehicle?.busType || "School Bus"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicle?.NoOfPassenger || vehicle?.noOfPassenger || vehicle?.NumberOfPassengers || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicle?.NumberPlate || vehicle?.numberPlate || vehicle?.LicensePlate || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicle?.VinNo || vehicle?.vinNo || vehicle?.VIN || vehicle?.VINNumber || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicle?.ModelYear || vehicle?.modelYear || vehicle?.Year || vehicle?.year || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicle?.Mileage || vehicle?.mileage ? `${vehicle.Mileage || vehicle.mileage} Km/Ltr` : "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black flex flex-row gap-3">
                                {(() => {
                                    const serviceInterval = vehicle?.ServiceInterval || vehicle?.serviceInterval;
                                    const nextServiceDate = vehicle?.NextServiceDate || vehicle?.nextServiceDate;
                                    
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
                                {vehicle?.GPS || vehicle?.gps || vehicle?.GPSTracking || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] flex flex-row gap-3 items-center flex-wrap">
                                {(() => {
                                    const drivers = vehicle?.Driver || vehicle?.driver || vehicle?.Drivers || vehicle?.drivers;
                                    if (!drivers) return "N/A";
                                    
                                    let driverNames = [];
                                    if (Array.isArray(drivers)) {
                                        driverNames = drivers.map(d => d?.Name || d?.name || d || "Unknown");
                                    } else if (typeof drivers === 'string') {
                                        driverNames = drivers.split(",").map(d => d.trim());
                                    } else if (drivers?.Name || drivers?.name) {
                                        driverNames = [drivers.Name || drivers.name];
                                    } else {
                                        driverNames = ["N/A"];
                                    }
                                    
                                    return (
                                        <>
                                            {driverNames.map((name, idx) => (
                                                <span key={idx} className="text-red-500 underline">
                                                    {name}{idx < driverNames.length - 1 ? "," : ""}
                                                </span>
                                            ))}
                                            <img src={editicon} alt="edit" className="ml-1" />
                                        </>
                                    );
                                })()}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicle?.FuelTankSize || vehicle?.fuelTankSize ? `${vehicle.FuelTankSize || vehicle.fuelTankSize} L` : "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {vehicle?.FuelType || vehicle?.fuelType || "N/A"}
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                {(() => {
                                    const fuelDate = vehicle?.FuelDate || vehicle?.fuelDate;
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
