import React, { useState, lazy, Suspense } from 'react';
import { Button, Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { addicon, announcementcardimg } from '@/assets';

const AnnouncementDialog = lazy(() => import('@/components/AnnouncementDialog'));

export function Announcements() {
  const [size, setSize] = useState(null);

  const handleOpen = (value) => setSize(value);

  return (
    <div className='mt-7 flex justify-between items-start md:flex-row flex-col-reverse'>
      <div className='w-full max-w-[350px]'>
        <h1 className='font-bold text-[24px] md:text-[32px] text-[#202224] mb-5'>Announcements</h1>
        <Card className="w-full h-[410px] max-w-[330px] shadow-2xl rounded-[16px] overflow-hidden p-3 md:p-4">
          <img
            src={announcementcardimg}
            alt="card-image"
            className="rounded-[8px] w-fit bg-cover h-[163px] mx-auto"
          />
          <CardBody className='md:py-6 md:px-6 p-2.5'>
            <Typography className="mb-2 text-center font-extrabold text-[19px] text-black">
              Read the report
            </Typography>
            <Typography className="text-center font-medium text-[14px] text-[#151920]/50">
              The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to &quot;Naviglio&quot; where you can enjoy the main night life in Barcelona.
            </Typography>
          </CardBody>
          <CardFooter className="px-4 py-0 flex justify-center md:mt-0 mt-7">
            <Button onClick={() => handleOpen("sm")} fullWidth className="py-2 bg-[#C01824] capitalize text-[16px] font-semibold rounded-[8px]">View</Button>
          </CardFooter>
        </Card>
      </div>
      <div>
        <Link to={`/dashboard/create-announcement`}>
          <Button className="mt-3 md:mb-0 mb-8 bg-[#C01824] capitalize font-semibold text-xs md:text-[14px] md:w-[250px] w-[200px] rounded-[6px] opacity-100">
            <img src={addicon} className="inline-block h-[13px] w-[13px] mr-2" /> Create Announcement
          </Button>
        </Link>
        <Suspense fallback={<div>Loading...</div>}>
          {size && <AnnouncementDialog size={size} handleOpen={handleOpen} />}
        </Suspense>
      </div>
    </div>
  );
}

export default Announcements;
