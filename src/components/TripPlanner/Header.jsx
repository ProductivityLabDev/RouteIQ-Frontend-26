import React, { useState } from 'react';
import { Button, ButtonGroup, Input, Popover, PopoverContent, PopoverHandler } from '@material-tailwind/react';
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { CreateTrip } from '.';
import { calendericongrey } from '@/assets';

export function Header({ setSelectedTrip, selectedTrip }) {

  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <section className='mt-7'>
      <div className='flex justify-between space-y-5 xl:space-y-0 flex-wrap items-center'>
        <h1 className='text-[#202224] text-[24px] md:text-[32px] font-bold'>Trip Planner</h1>
        <div className="md:w-[250px]">
          <Popover placement="bottom">
            <PopoverHandler>
              <div className="relative">
                <Input
                  label="Select a Date"
                  onChange={() => null}
                  value={date ? format(date, "PPP") : ""}
                />
                <img src={calendericongrey} alt='' className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </PopoverHandler>
            <PopoverContent>
              <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                showOutsideDays
                className="border-0"
                classNames={{
                  caption: "flex justify-center py-1 relative items-center",
                  caption_label: "text-sm font-medium text-gray-900",
                  nav: "flex items-center",
                  nav_button: "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                  nav_button_previous: "absolute left-1.5",
                  nav_button_next: "absolute right-1.5",
                  table: "w-full border-collapse",
                  head_row: "flex font-medium text-gray-900",
                  head_cell: "m-0.5 w-9 font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal",
                  day_range_end: "day-range-end",
                  day_selected: "rounded-md bg-[#C01824] text-white hover:bg-[#C01824]/90 hover:text-white focus:bg-[#C01824] focus:text-white",
                  day_today: "rounded-md bg-gray-200 text-gray-900",
                  day_outside: "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                  day_disabled: "text-gray-500 opacity-50",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => (
                    <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                  ),
                  IconRight: ({ ...props }) => (
                    <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                  ),
                }}
              />
            </PopoverContent>
          </Popover>

        </div>
        <ButtonGroup className="border-0 outline-none rounded-md" variant="text" size='lg'>
          {['All', 'Approved', 'Pending', 'Rejected'].map(trip => (
            <Button
              key={trip}
              className={selectedTrip === trip ? 'bg-[#C01824] px-4 md:px-6 py-3 md:py-3.5 hover:bg-[#C01824]/80 text-white text-xs md:text-[14px] capitalize font-medium' : 'bg-white text-xs md:text-[14px] px-4 md:px-6 py-3 md:py-3.5 capitalize font-medium'}
              onClick={() => setSelectedTrip(trip)}
            >
              {trip}
            </Button>
          ))}
        </ButtonGroup>
        <Button
          variant='filled'
          size='lg'
          className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
          onClick={handleOpen}
        >
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
          Create Trip
        </Button>
      </div>
      <CreateTrip open={open} handleOpen={handleOpen} />
    </section>
  );
}

export default Header;
