import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardFooter, Typography, Spinner } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { addicon, announcementcardimg } from '@/assets';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchoolAnnouncements } from '@/redux/slices/schoolDashboardSlice';

export function Announcements() {
  const dispatch = useDispatch();
  const { announcements, loading } = useSelector((s) => s.schoolDashboard);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    dispatch(fetchSchoolAnnouncements());
  }, [dispatch]);

  return (
    <div className='mt-7'>
      <div className='flex justify-between items-center mb-5'>
        <h1 className='font-bold text-[24px] md:text-[32px] text-[#202224]'>Announcements</h1>
        <Link to={`/dashboard/create-announcement`}>
          <Button className="bg-[#C01824] capitalize font-semibold text-xs md:text-[14px] md:w-[250px] w-[200px] rounded-[6px]">
            <img src={addicon} className="inline-block h-[13px] w-[13px] mr-2" /> Create Announcement
          </Button>
        </Link>
      </div>

      {loading.announcements ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-8 w-8 text-[#C01824]" />
        </div>
      ) : announcements.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No announcements yet.</p>
      ) : (
        <div className='flex flex-wrap gap-5'>
          {announcements.map((ann) => (
            <Card key={ann.id} className="w-full max-w-[330px] shadow-2xl rounded-[16px] overflow-hidden p-3 md:p-4">
              <img
                src={ann.imageUrl || announcementcardimg}
                alt="announcement"
                className="rounded-[8px] w-fit bg-cover h-[163px] mx-auto object-cover"
              />
              <CardBody className='md:py-4 md:px-2 p-2.5'>
                <Typography className="mb-2 text-center font-extrabold text-[16px] text-black line-clamp-1">
                  {ann.title}
                </Typography>
                <Typography className="text-center font-medium text-[13px] text-[#151920]/50 line-clamp-3">
                  {ann.content}
                </Typography>
              </CardBody>
              <CardFooter className="px-4 py-0 flex justify-center">
                <Button
                  onClick={() => setSelectedAnnouncement(ann)}
                  fullWidth
                  className="py-2 bg-[#C01824] capitalize text-[16px] font-semibold rounded-[8px]"
                >
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-[480px] w-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedAnnouncement.imageUrl || announcementcardimg}
              className='w-full h-[200px] object-cover'
              alt="announcement"
            />
            <div className='p-5'>
              <h2 className='text-[20px] font-bold text-black mb-2'>{selectedAnnouncement.title}</h2>
              <p className='text-[14px] text-[#151920]/80 overflow-y-auto max-h-[200px]'>{selectedAnnouncement.content}</p>
            </div>
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className='absolute top-3 right-3 bg-white/80 rounded-full p-1 hover:bg-white'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcements;
