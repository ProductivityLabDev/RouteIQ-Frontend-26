import React, { useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { Approved, Pending, Rejected, Header } from '@/components/TripPlanner';
import { nexticon, previcon } from '@/assets';
import { tripsData } from '@/data';

export function TripPlanner() {
  const [selectedTrip, setSelectedTrip] = useState('All');
  const [active, setActive] = useState(1);
  const next = () => {
    if (active === 10) return;
    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    setActive(active - 1);
  };
  

  const filteredTrips = selectedTrip === 'All' ? tripsData : tripsData.filter(trip => trip.status === selectedTrip);

  return (
    <section className='mt-7'>
      <Header setSelectedTrip={setSelectedTrip} selectedTrip={selectedTrip} />
      <div className='bg-white rounded-md py-3 px-4 mt-5'>
        <div className='grid xl:grid-cols-2 grid-cols-1 place-items-center lg:place-items-start gap-5'>
          {selectedTrip === 'Approved' && <Approved trips={filteredTrips} />}
          {selectedTrip === 'Pending' && <Pending trips={filteredTrips} />}
          {selectedTrip === 'Rejected' && <Rejected trips={filteredTrips} />}
          {selectedTrip === 'All' && (
            <>
              <Approved trips={filteredTrips.filter(trip => trip.status === 'Approved')} />
              <Pending trips={filteredTrips.filter(trip => trip.status === 'Pending')} />
              <Rejected trips={filteredTrips.filter(trip => trip.status === 'Rejected')} />
            </>
          )}
        </div>
        <div className='flex justify-between items-center mt-6 mb-4 px-7 py-3'>
          <Typography color="gray" className='text-[#202224]/60 font-semibold text-[14px]'>
            Page {active} - 06 of 20
          </Typography>
          <div className='!p-0 bg-[#FAFBFD] flex justify-around items-center w-[86px] h-[33px] border border-[#D5D5D5] rounded-[12px] space-x-3'>
            <img onClick={prev}
              disabled={active === 1} src={previcon} alt='' strokeWidth={2} className="h-[24px] w-[24px] cursor-pointer" />
            <img onClick={next}
              disabled={active === 10} src={nexticon} alt='' strokeWidth={2} className="h-[24px] w-[24px] cursor-pointer" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TripPlanner;
