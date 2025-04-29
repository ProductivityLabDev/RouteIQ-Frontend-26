import React, { useRef, useState } from 'react'
import VendorDashboardHeader from '@/components/VendorDashboardHeader'
import { Popover, PopoverHandler, Typography, Input, PopoverContent } from '@material-tailwind/react'
import ButtonComponent from '@/components/buttons/CustomButton'
import { CalenderIcon, editicon, filterIcon } from '@/assets'
import { CiSearch } from 'react-icons/ci'
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { FaChevronDown } from "react-icons/fa6";
import { RepairSchedlue } from '@/data/repairScheduleData'
import DatePickerComponent from '@/components/DatePicker'
import PositionedMenu from '@/components/ServiceDialog'

const RepairSchedule = ({ vehicle, onBack, handleSeeMoreInfoClick, handleEditClick, handleNotes, setShowScheduleManagement, setIsNavigate }) => {
    const [date, setDate] = useState();
    const [selectedDate, setSelectedDate] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const datePickerRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleButtonClick = () => {
        setIsCalendarOpen(!isCalendarOpen);
        if (!isCalendarOpen && datePickerRef.current) {
            datePickerRef.current.setFocus();
        }
    };
    const formattedDate = selectedDate
        ? selectedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : 'Scheduled Maintenance';

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <section className='w-full h-full'>
            <div className='bg-white w-full rounded-[4px] border shadow-sm h-full'>
                <VendorDashboardHeader title='Repair Schedule' icon={true} TextClassName='md:text-[22px]' className='ms-12' handleNavigate={onBack} />
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
                    <div className='flex flex-col items-center'>
                        <ButtonComponent sx={{ width: '244px', height: '49px', fontSize: '12px' }} label={`${selectedDate ? formattedDate : 'Scheduled Maintenance'}`} Icon={true} IconName={CalenderIcon} onClick={handleButtonClick} />
                        {isCalendarOpen && (
                            <DatePickerComponent
                                selectedDate={selectedDate}
                                onDateChange={(date) => {
                                    setSelectedDate(date);
                                    setIsCalendarOpen(false);
                                    setIsNavigate(false)
                                    setShowScheduleManagement(true)
                                }}
                                datePickerRef={datePickerRef}
                            />
                        )}
                    </div>
                </div>
                {/* ----------- table-Content -------------------- */}
                <div className='flex flex-col w-[97%] h-[40vh] m-5'>
                    <div className='flex flex-row w-[97%] h-[8vh] gap-12 justify-between m-5 items-center'>
                        <ButtonComponent label='Filters' Icon={true} IconName={filterIcon} sx={{ width: '100px', height: '43px', fontSize: '16px', fontWeight: '400', fontFamily: 'Nunito Sans, sans-serif', textTransform: 'none', gap: 1 }} onClick={handleClick} />
                        {anchorEl && (
                            <PositionedMenu
                                anchorEl={anchorEl}
                                open={open}
                                handleClose={handleClose}

                            />
                        )}
                        <div className="mr-auto w-55 flex flex-row md:max-w-screen-3xl md:w-[335px] h-[47px] bg-white border ps-4 border-[#DCDCDC] rounded-[6px] items-center">
                            <CiSearch size={25} color='#787878' />
                            <input
                                type='search'
                                placeholder="Search"
                                className='p-3 w-[98%] text-[#090909] font-light outline-none rounded-[6px] h-[45px]'
                            />
                        </div>
                        <Typography className="mb-2 text-start font-bold text-[16px] text-black">
                            Sort By
                        </Typography>
                        <div className="md:w-[250px]">
                            <Popover placement="bottom">
                                <PopoverHandler>
                                    <div className="relative">
                                        <Input
                                            label="Date"
                                            onChange={() => null}
                                            labelProps={{
                                                className: 'text-[#000]',
                                            }}
                                            value={date ? format(date, "PPP") : ""}
                                            className='bg-[#D2D2D2]'
                                        />
                                        <FaChevronDown className="absolute right-4 top-3" color='#787878' />
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
                    </div>
                    {/* -------------------- Table-Content -------------------------- */}
                    <div className="overflow-x-auto border border-gray-200 rounded">
                        <table className="min-w-full">
                            <thead className="bg-[#EEEEEE]">
                                <tr>
                                    <th className="px-6 py-3 border-b text-left text-sm font-extrabold text-black">
                                        Repair/Service Description
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-extrabold text-black">
                                        P/N
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-extrabold text-black">
                                        Part Description
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-extrabold text-black">
                                        Qty
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-extrabold text-black">
                                        Vendor
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-extrabold text-black">
                                        Part Cost
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-extrabold text-black">
                                        Mileage
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-extrabold text-black">
                                        Estimated Completion
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-extrabold text-black">
                                        Terminal
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-extrabold text-black">
                                        Notes
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {RepairSchedlue?.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                            {item.desc}
                                        </td>
                                        <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                            {item.plateNumber}
                                        </td>
                                        <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                            {item.partDesc}
                                        </td>
                                        <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                            {item.qty}
                                        </td>
                                        <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                            {item.vendor}
                                        </td>
                                        <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                            {item.partCost}
                                        </td>
                                        <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                            {item.mileage}
                                        </td>
                                        <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                            {item.estimatedCompletion}
                                        </td>
                                        <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                            {item.terminal}
                                        </td>
                                        <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#C01824] underline flex-row flex gap-7 cursor-pointer" onClick={() => handleNotes(vehicle)}>
                                            {item.notes}
                                            <div className={`flex space-x-2 md:space-x-7 justify-start items-center`} onClick={() => handleEditClick(item)}>
                                                <img src={editicon} className="cursor-pointer w-5" alt="Edit Icon" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RepairSchedule
