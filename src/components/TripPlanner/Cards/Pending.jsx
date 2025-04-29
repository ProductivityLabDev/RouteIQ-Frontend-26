import React from 'react';
import { Button } from '@material-tailwind/react';
import { locationicon, penicon, redbusicon, timeline } from '@/assets';

export function Pending({ trips }) {
  return (
    <div className='w-full max-w-[530px]'>
      {trips.map((trip) => (
        <div key={trip.id} className='border-4 border-[#FEB700] rounded-md p-4 mb-4'>
          <div className='flex justify-between items-center md:flex-row flex-col'>
            <div className='flex space-x-4 items-center'>
              <img src={redbusicon} alt="not found" />
              <p className='text-black text-md md:text-[22px] font-semibold'>{trip.busNumber}</p>
              <p className='text-xs md:text-[12px] text-black font-medium bg-[#FEB700] px-2 py-1 rounded-[4px]'>{trip.status}</p>
            </div>
            <div>
              <p className='font-semibold text-xs md:text-[14px] text-[#141516]/80 md:pt-0 pt-3'>{trip.time}</p>
            </div>
          </div>
          <div className='flex justify-between items-center mt-5 md:flex-nowrap flex-wrap'>
            <div className='flex items-center space-x-2 md:pb-0 pb-10'>
              <div className='flex flex-col space-y-1 items-center'>
                <p className='font-semibold text-xs md:text-[14px]'>Pickup</p>
                <img src={timeline} className='w-3 h-16' alt="not found" />
                <p className='font-semibold text-xs md:text-[14px]'>Dropoff</p>
              </div>
              <div className='flex flex-col space-y-3 md:space-y-6'>
                <div className='flex space-x-2'>
                  <img src={locationicon} className='w-[25px] h-[25px] mt-2' alt="not found" />
                  <div className='text-black'>
                    <h6 className='text-xs md:text-[14px] font-semibold'>{trip.pickup.location}</h6>
                    <p className='font-normal text-[12px]'>{trip.pickup.address}</p>
                  </div>
                </div>
                <div className='flex space-x-2'>
                  <img src={locationicon} className='w-[25px] h-[25px] mt-2' alt="not found" />
                  <div className='text-black'>
                    <h6 className='text-xs md:text-[14px] font-semibold'>{trip.dropoff.location}</h6>
                    <p className='font-normal text-[12px]'>{trip.dropoff.address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col relative mt-5'>
              <div className='bg-[#2C2F32] flex flex-col justify-end p-1.5 h-[75px] w-[120px] rounded-md text-center shadow-xl text-white'>
                <p className='text-[11px] font-normal'>Driver</p>
                <p className='text-[12.5px] font-semibold'>{trip.driver.name}</p>
                <img src={trip.driver.image} className='rounded-full w-14 h-14 object-cover absolute -top-8 left-8' alt="not found" />
              </div>
              <p className='text-[#565656] text-[14px] font-medium pt-2'>No. of Persons: <span className='text-black font-semibold'>{trip.noOfPersons}</span></p>
            </div>
            <div className='space-y-3'>
              <Button className='text-[#C01824] border-[#C01824] text-[12px] w-[70px] rounded-[4px] py-0.5 flex items-center justify-center capitalize' variant='outlined' size='sm'><img src={penicon} className='w-4 h-4 mr-0.5' alt="not found" />Edit</Button>
              <Button className='text-white bg-[#28A745] text-[12px] w-[70px] rounded-[4px] py-1 flex items-center justify-center capitalize' variant='filled' size='sm'>Approve</Button>
              <Button className='text-white bg-[#C01824] text-[12px] w-[70px] rounded-[4px] py-1 flex items-center justify-center capitalize' variant='filled' size='sm'>Reject</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Pending;
