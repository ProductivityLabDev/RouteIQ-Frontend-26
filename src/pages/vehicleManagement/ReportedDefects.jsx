import React from 'react'
import VendorDashboardHeader from '@/components/VendorDashboardHeader';
import { Typography } from '@material-tailwind/react';
import ButtonComponent from '@/components/buttons/CustomButton';

const ReportedDefects = ({ vehicle, onBack, handleSeeMoreInfoClick, handleScheduleRepair }) => {
    return (
        <section className='w-full h-full'>
            <div className='bg-white w-full rounded-[4px] border shadow-sm h-full'>
                <VendorDashboardHeader title='Reported Defects' icon={true} TextClassName='md:text-[22px]' className='ms-12' handleNavigate={onBack} />
                <div className='flex flex-row w-[97%] h-[23vh] justify-between h-[33vh] m-5 border-b-2 border-[#d3d3d3]'>
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
                            <ButtonComponent sx={{ width: '145px', height: '42px', fontSize: '13px' }} label='See more Info' Icon={false} onClick={() => handleSeeMoreInfoClick(vehicle)} />
                        </div>
                    </div>
                </div>
                {/* ------------------------------- Reported Defect Content ------------------------- */}
                <div className='flex flex-col h-[34vh] w-[65%] gap-[16px] px-12'>
                    <Typography className="mb-2 text-start font-extrabold text-[19px] text-black">
                        Reported Defect
                    </Typography>
                    <div className='flex flex-row gap-5'>
                        <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                            Defect Type:
                        </Typography>
                        <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                            Braking system
                        </Typography>
                    </div>
                    <div className='flex flex-row gap-5'>
                        <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                            Defect Description:
                        </Typography>
                        <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                            Spongy or soft Brake pedal When pressing
                        </Typography>
                    </div>
                    <div className='flex flex-row gap-5'>
                        <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                            Reported by:
                        </Typography>
                        <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                            James Fisher
                        </Typography>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <ButtonComponent sx={{ width: '185px', height: '42px', fontSize: '11px' }} label='Request a Photo/Video' Icon={false} />
                        <ButtonComponent sx={{ width: '175px', height: '42px', fontSize: '13px' }} label='Schedule Repair' Icon={false} onClick={handleScheduleRepair} />
                        <ButtonComponent sx={{
                            width: '175px', height: '42px', fontSize: '13px', backgroundColor: '#28A745', "&:hover": {
                                backgroundColor: '#28A745',
                            },
                        }} label='Keep Running' Icon={false} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ReportedDefects
