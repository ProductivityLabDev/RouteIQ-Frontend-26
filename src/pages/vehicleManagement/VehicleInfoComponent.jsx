import React from 'react'
import VendorDashboardHeader from '@/components/VendorDashboardHeader'
import { Typography } from '@material-tailwind/react'
import { editicon } from '@/assets'

const VehicleInfoComponent = ({ vehicle, onBack }) => {
    return (
        <section className='w-full h-full'>
            <div className='bg-white w-full rounded-[4px] border shadow-sm h-[105vh]'>
                <VendorDashboardHeader title='Bus Information' TextClassName='md:text-[22px]' className='ms-12' icon={true} handleNavigate={onBack} />
                <div className='flex flex-row w-[100%] h-[23vh] justify-between h-[33vh] ps-5 border-b-2 border-[#d3d3d3]'>
                    <div className='flex flex-row w-[60%] h-[23vh] gap-[59px]'>
                        <img src={vehicle?.vehiclImg} />
                        <div className='flex flex-col h-full w-[65%] gap-[13px]'>
                            <Typography className="mb-2 text-start font-extrabold text-[19px] text-black">
                                {vehicle?.vehicleName}
                            </Typography>
                            <div className='flex flex-row gap-[85px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Bus type
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    School Bus
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[50px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Vehicle Make
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Minotour
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[45px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Number Plate
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    112200
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
                                Minotour® School Bus.
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Minotour
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                School Bus
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Up to 30
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                112200
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                11220
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                2016
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                50 Km/Ltr
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black flex flex-row gap-3">
                                Last: 7/18/2024 | <span className="text-red-500">Next: 9/18/2024</span><img src={editicon} />
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                10:00 A.M - 10:00 P.M
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] flex flex-row gap-3">
                                <span className="text-red-500 underline">Jake,</span><span className="text-red-500 underline">John,</span><span className="text-red-500 underline">Dave</span>
                                <img src={editicon} />
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Fuel 4.3 L
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Gas
                            </Typography>
                            <Typography className="mb-2 text-left font-bold text-[16px] text-black">
                                Fuel date
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
