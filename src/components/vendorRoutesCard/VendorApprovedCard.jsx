import React, { useState } from 'react';
import {
  distance,
  locationicon,
  penicon,
  redbusicon,
  timeline,
} from '@/assets';
import { Button } from '@material-tailwind/react';

export function VendorApprovedCard({
  trip,
  trips,
  onEditClick,
  selectedTab,
  handleMapScreenClick,
  handleEditRoute,
  handleRouteMap,
}) {
  const [showCommModal, setShowCommModal] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const handleRecipientChange = (e) => {
    const { value } = e.target;

    if (value === 'both') {
      setSelectedRecipients((prev) =>
        prev.includes('both') ? [] : ['driver', 'retail', 'both']
      );
    } else {
      setSelectedRecipients((prev) => {
        const updated = prev.includes(value)
          ? prev.filter((item) => item !== value && item !== 'both')
          : [...prev.filter((item) => item !== 'both'), value];
        return updated;
      });
    }
  };

  return (
    <div className='w-full max-w-[530px]'>
      <div className='border-4 border-[#28A745] rounded-md p-3 md:p-4 mb-4'>
        <div className='flex justify-between items-center'>
          <p className='text-black text-md md:text-[16px] font-semibold'>
            Trip Name: {trip?.tripname}
          </p>
          <p className='text-black text-md md:text-[16px] font-semibold'>
            Trip No: {trip?.tripno}
          </p>
        </div>

        <div className='flex justify-between items-center md:flex-row flex-col mt-2'>
          <div className='flex space-x-4 items-center'>
            <img src={redbusicon} alt='not found' />
            <p className='text-black text-md md:text-[22px] font-semibold'>
              {trip?.busNumber || trips[0]?.busNumber}
            </p>
            <p className='text-xs md:text-[12px] text-white font-medium bg-[#28A745] px-2 py-1 rounded-[4px]'>
              {trip?.status || trips[0]?.status}
            </p>
          </div>
          <div>
            <p className='font-semibold text-xs md:text-[14px] text-[#141516]/80 md:pt-0 pt-3'>
              {trip?.time || trips[0]?.time}
            </p>
          </div>
        </div>

        <div className='flex justify-between items-center md:flex-row flex-col mt-5'>
          <div className='flex items-center space-x-2 md:pb-0 pb-10'>
            <div className='flex flex-col space-y-1 items-center'>
              <p className='font-semibold text-xs md:text-[14px]'>Pickup</p>
              <img src={timeline} className='w-3 h-16' alt='not found' />
              <p className='font-semibold text-xs md:text-[14px]'>Dropoff</p>
            </div>
            <div className='flex flex-col space-y-3 md:space-y-6'>
              <div className='flex space-x-2'>
                <img
                  src={locationicon}
                  className='w-[25px] h-[25px] mt-2'
                  alt='not found'
                />
                <div className='text-black'>
                  <h6 className='text-xs md:text-[14px] font-semibold'>
                    {trip?.pickup?.location || trips[0]?.location}
                  </h6>
                  <p className='font-normal text-[12px]'>
                    {trip?.pickup?.address || trips[0]?.pickup?.address}
                  </p>
                </div>
              </div>
              <div className='flex space-x-2'>
                <img
                  src={locationicon}
                  className='w-[25px] h-[25px] mt-2'
                  alt='not found'
                />
                <div className='text-black'>
                  <h6 className='text-[14px] font-semibold'>
                    {trip?.dropoff?.location || trips[0]?.dropoff?.location}
                  </h6>
                  <p className='font-normal text-[12px]'>
                    {trip?.dropoff?.address || trips[0]?.dropoff?.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-row gap-3 mt-2'>
            <div className='flex flex-col relative'>
              <div className='bg-[#fff] flex flex-col justify-end p-1.5 h-[75px] w-[120px] rounded-md text-center shadow-xl text-white'>
                <p className='text-[11px] font-[600] text-[#000]'>Driver</p>
                <p className='text-[12.5px] font-[700] text-[#000]'>
                  {trip?.driver?.name || trips[0]?.driver?.name}
                </p>
                <img
                  src={trip?.driver?.image || trips[0]?.driver?.image}
                  className='rounded-full w-14 h-14 object-cover absolute -top-8 left-8'
                  alt='not found'
                />
              </div>
              <p className='text-[#565656] text-[14px] font-medium pt-2'>
                No. of Persons:{' '}
                <span className='text-black font-semibold'>
                  {trip?.noOfPersons || trips[0]?.noOfPersons}
                </span>
              </p>
            </div>

            <div className='flex flex-col gap-3'>
              {selectedTab === 'Trip Planner' ? (
                <>
                  <Button
                    className='text-[#fff] bg-[#C01824] border-[#C01824] text-[12px] w-[70px] rounded-[4px] py-0.5 flex items-center justify-center capitalize'
                    variant='outlined'
                    size='sm'
                    onClick={handleMapScreenClick}
                  >
                    <img
                      src={distance}
                      className='w-4 h-4 mr-0.5'
                      alt='not found'
                    />
                    Map
                  </Button>

                  <Button
                    className='text-[#C01824] border-[#C01824] text-[12px] w-[70px] rounded-[4px] py-0.5 flex items-center justify-center capitalize'
                    variant='outlined'
                    size='sm'
                    onClick={onEditClick}
                  >
                    <img
                      src={penicon}
                      className='w-4 h-4 mr-0.5'
                      alt='not found'
                    />
                    Edit
                  </Button>

                  <Button
                    className='text-[#C01824] border-[#C01824] text-[10px] px-3 rounded-[4px] py-0.5 flex items-center justify-center capitalize whitespace-nowrap'
                    variant='outlined'
                    size='sm'
                    onClick={() => setShowCommModal(true)}
                  >
                    <img
                      src={penicon}
                      className='w-4 h-4 mr-0.5'
                      alt='not found'
                    />
                    Send Communication
                  </Button>
                </>
              ) : (
                <Button
                  className='text-[#C01824] border-[#C01824] text-[12px] w-[70px] rounded-[4px] py-0.5 flex items-center justify-center capitalize'
                  variant='outlined'
                  size='sm'
                  onClick={handleEditRoute}
                >
                  <img
                    src={penicon}
                    className='w-4 h-4 mr-0.5'
                    alt='not found'
                  />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Add Trip Start/End Time Row Here */}
        <div className='flex justify-between items-center mt-5 px-1'>
          <p className='text-[13px] font-medium text-[#333]'>
            <span className='font-semibold text-[14px] text-[#000]'>Trip Start Time:</span>{' '}
            {trip?.startTime || trips[0]?.startTime || 'N/A'}
          </p>
          <p className='text-[13px] font-medium text-[#333]'>
            <span className='font-semibold text-[14px] text-[#000]'>Trip End Time:</span>{' '}
            {trip?.endTime || trips[0]?.endTime || 'N/A'}
          </p>
        </div>
      </div>

      {/* Communication Modal */}
      {showCommModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg p-6 w-[320px] md:w-[400px]'>
            <h3 className='text-lg font-semibold mb-4'>
              Send Communication To:
            </h3>

            <div className='space-y-3'>
              <label className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  value='driver'
                  checked={selectedRecipients.includes('driver')}
                  onChange={handleRecipientChange}
                />
                <span>Driver</span>
              </label>
              <label className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  value='retail'
                  checked={selectedRecipients.includes('retail')}
                  onChange={handleRecipientChange}
                />
                <span>Retail Customer</span>
              </label>
              <label className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  value='both'
                  checked={selectedRecipients.includes('both')}
                  onChange={handleRecipientChange}
                />
                <span>Both</span>
              </label>
            </div>

            <div className='flex justify-end space-x-3 mt-6'>
              <Button
                size='sm'
                variant='outlined'
                onClick={() => setShowCommModal(false)}
              >
                Cancel
              </Button>
              <Button
                size='sm'
                className='bg-[#C01824] text-white'
                onClick={() => {
                  console.log('Send communication to:', selectedRecipients);
                  setShowCommModal(false);
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorApprovedCard;
