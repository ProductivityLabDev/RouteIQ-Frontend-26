import React, { useState } from 'react';
import { Button, ButtonGroup, Tab, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import Map from '@/components/Map';
import { darksearchicon, mapImage } from '@/assets';
import { contactDetails, studentsData, tripDetails, tripStages } from '@/data';

const tabsData = [
  { label: "All Students", value: "allstudents" },
  { label: "On Board", value: "onboard" },
];

export function Schedule() {
  const [selectedTab, setSelectedTab] = useState('A');
  const [activeTab, setActiveTab] = useState("allstudents");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const toggleStudentPanel = (student) => {
    setSelectedStudent(student);
  };

  const handleClosePanel = () => {
    setSelectedStudent(null);
  };

  const filterStudents = () => {
    if (activeTab === "allstudents") {
      return studentsData[selectedTab];
    }
    if (activeTab === "onboard") {
      return studentsData[selectedTab].slice(0, 2);
    }
    return [];
  };

  return (
    <>
      <div className='mt-7 md:h-[750px] h-full relative overflow-hidden'>
        <ButtonGroup className="border-0 rounded-[4px] outline-none p-0" variant="text">
          {['A', 'B', 'C', 'D'].map(bus => (
            <Button
              key={bus}
              className={selectedTab === bus ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white text-xs md:text-[14px] capitalize font-medium' : 'bg-white text-xs md:text-[14px] text-[#141516] capitalize font-medium'}
              onClick={() => setSelectedTab(bus)}
            >
              Bus {bus}
            </Button>
          ))}
        </ButtonGroup>
        <div className='flex md:flex-row flex-col md:space-y-0 space-y-5 h-full mt-6 border shadow-sm rounded-md space-x-1 relative'>
          <div className='bg-white w-full md:max-w-[280px] pt-2 overflow-y-auto'>
            <Tabs value={activeTab}>
              <TabsHeader
                className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                indicatorProps={{
                  className: "bg-transparent border-b-2 border-[#C01824] shadow-none rounded-none",
                }}
              >
                {tabsData.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                    className={activeTab === value ? "font-bold text-[#C01824]" : ""}
                  >
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
              <div className="relative flex items-center">
                <img src={darksearchicon} alt='' className="absolute left-3 h-4 w-4" />
                <input
                  className="bg-[#D2D2D2]/30 w-full pl-10 p-3 outline-none border-0"
                  type="search"
                  placeholder="Search"
                />
              </div>
              <TabsBody className='pt-2'>
                {filterStudents().map(({ name, busNo, imgSrc }, index) => (
                  <div key={index}>
                    <Button
                      variant='gradient'
                      className={`flex items-center gap-3 py-3 pl-4 w-full rounded-none transition-all ${selectedStudent?.name === name ? 'bg-black text-white' : 'bg-none hover:bg-black group'
                        }`}
                      onClick={() => toggleStudentPanel({ name, busNo, imgSrc })}
                    >
                      <img src={imgSrc} alt={name} className="rounded-full w-[43px] h-[43px]" />
                      <div className={`text-start text-base ${selectedStudent?.name === name ? 'text-white' : 'text-[#2C2F32] group-hover:text-white'
                        }`}>
                        <h6 className="font-bold text-[16px] capitalize">{name}</h6>
                        <p className="font-light text-[14px]">Bus NO. <span className='font-bold'>{busNo}</span></p>
                      </div>
                    </Button>
                    <hr className="h-px bg-gray-200 border-1 dark:bg-gray-800" />
                  </div>
                ))}
              </TabsBody>
            </Tabs>
          </div>
          {selectedStudent && (
            <div className='absolute md:left-[18rem] left-0  w-full top-0 md:w-full max-w-[370px] bg-white shadow-lg rounded-lg p-3 overflow-y-auto z-[500]'>
              <div className='flex justify-between items-center'>
                <div className="flex items-center gap-3 w-full bg-none">
                  <img src={selectedStudent.imgSrc} alt={selectedStudent.name} className="rounded-full w-[60px] h-[60px]" />
                  <div className='text-center leading-tight text-[#141516] group-hover:text-white'>
                    <h6 className="font-bold text-[18px]">{selectedStudent.name}</h6>
                    <p className="font-normal text-[14px]">Student</p>
                  </div>
                </div>
                <div className='bg-[#DDDDE1] text-[#141516] leading-tight rounded-md px-3 py-1 text-center'>
                  <p className='text-[14px] font-normal'>BUS NO.</p>
                  <p className='text-[14px] font-bold'>{selectedStudent.busNo}</p>
                </div>
              </div>
              <div className='flex items-center justify-between pt-3'>
                {contactDetails.map((contact, index) => (
                  <div key={index} className='text-[#141516]'>
                    <p className='text-[13.5px] font-medium'>{contact.label}</p>
                    <p className='text-[14px] font-bold'>{contact.number}</p>
                  </div>
                ))}
              </div>
              <div className='text-black pt-2'>
                <p className='text-[13.5px]'>Address</p>
                <p className='text-[14px] font-bold'>Champs-Élysées 246</p>
              </div>
              <div className='rounded-lg border border-black/25 mt-3 h-full max-h-[570px] overflow-y-auto'>
                {tripDetails.map((trip, index) => (
                  <div key={index} className='bg-black rounded-lg p-3 text-white leading-tight'>
                    <div className='flex justify-between items-center'>
                      <div className='space-y-1'>
                        <div className='flex pb-2 space-x-2 text-white font-semibold text-[11.5px]'>
                          <p>{trip.time}</p>
                          <p>{trip.date}</p>
                        </div>
                        {trip.places.map((place, idx) => (
                          <div key={idx} className='flex items-center space-x-2'>
                            <img src={trip.iconSrc} className='w-4 h-4' alt="not found" />
                            <p className='text-[13.5px] text-white font-semibold'>{place}</p>
                          </div>
                        ))}
                      </div>
                      <div className='text-end text-white mt-5'>
                        <p className='font-semibold text-[11.5px]'>TRIP NO.</p>
                        <p className='font-extrabold text-[20px]'>{trip.tripNo}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {tripStages.map((stage, index) => (
                  <div key={index} className='my-4 flex justify-center space-x-3 items-center'>
                    <div className='flex flex-col items-center justify-center bg-[#DDDDE1] rounded-lg py-2.5 w-[75px]'>
                      <img src={stage.iconSrc} className='w-[43px] h-[23px]' alt="not found" />
                      <p className='text-[13.5px] font-bold pt-2'>{stage.label}</p>
                    </div>
                    <div className='flex flex-col items-start justify-start text-black'>
                      <p className='text-[11.5px] font-semibold'>{stage.time}</p>
                      <p className='text-[16px] font-bold'>{stage.location}</p>
                      <p className='text-[13.5px] font-medium'>{stage.address}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className='absolute top-0 right-0 p-2 bg-gray-200 rounded-lg transition-all hover:bg-gray-300'
                onClick={handleClosePanel}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          <div className='relative h-screen md:h-full md:w-full w-auto overflow-hidden'>
            {/* <Map /> */}
            <img src={mapImage} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Schedule;
